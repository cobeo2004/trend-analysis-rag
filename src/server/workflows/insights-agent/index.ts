import "server-only";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CompatibleLanguageModel, DurableAgent } from "@workflow/ai/agent";
import { tool, type UIMessageChunk } from "ai";
import { getWritable } from "workflow";
import { z } from "zod";
import type { TrendsFilters } from "@/lib/types";
import { getFilteredTrendsStep } from "./tools/get-filtered-trends";
import { searchTrendsStep } from "./tools/search-trends";

/**
 * Workflow-compatible model provider.
 * Wraps model creation in "use step" so only the serializable model ID
 * is captured — not the model object itself.
 */
function openrouter(modelId: string) {
  return async () => {
    "use step";
    const provider = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return provider(modelId) as unknown as CompatibleLanguageModel;
  };
}

const filtersSchema = z
  .object({
    year: z.number().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
  })
  .optional();

export const insightsAgentWorkflow = async (
  query: string,
  filters?: TrendsFilters,
) => {
  "use workflow";

  const writable = getWritable<UIMessageChunk>();

  const agent = new DurableAgent({
    model: openrouter("anthropic/claude-3.5-haiku"),
    system: `You are a Google Search Trends analyst. Analyze search trend data and provide insights about patterns, cultural shifts, and notable observations.
Be concise but insightful. Use specific data points from the context provided.
Format your response with clear sections using markdown.

You have access to tools that search the trends database. Use them to gather relevant data before providing your analysis.`,
    tools: {
      searchTrends: tool({
        description:
          "Search for trends using vector similarity. Best for semantic/conceptual queries.",
        inputSchema: z.object({
          query: z.string().describe("The search query for finding trends"),
          filters: filtersSchema.describe(
            "Optional filters for year, category, or location",
          ),
        }),
        execute: async (input) => searchTrendsStep(input),
      }),
      getFilteredTrends: tool({
        description:
          "Get trends by exact filters (year, category, location). Use as fallback when vector search is unavailable or for precise filtering.",
        inputSchema: z.object({
          filters: filtersSchema.describe(
            "Filters for year, category, or location",
          ),
        }),
        execute: async (input) => getFilteredTrendsStep(input),
      }),
    },
  });

  const filterContext = [
    filters?.location && `location: ${filters.location}`,
    filters?.year && `year: ${filters.year}`,
    filters?.category && `category: ${filters.category}`,
  ]
    .filter(Boolean)
    .join(", ");

  const prompt = filterContext
    ? `${query}\n\nCurrent filters applied: ${filterContext}`
    : query;

  await agent.stream({
    messages: [{ role: "user", content: prompt }],
    writable,
    maxSteps: 5,
  });
};
