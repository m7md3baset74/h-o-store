import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { link, name, user, pass, ba1, ba2, ba3, platform } = body;

    // Accept full futtransfer URL or just the base64 code
    let base64Link = link;
    if (link.includes("futtransfer.top")) {
      try {
        const parsed = new URL(link);
        base64Link = parsed.searchParams.get("link") || link;
      } catch {
        const match = link.match(/[?&]link=([^&]+)/);
        base64Link = match ? decodeURIComponent(match[1]) : link;
      }
    }

    // Fetch the submit page to get amount + session cookies
    const pageRes = await fetch(
      `https://futtransfer.top/submitDetails?link=${base64Link}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        },
      }
    );
    const pageHtml = await pageRes.text();

    const amountMatch =
      pageHtml.match(/name=["']amount["']\s+value=["']([^"']+)["']/) ||
      pageHtml.match(/value=["']([^"']+)["']\s+name=["']amount["']/) ||
      pageHtml.match(/"amount"\s*:\s*"?(\d+)"?/) ||
      pageHtml.match(/amount['":\s]+(\d+)/);
    const amount = amountMatch ? amountMatch[1] : "";

    const cookies = pageRes.headers.get("set-cookie") || "";

    const formData = new URLSearchParams();
    formData.append("link", base64Link);
    formData.append("name", name);
    formData.append("user", user);
    formData.append("pass", pass);
    formData.append("ba1", ba1);
    formData.append("ba2", ba2 || "");
    formData.append("ba3", ba3 || "");
    formData.append("platform", platform);
    if (amount) formData.append("amount", amount);

    const submitRes = await fetch(
      "https://futtransfer.top/submitDetailsAction.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
          Referer: `https://futtransfer.top/submitDetails?link=${base64Link}`,
          Origin: "https://futtransfer.top",
          ...(cookies ? { Cookie: cookies } : {}),
        },
        body: formData.toString(),
        redirect: "manual",
      }
    );

    const responseText = await submitRes.text();

    let parsed: any = null;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // not JSON
    }

    // Handle JSON success response
    if (parsed?.status === "success" && parsed?.orderID && parsed?.verify) {
      const shortCode = parsed.orderID.replace(/-/g, "").slice(0, 8);
      await redis.set(`order:${shortCode}`, { orderID: parsed.orderID, verify: parsed.verify });
      return NextResponse.json({ orderID: parsed.orderID, verify: parsed.verify, shortCode });
    }

    // Handle redirect (fallback)
    const location = submitRes.headers.get("location");
    if (location) {
      const redirectUrl = new URL(location, "https://futtransfer.top");
      const orderID = redirectUrl.searchParams.get("orderID");
      const verify = redirectUrl.searchParams.get("verify");
      if (orderID && verify) {
        const shortCode = orderID.split("-")[0];
        await redis.set(`order:${shortCode}`, { orderID, verify });
        return NextResponse.json({ orderID, verify, shortCode });
      }
    }

    return NextResponse.json({
      error: parsed?.message || responseText.slice(0, 200) || "Unknown error from futtransfer",
      status: submitRes.status,
    }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}