import moment, { Moment } from "moment";
import merchantData from "../mock/merchantData";
import {
  ILocation,
  IMerchantSetting,
  IOperator,
  IProduct,
  IRegion,
  SectionOfDay,
} from "../lib/types";
import { ILocaleTexts } from "../locales/vi";

export const data = merchantData;
export const setting: IMerchantSetting = data.setting || ({} as IMerchantSetting);
if (!setting.limitBookingDate) setting.limitBookingDate = 0;

export const merchant_id = data.id;
export const locationList: ILocation[] = data.location || [];
export const productData: IProduct[] = data.product || [];
export let defaultLocation: number = locationList[0] ? locationList[0].id : 0;
export const use_email4booking: boolean = !!data.use_email4booking;
export const merchant_timezone: string = data.timezone || "+07:00";
export const date_format_pttrn: string = data.date_format
  ? data.date_format.toUpperCase()
  : "DD/MM/YYYY";
export const time_format_pttrn: string = data.time_format || "HH:mm";

/**
 * Cập nhật động dữ liệu salon từ API backend
 */
export function applyMerchantData(newData: any): void {
  if (!newData) return;
  try {
    Object.assign(data, newData);
    if (newData.setting) {
      Object.assign(setting, newData.setting);
    }
    if (Array.isArray(newData.location) && newData.location.length > 0) {
      locationList.splice(0, locationList.length, ...newData.location);
      defaultLocation = locationList[0].id;
    }
    if (Array.isArray(newData.product) && newData.product.length > 0) {
      productData.splice(0, productData.length, ...newData.product);
    }
    if (Array.isArray(newData.operator)) {
      data.operator = newData.operator;
    }
    if (Array.isArray(newData.product_groups)) {
      data.product_groups = newData.product_groups;
    }
    if (newData.workingHours && typeof newData.workingHours === "object") {
      data.workingHours = newData.workingHours;
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật dữ liệu merchant từ API:", err);
  }
}

const displayAllDayOfDay = setting.slotMinutes >= 30;
export const useSectionOfDay: boolean =
  setting.show_section_of_day == 1 && !displayAllDayOfDay;
export const showServices: boolean = !!(
  data.product && setting.showProductInfo == 1
);
export const showPrice: boolean = setting.showProductPrice == 1;
export const showOperators: boolean = setting.showOperatorInfo == 1;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// ---------- thời gian theo múi giờ cửa hàng ----------
export const inMerchantTime = (v: string | Date | Moment): Moment =>
  moment(v).utcOffset(merchant_timezone);

export const merchantNow = (): Moment => moment().utcOffset(merchant_timezone);

export const merchantToday = (): string => merchantNow().format("YYYY-MM-DD");

export const dayStartISO = (dateStr: string): string =>
  moment(dateStr, "YYYY-MM-DD").utcOffset(merchant_timezone, true).toISOString();

export function merchantTimezoneText(): string {
  const offset = merchantNow().utcOffset();
  const h = Math.floor(Math.abs(offset) / 60);
  const m = Math.abs(offset) % 60;
  return (
    "GMT" +
    (offset < 0 ? "-" : "+") +
    h +
    (m ? ":" + (m < 10 ? "0" : "") + m : "")
  );
}

export function hhmmssToObj(
  s?: string | null
): { hour: number; min: number } | null {
  if (!s) return null;
  const ok =
    /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(s) ||
    /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(s);
  if (!ok) return null;
  const a = s.split(":");
  return { hour: Number(a[0]), min: Number(a[1]) };
}

export function defaultSection(defaultMorning: boolean): SectionOfDay {
  const now = merchantNow();
  const afternoon = merchantNow().hours(11).minutes(45).seconds(59);
  const evening = merchantNow().hours(17).minutes(45).seconds(59);
  if (!defaultMorning) {
    if (!now.isBefore(afternoon) && now.isBefore(evening)) return "afternoon";
    if (!now.isBefore(evening)) return "evening";
  }
  return "morning";
}

// ---------- chuỗi ----------
export function removeVNTrails(str?: string | null): string {
  let s = typeof str === "string" ? str : "";
  s = s.trim().toLowerCase();
  s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  s = s.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  s = s.replace(/đ/g, "d");
  return s;
}

export function matchKeyword(text?: string | null, keyword?: string | null): boolean {
  const kw = removeVNTrails(keyword);
  return !kw || removeVNTrails(text).indexOf(kw) > -1;
}

export function cleanAddress(address?: string | null): string {
  return String(address == null ? "" : address)
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && p !== "null" && p !== "undefined")
    .join(", ");
}

