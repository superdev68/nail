export interface IMerchantSetting {
  id: number;
  merchant_id: number;
  booking_before_min: number;
  custom_limit_booking?: string | null;
  language: string;
  allow_send_email_to_operator: number;
  email_notification_list?: string | null;
  email_notify_order_by_app?: string | null;
  web_color: string;
  hide_all_booking_notifications: number;
  background_image_url?: string | null;
  cover_image_url?: string | null;
  slogan_text?: string | null;
  default_booking_status: string;
  show_section_of_day: number;
  default_booking_duration: number;
  lock_web_booking: number;
  showOperatorInfo: number;
  showProductInfo: number;
  showProductPrice: number;
  limitSlotBooking: number;
  limitBookingDate: number;
  customerGender: string;
  slotMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocation {
  id: number;
  name: string;
  phone: string;
  fullAddress: string;
  long: number;
  lat: number;
  address: string;
  district_name: string;
  city_name: string;
  city_code: number;
  district_code: number;
  country_code: string;
  sort_order?: number | null;
  google_map_url?: string | null;
  image_url?: string | null;
  chat_url?: string | null;
  region_key?: string;
}

export interface IProductGroup {
  id: number;
  merchant_id?: number;
  name: string;
  is_active?: number;
  is_deleted?: number;
  show_type?: number;
  group_thumbnail_url?: string | null;
  name_en?: string | null;
  name_ja?: string | null;
  name_ko?: string | null;
  group_type?: string | null;
  is_card_group?: number;
  is_default?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProduct {
  id: number;
  name: string;
  sku: string;
  type: string;
  group_id: number;
  group_name: string;
  group_type?: string | null;
  group_thumbnail_url?: string | null;
  thumbnail_url?: string | null;
  default_price: number;
  service_duration: number;
  description: string;
  edit_price_in_order: number;
  location_ids: number[];
  featured_rank?: number;
  discount_percent?: number;
  discount_money?: number | null;
  name_en?: string;
  desc_en?: string;
  name_ja?: string;
  desc_ja?: string;
  name_ko?: string;
  desc_ko?: string;
  group_name_en?: string;
  group_name_ja?: string;
  group_name_ko?: string;
  [key: string]: any;
}

export interface IWorkingHour {
  day_of_week?: number;
  is_working: number;
  start_time: string;
  end_time: string;
  is_break: number;
  break_start_time?: string | null;
  break_end_time?: string | null;
}

export interface IOperator {
  id: number;
  location_id: number;
  name: string;
  title: string;
  phone?: string | number;
  avatar_url?: string | null;
  location_id_1?: number | null;
  location_id_2?: number | null;
  location_id_3?: number | null;
  location_id_4?: number | null;
  location_id_5?: number | null;
  location_id_6?: number | null;
  location_id_7?: number | null;
  location_id_8?: number | null;
  location_id_9?: number | null;
  location_id_10?: number | null;
  [key: string]: any;
}

export interface IMerchant {
  id: number;
  name: string;
  logo_img: string;
  phone: string;
  facebook?: string | null;
  website?: string | null;
  type: string;
  currency: string;
  gender_type: string;
  use_email4booking: number;
  timezone: string;
  date_format: string;
  time_format: string;
  subdomain: string;
  online_order_location?: number | null;
  version_android?: string | null;
  version_ios?: string | null;
  cover_image_url?: string | null;
  setting: IMerchantSetting;
  location: ILocation[];
  product_groups?: IProductGroup[];
  product: IProduct[];
  workingHours: Record<string, Record<string, IWorkingHour>>;
  operator: IOperator[];
}
