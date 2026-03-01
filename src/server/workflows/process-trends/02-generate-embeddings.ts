import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { embedMany } from "ai";
import { RetryableError } from "workflow";
import { libsqlClient, prisma } from "@/lib/db";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateEmbeddingsStep = async (batchIndex: number) => {
  "use step";

  const batchSize = 100;
  const offset = batchIndex * batchSize;

  // Fetch rows without embeddings
  const rows = await prisma.trendEntry.findMany({
    skip: offset,
    take: batchSize,
    orderBy: { id: "asc" },
  });

  if (rows.length === 0) {
    return { done: true, processed: 0 };
  }

  // Create text representations for embedding
  const texts = rows.map(
    (row) =>
      `${row.query} - ${row.category} in ${row.location}, ${row.year}, rank #${row.rank}`,
  );

  let embeddings: number[][];
  try {
    const result = await embedMany({
      model: openrouter.textEmbeddingModel("openai/text-embedding-3-small"),
      values: texts,
    });
    embeddings = result.embeddings;
  } catch (error) {
    throw new RetryableError(
      `Embedding API failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "10s" },
    );
  }

  // Store embeddings via raw SQL
  try {
    for (let i = 0; i < rows.length; i++) {
      const embedding = embeddings[i];
      const row = rows[i];
      const vectorStr = `[${embedding.join(",")}]`;
      await libsqlClient.execute({
        sql: "UPDATE TrendEntry SET embedding = vector32(?) WHERE id = ?",
        args: [vectorStr, row.id],
      });
    }
  } catch (error) {
    throw new RetryableError(
      `Vector storage failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "2s" },
    );
  }

  // Update processed count based on actual DB state
  const processedCount = await prisma.trendEntry.count();
  const embeddedCount = offset + rows.length;
  await prisma.processingStatus.updateMany({
    where: { status: "processing" },
    data: { processed: Math.min(embeddedCount, processedCount) },
  });

  return { done: rows.length < batchSize, processed: rows.length };
};
