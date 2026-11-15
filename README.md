# Nail Room - Mit’s House Booking (`SupperDev/nail`)

Source code clone 100% giao diện, dữ liệu và luồng đặt lịch của **https://book.nailroom.vn/**, được xây dựng theo đúng kiến trúc & pattern của repo **`customer`** (Next.js 12 + TypeScript + TailwindCSS + Redux Toolkit).

## Cấu trúc thư mục (theo pattern `customer`)

- `components/`
  - `layout/Layout.tsx`: Bọc `Provider` (Redux), `ThemeProvider`, `Head`, `Header`, `Footer`, `Modal`, `ToastContainer`.
  - `header/`: Ảnh bìa (Cover SVG/Image), bộ chuyển đổi ngôn ngữ `VI`/`EN`, thông tin thương hiệu `Nail Room - Mit’s House`, giờ mở cửa hôm nay, số hotline, Facebook, Website và thanh điều hướng 3 tab dính (`Đặt lịch`, `Chi nhánh`, `Dịch vụ`).
  - `booking/`: Các bước đặt lịch (`CustomerInfoCard`, `LocationCard`, `DateTimeCard`, `OperatorCard`, `ServiceCard`, `NotesCard`), phiếu hẹn bên phải (`AppointmentTicket`), và màn hình xác nhận đặt lịch thành công (`BookingSuccess`).
  - `branches/`: Tab danh sách chi nhánh kèm tìm kiếm, lọc theo khu vực, bản đồ minh họa, nút Đặt lịch tại đây & Chỉ đường Google Maps.
  - `services/`: Tab danh sách bảng giá dịch vụ theo từng chi nhánh kèm tìm kiếm, dropdown chọn chi nhánh (`LocationDropdown`), xem thêm mô tả và chọn dịch vụ.
  - `footer/`: Chân trang `SalonHero.vn` và thanh đặt lịch dính đáy trên thiết bị di động (`#bar`).
  - `UI/`: `IconSprite`, `Icon`, `ScrollRow`, `PhoneInput` (`intl-tel-input` + `inputmask`), `Modal`.
- `hooks/`: `useLanguage.tsx` (hỗ trợ đa ngôn ngữ `vi`/`en` qua `?lang=` và Next.js locale), `useWindowDimensions.tsx`.
- `locales/`: `vi.ts`, `en.ts`.
- `mock/`: `merchant.json` & `merchantData.ts` (toàn bộ dữ liệu chi nhánh, kỹ thuật viên, nhóm dịch vụ, dịch vụ và giờ mở cửa của Nail Room).
- `services/`: `api.ts` (tích hợp cả chế độ `mock` mặc định qua `localStorage` và chế độ `real` gọi API thật).
- `store/`: Redux Toolkit (`index.ts`, `booking-slice.ts`, `settingBox-slice.ts`).
- `styles/`: `globals.css` (TailwindCSS + bộ font `Be Vietnam Pro` / `Fraunces` + toàn bộ style chuẩn 100% của `book.nailroom.vn`).
- `utilities/`: `bookingUtils.ts`, `currencyFormat.ts`.
- `pages/`: `_app.tsx`, `_document.tsx`, `index.tsx`, và các API routes trong `pages/api/`.

## Chạy dự án

```bash
cd /Users/mac/Documents/SupperDev/nail
npm install
npm run dev
```

- Chế độ mặc định (`mock`): `npm run dev` (chạy tại `http://localhost:3001`)
- Chế độ kết nối API thật (`real`): `npm run dev:real`
- Build production: `npm run build && npm start`
