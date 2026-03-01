import { createUIMessageStreamResponse } from "ai";
import { getRun } from "workflow/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params;
  const url = new URL(request.url);
  const startIndex = Number(url.searchParams.get("startIndex") ?? "0");

  const run = getRun(runId);
  const stream = run.getReadable({ startIndex });

  return createUIMessageStreamResponse({
    stream,
    headers: {
      "x-workflow-run-id": runId,
    },
  });
}
