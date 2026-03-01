import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { prisma } from "@/lib/db";
import { processTrendsWorkflow } from "@/server/workflows/process-trends";

export async function POST() {
  // Check if already processing or completed
  const existing = await prisma.processingStatus.findFirst({
    where: { status: { in: ["processing", "completed"] } },
  });

  if (existing?.status === "completed") {
    return NextResponse.json({ status: "already_completed" });
  }

  if (existing?.status === "processing") {
    return NextResponse.json({ status: "already_processing" });
  }

  await start(processTrendsWorkflow, []);

  return NextResponse.json({ status: "started" });
}

export async function GET() {
  const status = await prisma.processingStatus.findFirst({
    orderBy: { id: "desc" },
  });

  if (!status) {
    return NextResponse.json({
      status: "pending",
      total: 0,
      processed: 0,
      error: null,
    });
  }

  return NextResponse.json({
    id: status.id,
    status: status.status,
    total: status.total,
    processed: status.processed,
    error: status.error,
  });
}