export function formatMoneyNumber(x?: number | string | null): string {
  const n = (x == null ? 0 : x)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  switch (data.currency) {
    case "VND":
      return n + " đ";
    case "CAD":
    case "AUD":
    case "NZD":
    case "SGD":
    case "USD":
      return "$" + n;
    case "EUR":
      return "€" + n;
    case "JPY":
      return "¥" + n;
    case "KRW":
      return "₩" + n;
    case "UGX":
      return "Ugx." + n;
    case "AOA":
      return "Kz." + n;
    default:
      return n;
  }
}

export function formatTimeDuration(
  minutes: number | string,
  T: ILocaleTexts
): string {
  const mins = parseInt(String(minutes), 10);
  if (isNaN(mins)) return "";
  if (mins > 60) {
    const m = mins % 60;
    return (
      Math.floor(mins / 60) +
      " " +
      T.hours +
      (m ? " " + m + " " + T.minutes : "")
    );
  }
  return mins + " " + T.minutes;
}

export function formatDisplayMobile(phone?: string | null): string {
  if (!phone) return "";
  let p = phone.toString().trim();
  if (p.length === 11) {
    p = p.slice(0, 4) + " " + p.slice(4, 7) + " " + p.slice(7, 11);
  } else if (p.length === 10) {
    p = p.slice(0, 3) + " " + p.slice(3, 6) + " " + p.slice(6, 10);
  }
  return p;
}

export function trimCustomerName(name?: string | null): string {
  let r = "";
  if (name && name.length > 0) {
    const m = /[-*?^${}[\]()<>;,=|\\/]/.exec(name);
    r = m ? name.substring(0, m.index) : name;
    r = r.replace('"', "").trim();
  }
  return r;
}

// ---------- dịch vụ đa ngôn ngữ ----------
export const svcName = (p: IProduct, loc: string): string =>
  loc !== "vi" && p["name_" + loc] ? p["name_" + loc] : p.name;

export const svcDesc = (p: IProduct, loc: string): string =>
  loc !== "vi" && p["desc_" + loc] ? p["desc_" + loc] : p.description;

export const groupName = (p: IProduct, loc: string): string =>
  loc !== "vi" && p["group_name_" + loc] ? p["group_name_" + loc] : p.group_name;

export const priceText = (p: IProduct, T: ILocaleTexts): string =>
  (p.edit_price_in_order ? T.price_from + " " : "") +
  formatMoneyNumber(p.default_price);

// ---------- lookup ----------
export const getLocation = (id: number | string): ILocation | null =>
  locationList.find((l) => l.id == Number(id)) || null;

export const getProduct = (id: number | string): IProduct | null =>
  productData.find((p) => p.id == Number(id)) || null;

export const servicesIn = (locId: number): IProduct[] =>
  productData.filter(
    (p) =>
      p.type === "SERVICE" &&
      p.location_ids &&
      p.location_ids.indexOf(Number(locId)) !== -1
  );

export const getNormalizedOperators = (T: ILocaleTexts): IOperator[] =>
  (data.operator || []).map((op) => ({
    ...op,
    name: !op.name || op.name === "Không có tên" ? T.operator_no_name : op.name,
    title: op.title === "Chưa có vai trò" ? "" : op.title,
  }));

export const operatorsIn = (locId: number, T: ILocaleTexts): IOperator[] =>
  getNormalizedOperators(T).filter((op) => {
    if (op.location_id == locId) return true;
    for (let i = 1; i <= 10; i++) {
      if (op["location_id_" + i] == locId) return true;
    }
    return false;
  });

export const getOperatorById = (
  id: number | string,
  T: ILocaleTexts
): IOperator | null =>
  getNormalizedOperators(T).find((o) => Number(o.id) === Number(id)) || null;

export const getPreferredCountries = (): string[] => {
  const arr: string[] = [];
  locationList.forEach((l) => {
    if (l.country_code && !arr.includes(l.country_code)) {
      arr.push(l.country_code);
    }
  });
  return arr;
};

