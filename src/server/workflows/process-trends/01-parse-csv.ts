import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { RetryableError } from "workflow";
import { prisma } from "@/lib/db";

interface CSVRow {
  location: string;
  year: string;
  category: string;
  rank: string;
  query: string;
}

export const parseCSVStep = async () => {
  "use step";

  const csvPath = path.join(process.cwd(), "public/data/trends.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const { data } = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Bulk insert in chunks of 1000
  const chunkSize = 1000;
  try {
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await prisma.trendEntry.createMany({
        data: chunk.map((row) => ({
          location: row.location,
          year: Number.parseInt(row.year, 10),
          category: row.category,
          rank: Number.parseInt(row.rank, 10),
          query: row.query,
        })),
      });
    }
  } catch (error) {
    throw new RetryableError(
      `Bulk insert failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "2s" },
    );
  }

  // Update processing status
  await prisma.processingStatus.updateMany({
    where: { status: "processing" },
    data: { total: data.length },
  });

  return { totalRows: data.length };
};
