import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const verify = searchParams.get("verify");

  const res = await fetch(
    `https://futtransfer.top/getOrderStatus.php?uuid=${code}&verify=${verify}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}