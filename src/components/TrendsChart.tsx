"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TrendRow } from "@/lib/types";

interface TrendsChartProps {
  data: TrendRow[];
  title: string;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TrendsChart({ data, title }: TrendsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No data for current filters
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.slice(0, 25).map((row) => ({
    name:
      row.query.length > 20 ? `${row.query.substring(0, 20)}...` : row.query,
    fullName: row.query,
    rank: row.rank,
    score: Math.max(1, 26 - row.rank),
    category: row.category,
    location: row.location,
    year: row.year,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={140} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => {
                    const d = item.payload;
                    return (
                      <div>
                        <p className="font-medium">{d.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          Rank #{d.rank} &middot; {d.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.location}, {d.year}
                        </p>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="score"
              fill="var(--color-score)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
