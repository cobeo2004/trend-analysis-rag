"use client";

import { Database, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProcessingStatus } from "@/hooks/useProcessingStatus";

export function ProcessingPanel() {
  const { data: status } = useProcessingStatus();
  const [starting, setStarting] = useState(false);

  const handleProcess = async () => {
    setStarting(true);
    try {
      await fetch("/api/process", { method: "POST" });
    } finally {
      setStarting(false);
    }
  };

  const isProcessing = status?.status === "processing";
  const isCompleted = status?.status === "completed";
  const progress =
    status?.total && status.total > 0
      ? Math.round((status.processed / status.total) * 100)
      : 0;

  if (isCompleted) return null;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Database className="size-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Google Search Trends Data</h2>
        <p className="text-sm text-muted-foreground">
          Process ~27K rows of search trends from 2001-2020 across 84 countries
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {isProcessing ? (
          <div className="w-full space-y-3">
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {status?.processed?.toLocaleString()} /{" "}
                {status?.total?.toLocaleString()} rows
              </span>
              <span>{progress}%</span>
            </div>
            {status.processed > 0 && status.total > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Generating embeddings... This may take a few minutes.
              </p>
            )}
          </div>
        ) : (
          <Button onClick={handleProcess} disabled={starting}>
            {starting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {starting ? "Starting..." : "Process Data"}
          </Button>
        )}

        {status?.error && (
          <p className="text-sm text-destructive">{status.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
