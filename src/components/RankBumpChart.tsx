"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TrendRow } from "@/lib/types";

interface RankBumpChartProps {
  data: TrendRow[];
  category: string;
  location: string;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];

export function RankBumpChart({
  data,
  category,
  location,
}: RankBumpChartProps) {
  if (data.length === 0) {
    return null;
  }

  const queryMap = new Map<string, Map<number, number>>();
  for (const row of data) {
    if (!queryMap.has(row.query)) {
      queryMap.set(row.query, new Map());
    }
    queryMap.get(row.query)?.set(row.year, row.rank);
  }

  const multiYearQueries = Array.from(queryMap.entries())
    .filter(([, years]) => years.size >= 2)
    .slice(0, 8);

  if (multiYearQueries.length === 0) {
    return null;
  }

  const allYears = Array.from(new Set(data.map((d) => d.year))).sort();

  const chartData = allYears.map((year) => {
    const point: Record<string, number> = { year };
    for (const [query, yearMap] of multiYearQueries) {
      const rank = yearMap.get(year);
      if (rank !== undefined) {
        point[query] = rank;
      }
    }
    return point;
  });

  const chartConfig: ChartConfig = {};
  for (const [query, , i] of multiYearQueries.map(
    ([q, m], idx) => [q, m, idx] as const,
  )) {
    chartConfig[query] = {
      label: query.length > 15 ? `${query.substring(0, 15)}...` : query,
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Rank Changes Over Time</CardTitle>
        <CardDescription>
          {category} in {location} (rank 1 = top)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              reversed
              domain={[1, "auto"]}
              label={{
                value: "Rank",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {multiYearQueries.map(([query], i) => (
              <Line
                key={query}
                type="monotone"
                dataKey={query}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
