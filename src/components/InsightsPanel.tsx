"use client";

import { Check, CircleX, Loader2, SendHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInsights } from "@/hooks/useInsights";
import type { TrendsFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

const toolLabels: Record<string, string> = {
  searchTrends: "Searching trends",
  getFilteredTrends: "Filtering trends",
};

function getToolLabel(toolName: string) {
  return toolLabels[toolName] ?? `Running ${toolName}`;
}

interface InsightsPanelProps {
  filters: TrendsFilters;
}

export function InsightsPanel({ filters }: InsightsPanelProps) {
  const [question, setQuestion] = useState("");
  const { messages, sendMessage, status, clearHistory } = useInsights(filters);
  const isLoading = status === "streaming" || status === "submitted";
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCount = messages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    sendMessage({ text: question });
    setQuestion("");
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm">AI Insights</CardTitle>
          <p className="text-xs text-muted-foreground">
            Ask questions about the trends data
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={clearHistory}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Clear history</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] px-5" ref={scrollRef}>
          {messages.length > 0 ? (
            <div className="space-y-4 py-4">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col",
                      isUser ? "items-end" : "items-start",
                    )}
                  >
                    {message.parts.map((part, i) => {
                      const key = `${message.id}-part-${i}`;

                      if (part.type === "text") {
                        if (isUser) {
                          return (
                            <div
                              key={key}
                              className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                            >
                              <p>{part.text}</p>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={key}
                            className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h2: ({ children }) => (
                                  <h4 className="mt-2 mb-1 font-semibold">
                                    {children}
                                  </h4>
                                ),
                                h3: ({ children }) => (
                                  <h5 className="mt-1.5 mb-0.5 font-medium">
                                    {children}
                                  </h5>
                                ),
                                p: ({ children }) => (
                                  <p className="my-0.5">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="my-1 list-disc pl-4">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="my-1 list-decimal pl-4">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="my-0.5">{children}</li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),
                                code: ({ children, className }) => {
                                  const isBlock =
                                    className?.includes("language-");
                                  if (isBlock) {
                                    return (
                                      <code className="block overflow-x-auto rounded bg-background/50 p-2 text-xs">
                                        {children}
                                      </code>
                                    );
                                  }
                                  return (
                                    <code className="rounded bg-background/50 px-1 py-0.5 text-xs">
                                      {children}
                                    </code>
                                  );
                                },
                                pre: ({ children }) => (
                                  <pre className="my-1">{children}</pre>
                                ),
                                table: ({ children }) => (
                                  <div className="my-1 overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                th: ({ children }) => (
                                  <th className="border-b px-2 py-1 text-left font-medium">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border-b px-2 py-1">
                                    {children}
                                  </td>
                                ),
                                a: ({ children, href }) => (
                                  <a
                                    href={href}
                                    className="text-primary underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        );
                      }

                      if (
                        part.type.startsWith("tool-") ||
                        part.type === "dynamic-tool"
                      ) {
                        const toolPart = part as {
                          type: string;
                          toolName?: string;
                          state: string;
                          errorText?: string;
                        };
                        const toolName =
                          toolPart.toolName ?? part.type.replace("tool-", "");
                        const label = getToolLabel(toolName);
                        const isRunning =
                          toolPart.state === "input-streaming" ||
                          toolPart.state === "input-available";
                        const isError = toolPart.state === "output-error";

                        return (
                          <div
                            key={key}
                            className="my-1 flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            {isRunning ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : isError ? (
                              <CircleX className="size-3 text-destructive" />
                            ) : (
                              <Check className="size-3 text-green-600 dark:text-green-400" />
                            )}
                            <span>
                              {isRunning
                                ? `${label}...`
                                : isError
                                  ? `${label} failed`
                                  : `${label} done`}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                );
              })}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-20 text-sm text-muted-foreground">
              Ask a question to get AI-powered insights
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-3">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What trends stand out in this data?"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
