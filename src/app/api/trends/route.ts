import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  const where: Record<string, unknown> = {};
  if (year) where.year = Number.parseInt(year, 10);
  if (category) where.category = category;
  if (location) where.location = location;

  const [data, locations, categories, years] = await Promise.all([
    prisma.trendEntry.findMany({
      where,
      orderBy: { rank: "asc" },
      take: 200,
    }),
    prisma.trendEntry.findMany({
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    }),
    prisma.trendEntry.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.trendEntry.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "asc" },
    }),
  ]);

  return NextResponse.json({
    data,
    metadata: {
      locations: locations.map((l) => l.location),
      categories: categories.map((c) => c.category),
      years: years.map((y) => y.year),
    },
  });
}
