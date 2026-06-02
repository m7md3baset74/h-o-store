import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderID, verify, updateType, user, pass, ba1 } = body;

    const formData = new URLSearchParams();
    formData.append("orderID", orderID);
    formData.append("verify", verify);
    formData.append("code", "verify");
    formData.append("updateType", updateType);

    if (updateType === "credentials") {
      formData.append("user", user);
      formData.append("pass", pass);
    } else if (updateType === "ba1") {
      formData.append("ba1", ba1);
    }

    const res = await fetch("https://futtransfer.top/updateCredentials.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        Origin: "https://futtransfer.top",
        Referer: "https://futtransfer.top/orderStatus",
      },
      body: formData.toString(),
    });

    const text = await res.text();
    return NextResponse.json({ result: text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}