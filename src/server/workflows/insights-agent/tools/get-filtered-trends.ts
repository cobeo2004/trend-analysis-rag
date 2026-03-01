import { RetryableError } from "workflow";
import { prisma } from "@/lib/db";

export const getFilteredTrendsStep = async (input: {
  filters?: { year?: number; category?: string; location?: string };
}) => {
  "use step";

  const { filters } = input;

  const where: Record<string, unknown> = {};
  if (filters?.year) where.year = filters.year;
  if (filters?.category) where.category = filters.category;
  if (filters?.location) where.location = filters.location;

  let rows: Array<Record<string, unknown>>;
  try {
    const result = await prisma.trendEntry.findMany({
      where,
      orderBy: { rank: "asc" },
      take: 20,
    });
    rows = result as unknown as Array<Record<string, unknown>>;
  } catch (error) {
    throw new RetryableError(
      `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
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
