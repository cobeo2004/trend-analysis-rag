import { prisma } from "@/lib/db";

export const markCompletedStep = async (totalRows: number) => {
  "use step";

  await prisma.processingStatus.updateMany({
    where: { status: "processing" },
    data: { status: "completed", processed: totalRows },
  });

  return { status: "completed" as const, totalRows };
};
