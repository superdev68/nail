import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../lib/config";

export const configApi = {
  api: {
    bodyParser: false, // Để giữ nguyên stream truyền sang backend
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const targetHost = config.targetUrl || "http://localhost:8282";
  const url = `${targetHost}${req.url}`;

  try {
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (k.toLowerCase() !== "host" && v != null) {
        headers[k] = Array.isArray(v) ? v.join(", ") : v;
      }
    }

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      init.body = Buffer.concat(chunks);
    }

    const backendRes = await fetch(url, init);
    const contentType = backendRes.headers.get("content-type") || "";

    res.status(backendRes.status);
    backendRes.headers.forEach((val, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        res.setHeader(key, val);
      }
    });

    if (contentType.includes("application/json")) {
      const data = await backendRes.json();
      return res.json(data);
    } else {
      const text = await backendRes.text();
      return res.send(text);
    }
  } catch (err: any) {
    return res.status(502).json({
      status: 0,
      message: "Không thể kết nối đến nail-backend: " + (err?.message || err),
    });
  }
}
