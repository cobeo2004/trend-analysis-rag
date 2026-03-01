import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { embed } from "ai";
import { RetryableError } from "workflow";
import { libsqlClient } from "@/lib/db";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const searchTrendsStep = async (input: {
  query: string;
  filters?: { year?: number; category?: string; location?: string };
}) => {
  "use step";

  const { query, filters } = input;

  const filterContext = [
    filters?.location && `location: ${filters.location}`,
    filters?.year && `year: ${filters.year}`,
    filters?.category && `category: ${filters.category}`,
  ]
    .filter(Boolean)
    .join(", ");

  const embeddingText = filterContext ? `${query} (${filterContext})` : query;

  let queryEmbedding: number[];
  try {
    const { embedding } = await embed({
      model: openrouter.textEmbeddingModel("openai/text-embedding-3-small"),
      value: embeddingText,
    });
    queryEmbedding = embedding;
  } catch (error) {
    throw new RetryableError(
      `Embedding API failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "10s" },
    );
  }

  const vectorStr = `[${queryEmbedding.join(",")}]`;

  let rows: Array<Record<string, unknown>>;
  try {
    const vectorResults = await libsqlClient.execute({
      sql: `SELECT t.* FROM vector_top_k('trends_vector_idx', vector32(?), 20) AS v
            JOIN TrendEntry AS t ON t.rowid = v.id`,
      args: [vectorStr],
    });
    rows = vectorResults.rows as unknown as Array<Record<string, unknown>>;
  } catch (error) {
    throw new RetryableError(
      `Vector search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "2s" },
    );
  }

  return rows
    .map(
      (row) =>
        `- "${row.query}" in ${row.category}, ${row.location} (${row.year}), rank #${row.rank}`,
    )
    .join("\n");
};
