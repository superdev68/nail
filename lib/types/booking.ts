import { IWorkingHour } from "./merchant";

export type TabType = "booking" | "saloninfo" | "services";
export type SectionOfDay = "morning" | "afternoon" | "evening";

export interface ITimeSlotRaw {
  time: string;
  count?: number;
  isSlotFull: number | boolean;
}

export interface ITimeSlotItem {
  hhmm: string;
  label: string;
  isFull: boolean;
  isSel: boolean;
}

export interface ISlotState {
  status: "loading" | "ok" | "failed";
  list: ITimeSlotRaw[];
  workingHours: IWorkingHour | null;
}

export interface ISlotView {
  status: "loading" | "ok" | "failed" | "none";
  items?: ITimeSlotItem[];
  keep?: boolean;
}

export interface IDayOption {
  dateStr: string;
  top: string;
  dd: string;
  my: string;
}

export interface IRegion {
  key: string;
  names: Record<string, number>;
  count: number;
  sort_order: number;
  label: string;
  index: number;
}

export interface IServiceGroupOption {
  id: number;
  name: string;
}

export interface IGetTimeFrameParams {
  merchant_id: number;
  location_id: number;
  date: string;
  operator_id?: number;
}

export interface IGetTimeFrameResponse {
  status: number;
  timeFrame?: {
    workingHours: IWorkingHour;
    timeFrame: ITimeSlotRaw[];
  };
}

export interface IGetCustomerParams {
  merchant_id: number;
  mobile?: string;
  email?: string;
}

export interface ICustomerInfo {
  id?: number;
  full_name?: string;
  gender?: "F" | "M" | string;
  email?: string;
  mobile?: string;
  phone_country_code?: string;
}

export interface IGetCustomerResponse {
  status: number;
  data?: ICustomerInfo;
}

export interface IBookingPayload {
  location_id: number;
  merchant_id: number;
  customer_id: number | null;
  gender: string;
  product_id: number[];
  booked_at: string;
  operator_id: number[];
  note: string;
  customer_name: string;
  mobile: string;
  phone_country_code: string | null;
  email: string;
  booking_code: string;
  number_of_guests: number;
  city_code: number;
  district_code: number;
  estimated_duration: number;
  externalUserId: string;
  externalAppId: string;
}

export interface IBookingSuccess {
  bookedAt: string;
  services: string;
  operatorName: string;
  address: string;
  name: string;
  phone: string;
}
