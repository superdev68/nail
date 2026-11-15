import type { NextApiRequest, NextApiResponse } from "next";
import config from "../../lib/config";
import { jqParam, mockTimeFrame } from "../../services/api";

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
      const response = await fetch(`${config.targetUrl}/get-time-frame`, {
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

    const { merchant_id, location_id, date, operator_id } = req.body || {};
    const result = await mockTimeFrame({
      merchant_id: Number(merchant_id),
      location_id: Number(location_id),
      date: String(date),
      operator_id: operator_id ? Number(operator_id) : undefined,
    });
    return res.status(200).json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({ status: 0, message: err?.message || "Internal server error" });
  }
}
