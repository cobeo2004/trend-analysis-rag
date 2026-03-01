import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { sayHelloWorkflow } from "@/server/workflows/say-hello";

export async function POST(request: Request) {
  const { name } = (await request.json()) as { name: string };
  const res = await start(sayHelloWorkflow, [name]);
  return NextResponse.json(await res.returnValue);
}
