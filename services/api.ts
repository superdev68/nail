import moment from "moment";
import {
  IBookingPayload,
  IGetCustomerParams,
  IGetCustomerResponse,
  IGetTimeFrameParams,
  IGetTimeFrameResponse,
} from "../lib/types";
import { data, setting, merchant_timezone } from "../utilities/bookingUtils";

export const API_MODE: "mock" | "real" =
  process.env.NEXT_PUBLIC_API_MODE === "real" ? "real" : "mock";

// Serialize giống jQuery.param (mảng -> key[]=v) để server gốc hiểu
export function jqParam(obj: Record<string, any>): string {
  const parts: string[] = [];
  const add = (k: string, v: any) =>
    parts.push(
      encodeURIComponent(k) + "=" + encodeURIComponent(v == null ? "" : v)
    );
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (Array.isArray(v)) v.forEach((x) => add(k + "[]", x));
    else if (v !== undefined) add(k, v);
  });
  return parts.join("&").replace(/%20/g, "+");
}

async function postReal<T>(
  endpoint: string,
  body: Record<string, any>,
  timeout = 30000
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: jqParam(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

// ---------------- MOCK ----------------
const LS_KEY = "nailroom_mock_bookings";

interface IMockStoredBooking extends Omit<IBookingPayload, "operator_id"> {
  operator_id: number;
  created_at: string;
}

const readBookings = (): IMockStoredBooking[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]") || [];
  } catch {
    return [];
  }
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockTimeFrame({
  location_id,
  date,
  operator_id,
}: IGetTimeFrameParams): Promise<IGetTimeFrameResponse> {
  await delay(350);
  const day = moment(date).utcOffset(merchant_timezone);
  const locKey = String(location_id);
  const dayKey = String(day.day());
  const wh = (data.workingHours &&
    data.workingHours[locKey] &&
    data.workingHours[locKey][dayKey]) || {
    day_of_week: day.day(),
    is_working: 1,
    start_time: "08:00:00",
    end_time: "22:00:00",
    is_break: 0,
    break_start_time: null,
    break_end_time: null,
  };
  const { day_of_week, ...workingHours } = wh;
  const step = setting.slotMinutes || 30;
  const limit = setting.limitSlotBooking || 6;
  const bookings = readBookings().filter((b) => b.location_id == location_id);
  const timeFrame: { time: string; count: number; isSlotFull: number }[] = [];

  if (wh.is_working) {
    const [sh, sm] = wh.start_time.split(":").map(Number);
    const [eh, em] = wh.end_time.split(":").map(Number);
    const start = day.clone().hours(sh).minutes(sm).seconds(0).milliseconds(0);
    const end = day.clone().hours(eh).minutes(em).seconds(0).milliseconds(0);
    for (
      let t = start.clone();
      !t.clone().add(step, "minutes").isAfter(end);
      t.add(step, "minutes")
    ) {
      const iso = t.toISOString();
      const count = bookings.filter(
        (b) =>
          b.booked_at === iso && (!operator_id || b.operator_id == operator_id)
      ).length;
      timeFrame.push({
        time: iso,
        count,
        isSlotFull: operator_id ? (count > 0 ? 1 : 0) : count >= limit ? 1 : 0,
      });
    }
  }
  return { status: 1, timeFrame: { workingHours, timeFrame } };
}

export async function mockCustomer({
  mobile,
  email,
}: IGetCustomerParams): Promise<IGetCustomerResponse> {
  await delay(300);
  const b = readBookings()
    .slice()
    .reverse()
    .find(
      (x) =>
        (mobile && x.mobile.replace(/\s/g, "") === mobile) ||
        (email && x.email === email)
    );
  if (!b) return { status: 1, data: {} };
  return {
    status: 1,
    data: {
      id: b.customer_id || 1,
      full_name: b.customer_name,
      gender: b.gender,
      email: b.email,
      mobile: b.mobile.replace(/\s/g, ""),
      phone_country_code: b.phone_country_code || undefined,
    },
  };
}

export async function mockBooking(
  body: IBookingPayload
): Promise<{ status: number; data?: { booking_code: string }; message?: string }> {
  await delay(600);
  const list = readBookings();
  list.push({
    ...body,
    operator_id: body.operator_id[0],
    created_at: new Date().toISOString(),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }
  return { status: 1, data: { booking_code: body.booking_code } };
}

// ---------------- PUBLIC ----------------
export const getTimeFrame = (
  params: IGetTimeFrameParams
): Promise<IGetTimeFrameResponse> =>
  API_MODE === "real"
    ? postReal<IGetTimeFrameResponse>("/get-time-frame", params, 30000)
    : mockTimeFrame(params);

export const getCustomerByMobile = (
  params: IGetCustomerParams
): Promise<IGetCustomerResponse> =>
  API_MODE === "real"
    ? postReal<IGetCustomerResponse>("/dat-lich/getCustomerByMobile", params)
    : mockCustomer(params);

export const createBooking = (
  payload: IBookingPayload
): Promise<{ status: number; data?: { booking_code: string }; message?: string }> =>
  API_MODE === "real"
    ? postReal("/dat-lich", payload, 60000)
    : mockBooking(payload);
