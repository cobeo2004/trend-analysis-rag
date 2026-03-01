import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { start } from "workflow/api";
import { insightsAgentWorkflow } from "@/server/workflows/insights-agent";

export async function POST(request: Request) {
  const { messages, filters } = (await request.json()) as {
    messages: UIMessage[];
    filters?: { year?: number; category?: string; location?: string };
  };

  // Extract the latest user message as the query
  const lastUserMessage = messages.findLast((m) => m.role === "user");
  const query =
    lastUserMessage?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  const run = await start(insightsAgentWorkflow, [query, filters]);

  return createUIMessageStreamResponse({
    stream: run.readable,
    headers: {
      "x-workflow-run-id": run.runId,
    },
  });
}
