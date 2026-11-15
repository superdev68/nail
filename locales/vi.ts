export interface ILocaleTexts {
  today: string;
  morning: string;
  afternoon: string;
  evening: string;
  minutes: string;
  hours: string;
  price_from: string;
  no_slot: string;
  full_slot: string;
  open_today: string;
  closed_today: string;
  loading_slots: string;
  load_slots_failed: string;
  retry: string;
  has_slot: string;
  required: string;
  choose_time: string;
  merchant_timezone_notice: string;
  time_passed: string;
  email_invalid: string;
  booking_failed: string;
  technicians: string;
  doctor: string;
  teacher: string;
  operator_no_name: string;
  total_duration: string;
  total_price: string;
  all_regions: string;
  other_region: string;
  more_locations: string;
  collapse: string;
  all_groups: string;
  no_service_found: string;
  no_operator_found: string;
  no_location_found: string;
  any_operator: string;
  any_operator_desc: string;
  time_not_selected: string;
  service_not_selected: string;
  guests: string;
  services_count: string;
  select: string;
  selected: string;
  remove: string;
  book_here: string;
  directions: string;
  view_more: string;
  view_less: string;
  booking_failed_title: string;
  booked_by: string;
  operator_slot_hint: string;
  weekday: string[];
  // L keys
  call: string;
  appointment: string;
  locations: string;
  services: string;
  customer_info: string;
  phone: string;
  email: string;
  full_name: string;
  gender_f: string;
  gender_m: string;
  attending: string;
  select_location: string;
  appointment_date: string;
  other_date: string;
  appointment_time: string;
  search_name: string;
  service_info: string;
  search_service: string;
  notes: string;
  your_appointment: string;
  book_appointment: string;
  success_title: string;
  success_service: string;
  success_tech: string;
  success_address: string;
  success_name: string;
  success_phone: string;
  hotline: string;
  next_appointment: string;
  search_branch: string;
  filter_branch: string;
  footer: string;
  [key: string]: any;
}

const vi: ILocaleTexts = {
  // T (Dynamic texts)
  today: "Hôm Nay",
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
  minutes: "phút",
  hours: "giờ",
  price_from: "Từ",
  no_slot:
    "Cửa hàng không thể phục vụ thời điểm này. Quý khách vui lòng ghé thăm vào thời điểm khác.",
  full_slot: "Hết chỗ",
  open_today: "Giờ mở cửa hôm nay",
  closed_today: "Hôm nay nghỉ",
  loading_slots: "Đang tải khung giờ…",
  load_slots_failed: "Không tải được khung giờ. Vui lòng thử lại.",
  retry: "Thử lại",
  has_slot: "Còn chỗ",
  required: "Vui lòng nhập đủ thông tin bắt buộc",
  choose_time: "Vui lòng chọn thời gian đặt lịch",
  merchant_timezone_notice:
    "Lưu ý: ngày giờ trên trang hiển thị theo giờ của cửa hàng ({tz}), khác với múi giờ trên máy bạn.",
  time_passed: "Khung giờ bạn chọn đã qua. Vui lòng chọn khung giờ khác.",
  email_invalid:
    "Email bạn nhập sai định dạng. Vui lòng nhập đúng cấu trúc email.",
  booking_failed: "Có lỗi xảy ra, không thể đặt được lịch",
  technicians: "Kỹ thuật viên",
  doctor: "Bác sĩ",
  teacher: "Giáo viên",
  operator_no_name: "Chưa có tên",
  total_duration: "Tổng thời gian dịch vụ (dự kiến)",
  total_price: "Tổng giá tiền dịch vụ (tạm tính)",
  all_regions: "Tất cả khu vực",
  other_region: "Khu vực khác",
  more_locations: "Xem thêm {count} chi nhánh",
  collapse: "Thu gọn",
  all_groups: "Tất cả",
  no_service_found: "Không tìm thấy dịch vụ phù hợp",
  no_operator_found: "Không tìm thấy người phù hợp",
  no_location_found: "Không tìm thấy chi nhánh phù hợp",
  any_operator: "Bất kỳ ai",
  any_operator_desc: "Cửa hàng sắp xếp",
  time_not_selected: "Chưa chọn giờ hẹn",
  service_not_selected: "Chưa chọn dịch vụ",
  guests: "khách",
  services_count: "dịch vụ",
  select: "Chọn",
  selected: "Đã chọn",
  remove: "Bỏ chọn",
  book_here: "Đặt lịch tại đây",
  directions: "Chỉ đường",
  view_more: "Xem thêm",
  view_less: "Ít hơn",
  booking_failed_title: "Chưa đặt được lịch",
  booked_by: "Người đặt lịch",
  operator_slot_hint:
    "Khung giờ còn trống phụ thuộc vào {type} bạn chọn. Khi đổi người, danh sách khung giờ ở trên sẽ được cập nhật lại.",
  weekday: [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ],

  // L (Static HTML labels)
  call: "Gọi điện",
  appointment: "Đặt lịch",
  locations: "Chi nhánh",
  services: "Dịch vụ",
  customer_info: "Thông tin khách đặt lịch",
  phone: "Số điện thoại",
  email: "Email",
  full_name: "Họ và tên",
  gender_f: "Chị",
  gender_m: "Anh",
  attending: "Tổng số khách",
  select_location: "Chọn địa điểm",
  appointment_date: "Thời gian đặt lịch",
  other_date: "Chọn ngày khác:",
  appointment_time: "Chọn khung giờ phục vụ (*)",
  search_name: "Tìm theo tên…",
  service_info: "Thông tin dịch vụ",
  search_service: "Tìm dịch vụ theo tên…",
  notes: "Ghi chú",
  your_appointment: "Lịch hẹn của bạn",
  book_appointment: "Đặt lịch hẹn",
  success_title: "Đặt lịch thành công!",
  success_service: "Chọn dịch vụ",
  success_tech: "Kỹ thuật viên",
  success_address: "Địa chỉ",
  success_name: "Người đặt lịch",
  success_phone: "Số ĐT người đặt",
  hotline: "Hotline",
  next_appointment: "Đặt lịch khác",
  search_branch: "Tìm theo tên hoặc địa chỉ chi nhánh…",
  filter_branch: "Lọc theo chi nhánh",
  footer: "Website được thiết kế và xây dựng bởi",
};

export default vi;
