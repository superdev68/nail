import moment from "moment";
import config from "../lib/config";
import {
  IBookingPayload,
  IGetCustomerParams,
  IGetCustomerResponse,
  IGetTimeFrameParams,
  IGetTimeFrameResponse,
  ILocation,
  IOperator,
  IProduct,
  IProductGroup,
} from "../lib/types";
import {
  applyMerchantData,
  data,
  merchant_timezone,
  setting,
} from "../utilities/bookingUtils";

export const API_MODE: "mock" | "real" =
  config.apiMode === "real" ? "real" : "mock";

const BASE_URL = config.targetUrl || "http://localhost:8282";

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

/**
 * Generic request helper gọi backend Spring Boot
 */
async function requestBackend<T>(
  endpoint: string,
  options?: RequestInit,
  timeout = 30000
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);

  // Chuẩn hóa URL: gọi trực tiếp backend hoặc qua Next.js proxy
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const directUrl = `${BASE_URL}${normalizedPath}`;

  try {
    const res = await fetch(directUrl, {
      ...options,
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    // Nếu gọi direct bị lỗi, thử gọi qua proxy /api
    try {
      const proxyUrl = `/api${normalizedPath}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: ctrl.signal,
      });
      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch (ignored) {}
    throw err;
  } finally {
    clearTimeout(t);
  }
}

async function postReal<T>(
  endpoint: string,
  body: Record<string, any>,
  timeout = 30000
): Promise<T> {
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return requestBackend<T>(
    normalized,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: jqParam(body),
    },
    timeout
  );
}

// -----------------------------------------------------------------
// MOCK FALLBACK (Khi chạy offline hoặc không có backend)
// -----------------------------------------------------------------
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

// -----------------------------------------------------------------
// TẤT CẢ CÁC API TỪ SOURCE NAIL-BACKEND
// -----------------------------------------------------------------

/**
 * 1. Lấy danh sách Chi nhánh (Locations) từ /api/locations
 */
export async function getLocations(params?: {
  page?: number;
  size?: number;
  city?: string;
  isActive?: boolean;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/locations${query}`);
}

/**
 * 2. Lấy danh mục dịch vụ từ /api/service-categories
 */
export async function getServiceCategories(params?: {
  page?: number;
  size?: number;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/service-categories${query}`);
}

/**
 * 3. Lấy danh sách dịch vụ từ /api/services
 */
export async function getServices(params?: {
  page?: number;
  size?: number;
  categoryId?: number;
  isActive?: boolean;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/services${query}`);
}

/**
 * 4. Lấy danh sách Kỹ thuật viên (Technicians) từ /api/technicians
 */
export async function getTechnicians(params?: {
  page?: number;
  size?: number;
  locationId?: number;
  status?: string;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/technicians${query}`);
}

/**
 * 5. Lấy lịch làm việc của Kỹ thuật viên từ /api/technician-schedules
 */
export async function getTechnicianSchedules(params?: {
  page?: number;
  size?: number;
  technicianId?: number;
  workDate?: string;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/technician-schedules${query}`);
}

/**
 * 6. Lấy options tổng hợp từ /api/options
 */
export async function getOptions(): Promise<any> {
  return requestBackend(`/api/options`);
}

/**
 * 7. Lấy toàn bộ dữ liệu Salon (Bootstrap/Merchant Data) từ /api/public/merchant-data
 */
export async function getMerchantData(): Promise<any> {
  return requestBackend(`/api/public/merchant-data`);
}

/**
 * 8. Lấy danh sách lịch hẹn (Appointments) từ /api/appointments
 */
export async function getAppointments(params?: {
  page?: number;
  size?: number;
  locationId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<any> {
  const query = params ? "?" + jqParam(params) : "";
  return requestBackend(`/api/appointments${query}`);
}

/**
 * 9. Cập nhật trạng thái lịch hẹn /api/appointments/:id/status
 */
export async function updateAppointmentStatus(
  id: number,
  status: string
): Promise<any> {
  return requestBackend(`/api/appointments/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/**
 * 10. Lấy khung giờ còn trống (Time Frame / Slots) từ /api/get-time-frame
 */
export const getTimeFrame = (
  params: IGetTimeFrameParams
): Promise<IGetTimeFrameResponse> =>
  API_MODE === "real"
    ? postReal<IGetTimeFrameResponse>("/api/get-time-frame", params, 30000)
    : mockTimeFrame(params);

/**
 * 11. Tra cứu thông tin khách hàng cũ theo SĐT từ /api/dat-lich/getCustomerByMobile
 */
export const getCustomerByMobile = (
  params: IGetCustomerParams
): Promise<IGetCustomerResponse> =>
  API_MODE === "real"
    ? postReal<IGetCustomerResponse>(
        "/api/dat-lich/getCustomerByMobile",
        params
      )
    : mockCustomer(params);

/**
 * 12. Tạo lịch hẹn đặt chỗ từ /api/dat-lich
 */
export const createBooking = (
  payload: IBookingPayload
): Promise<{ status: number; data?: { booking_code: string }; message?: string }> =>
  API_MODE === "real"
    ? postReal("/api/dat-lich", payload, 60000)
    : mockBooking(payload);

// -----------------------------------------------------------------
// HÀM TẢI VÀ ĐỒNG BỘ DỮ LIỆU TỪ BACKEND VÀO ỨNG DỤNG NAIL
// -----------------------------------------------------------------
let hasInitializedBackend = false;

export async function initMerchantDataFromBackend(): Promise<boolean> {
  if (API_MODE !== "real") return false;
  if (hasInitializedBackend) return true;

  try {
    // 1. Thử lấy toàn bộ dữ liệu salon qua API /api/public/merchant-data
    try {
      const merchant = await getMerchantData();
      if (merchant && merchant.location && merchant.location.length > 0) {
        applyMerchantData(merchant);
        hasInitializedBackend = true;
        console.log("Đã tải dữ liệu Salon thành công từ backend qua /api/public/merchant-data");
        return true;
      }
    } catch (e) {
      console.warn("Chưa tải được merchant-data, thử tải qua các API chi tiết...");
    }

    // 2. Fallback: Lấy song song từ các API con /api/locations, /api/services, /api/technicians
    const [locRes, catRes, svcRes, techRes] = await Promise.allSettled([
      getLocations({ size: 100 }),
      getServiceCategories({ size: 100 }),
      getServices({ size: 200 }),
      getTechnicians({ size: 200 }),
    ]);

    const locations: ILocation[] =
      locRes.status === "fulfilled" && locRes.value?.content
        ? locRes.value.content.map((l: any) => ({
            id: l.id,
            name: l.name,
            phone: l.phone || "",
            address: l.address || "",
            fullAddress: (l.address || "") + ", " + (l.city || ""),
            city_name: l.city || "",
            city_code: 1,
            district_code: 1,
            country_code: "VN",
            sort_order: l.id,
          }))
        : [];

    const categories: IProductGroup[] =
      catRes.status === "fulfilled" && catRes.value?.content
        ? catRes.value.content.map((c: any) => ({
            id: c.id,
            name: c.name,
            is_active: 1,
            show_type: 1,
          }))
        : [];

    const locIds = locations.map((l) => l.id);

    const services: IProduct[] =
      svcRes.status === "fulfilled" && svcRes.value?.content
        ? svcRes.value.content.map((s: any) => ({
            id: s.id,
            name: s.name,
            sku: "SV_" + s.id,
            type: "SERVICE",
            group_id: s.categoryId || (s.category ? s.category.id : 1),
            group_name: s.categoryName || (s.category ? s.category.name : ""),
            default_price: s.price || 0,
            service_duration: s.durationMinutes || 60,
            description: s.description || "",
            location_ids: locIds,
            edit_price_in_order: 0,
          }))
        : [];

    const technicians: IOperator[] =
      techRes.status === "fulfilled" && techRes.value?.content
        ? techRes.value.content.map((t: any) => ({
            id: t.id,
            name: t.fullName,
            title: "Kỹ thuật viên",
            avatar_url: t.avatarUrl || null,
            phone: t.phone || "",
            location_id: t.locationId || (t.location ? t.location.id : 1),
          }))
        : [];

    if (locations.length > 0) {
      applyMerchantData({
        location: locations,
        product_groups: categories,
        product: services,
        operator: technicians,
      });
      hasInitializedBackend = true;
      console.log("Đã ghép thành công dữ liệu từ các API con của backend!");
      return true;
    }
  } catch (err) {
    console.error("Không thể kết nối đến backend API, giữ dữ liệu mặc định:", err);
  }
  return false;
}
