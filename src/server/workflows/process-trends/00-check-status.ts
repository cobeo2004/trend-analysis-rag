import { RetryableError } from "workflow";
import { prisma } from "@/lib/db";
import { ensureVectorSupport } from "@/lib/db-setup";

export const checkAndInitStep = async () => {
  "use step";

  // Check if already processed
  const existing = await prisma.processingStatus.findFirst({
    where: { status: "completed" },
  });
  if (existing) {
    return { alreadyCompleted: true, totalRows: 0 };
  }

  // Set up vector support
  try {
    await ensureVectorSupport();
  } catch (error) {
    throw new RetryableError(
      `Vector setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { retryAfter: "2s" },
    );
  }

  // Create processing status
  await prisma.processingStatus.create({
    data: { status: "processing" },
  });

  return { alreadyCompleted: false, totalRows: 0 };
};