export function mapUrl(loc: ILocation): string {
  if (loc.google_map_url && /^https?:\/\//i.test(loc.google_map_url)) {
    return loc.google_map_url;
  }
  if (loc.long && loc.lat) {
    return (
      "https://www.google.com/maps/@" +
      encodeURIComponent(String(loc.lat)) +
      "," +
      encodeURIComponent(String(loc.long)) +
      ",17z"
    );
  }
  return (
    "https://www.google.com/maps/place/" +
    encodeURIComponent(loc.fullAddress || "")
  );
}

// ---------- số điện thoại ----------
export function mobileInputMask(countryCode?: string | null): string {
  const c = countryCode || "VN";
  if (["US", "CA"].includes(c)) return "999 999 9999";
  if (["AU"].includes(c)) return "99 9999 9999";
  if (["JP", "LA"].includes(c)) return "999 9999 999[9]";
  if (["KH"].includes(c)) return "999 9999 999";
  if (["SG"].includes(c)) return "9999 9999";
  return "999 999 9999[9]";
}

export function validateMobile(
  value?: string | null,
  countryCode?: string | null
): boolean {
  const n = (value || "").toString().replace(/\s|-|_/g, "");
  const c = countryCode || "VN";
  let min = 10;
  let max = 11;
  if (["VN", "US", "AU"].includes(c)) {
    min = 10;
    max = 11;
  } else if (["KH", "LA"].includes(c)) {
    min = 7;
    max = 12;
  } else if (["SG"].includes(c)) {
    min = 8;
    max = 8;
  } else {
    max = 15;
  }
  return !(n.length < min || n.length > max);
}

// ---------- khu vực (gom chi nhánh theo thành phố) ----------
const CITY_ALIAS: Record<string, string> = {
  hcm: "hochiminh",
  tphcm: "hochiminh",
  saigon: "hochiminh",
  sg: "hochiminh",
  hn: "hanoi",
  dn: "danang",
};

function cityNameKey(name?: string | null): string {
  let key = removeVNTrails(name).replace(/[^a-z0-9]/g, "");
  if (CITY_ALIAS[key]) return CITY_ALIAS[key];
  key = key.replace(/^(thanhpho|tinh|tp)(?=.{2,})/, "");
  return CITY_ALIAS[key] || key;
}

export function buildRegions(otherLabel: string): IRegion[] {
  const regionList: IRegion[] = [];
  const regionMap: Record<string, IRegion> = {};
  const keyByCode: Record<number, string> = {};

  locationList.forEach((loc) => {
    const code = parseInt(String(loc.city_code), 10) || 0;
    const key =
      (code && keyByCode[code]) ||
      cityNameKey(loc.city_name) ||
      (code ? "code" + code : "other");
    if (code && !keyByCode[code]) keyByCode[code] = key;
    loc.region_key = key;

    if (!regionMap[key]) {
      regionMap[key] = {
        key,
        names: {},
        count: 0,
        sort_order: Infinity,
        label: "",
        index: 0,
      };
      regionList.push(regionMap[key]);
    }
    regionMap[key].count++;
    const so =
      loc.sort_order === null ||
      loc.sort_order === undefined ||
      String(loc.sort_order) === ""
        ? NaN
        : Number(loc.sort_order);
    if (!isNaN(so) && so < regionMap[key].sort_order) {
      regionMap[key].sort_order = so;
    }
    if (loc.city_name) {
      regionMap[key].names[loc.city_name] =
        (regionMap[key].names[loc.city_name] || 0) + 1;
    }
  });

  regionList.forEach((r, i) => {
    const names = Object.keys(r.names).sort((a, b) => r.names[b] - r.names[a]);
    r.label = names.length ? names[0] : otherLabel;
    r.index = i;
  });

  regionList.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    if (a.sort_order !== b.sort_order) {
      return a.sort_order < b.sort_order ? -1 : 1;
    }
    return a.index - b.index;
  });

  return regionList;
}

export function operatorTypeLabel(T: ILocaleTexts): string {
  if (["blx24h", "blxhaduong", "thayvinhdaylaixe"].includes(data.subdomain)) {
    return T.teacher;
  }
  if (data.type === "HairSalon" || data.type === "Barbershop") {
    return "Stylist";
  }
  if (data.type === "Clinic" || data.type === "Dental") {
    return T.doctor;
  }
  return T.technicians;
}

export function scrollToEl(el?: HTMLElement | null): void {
  if (!el || typeof window === "undefined") return;
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: "smooth" });
}
