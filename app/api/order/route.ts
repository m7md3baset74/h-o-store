import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  // جرب تجيب من Upstash الأول
  const stored = await redis.get<{ orderID: string; verify: string }>(`order:${code}`);
  
  if (stored) {
    const res = await fetch(
      `https://futtransfer.top/getOrderStatus.php?uuid=${stored.orderID}&verify=${stored.verify}`
    );
    const data = await res.json();
    const enriched = data.map((item: any) => ({
      ...item,
      _orderID: stored.orderID,
      _verify: stored.verify,
    }));
    return NextResponse.json(enriched);
  }

  // fallback للـ short name القديم
  const res = await fetch(
    `https://futtransfer.top/getOrderStatus.php?uuid=LOOKUP&verify=${code}&code=${code}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}