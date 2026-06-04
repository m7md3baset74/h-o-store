import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  // جرب تجيب من Upstash الأول
  let stored = await redis.get<{ orderID: string; verify: string }>(`order:${code}`);

  // لو مش لاقيه، ابحث عن أي order أول مقطع من الـ orderID بتاعه = code
  if (!stored) {
    const keys = await redis.keys(`order:*`);
    for (const key of keys) {
      const val = await redis.get<{ orderID: string; verify: string }>(key);
      if (val?.orderID.split("-")[0] === code) {
        stored = val;
        break;
      }
    }
  }

  if (stored) {
    const res = await fetch(
      `https://futtransfer.top/getOrderStatus.php?uuid=${stored.orderID}&verify=${stored.verify}`
    );
    const data = await res.json();
    const enriched = data.map((item: any) => ({
      ...item,
      _orderID: stored!.orderID,
      _verify: stored!.verify,
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