import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../../lib/config";
import { jqParam } from "../../../services/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: 0, message: "Method not allowed" });
  }

  try {
    if (config.apiMode === "real") {
      const bodyStr =
        typeof req.body === "string" ? req.body : jqParam(req.body || {});
      const response = await fetch(`${config.targetUrl}/dat-lich/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: bodyStr,
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(200).json({
      status: 1,
      data: { booking_code: req.body?.booking_code || "MOCK_CODE" },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ status: 0, message: err?.message || "Internal server error" });
  }
}
