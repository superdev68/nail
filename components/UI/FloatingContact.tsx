import React from "react";

interface FloatingContactProps {
  phone?: string;
  displayPhone?: string;
  zaloUrl?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  phone = "0352222868",
  displayPhone = "0352222868",
  zaloUrl = "https://zalo.me/g/75yjystpq0ospvrqdvbs?joinSrc=9",
}) => {
  return (
    <div className="floating-contact-container fixed left-4 sm:left-6 bottom-5 sm:bottom-6 z-40 flex flex-col items-start select-none pointer-events-none">
      {/* Nút Zalo (Góc trên) */}
      <div className="relative pointer-events-auto ml-1 sm:ml-1.5 mb-2.5 group">
        {/* Vòng hào quang / sóng xung quanh Zalo */}
        <div className="absolute -inset-1.5 rounded-full bg-[#0084ff]/25 animate-ping opacity-75 pointer-events-none" />
        <div className="absolute -inset-1 rounded-full bg-[#0084ff]/20 pointer-events-none" />

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Tham gia nhóm Zalo"
          aria-label="Tham gia nhóm Zalo"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#0084ff] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg active:scale-95"
        >
          {/* Logo Zalo: Bong bóng chat trắng với chữ Zalo */}
          <div className="w-7 h-7 rounded-[7px] bg-white flex items-center justify-center p-0.5 shadow-sm relative">
            {/* Đuôi nhọn của bubble */}
            <div className="absolute -bottom-1 left-1.5 w-2 h-2 bg-white rotate-45" />
            <span className="font-extrabold text-[10px] tracking-tight text-[#0084ff] leading-none select-none z-10">
              Zalo
            </span>
          </div>
        </a>
      </div>

      {/* Nút Hotline / Gọi điện (Góc dưới) */}
      <div className="relative pointer-events-auto flex items-center group">
        {/* Vòng sóng radar lan tỏa xung quanh nút hotline */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-400/40 pointer-events-none animate-hotline-ripple" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-400/30 pointer-events-none animate-hotline-ripple-delay" />

        <a
          href={`tel:${phone}`}
          title={`Gọi ngay ${displayPhone}`}
          aria-label={`Gọi ngay ${displayPhone}`}
          className="relative flex items-center h-12 rounded-full pr-5 pl-0.5 bg-[#e5e7eb]/90 hover:bg-[#e2e4e8] backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.03] active:scale-95"
        >
          {/* Nút tròn cam bên trái */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] ring-2 ring-white/60 shadow-md">
            {/* Vòng sáng nhẹ quanh nút cam */}
            <div className="absolute -inset-1 rounded-full bg-orange-400/30 animate-pulse pointer-events-none" />

            {/* Bong bóng chat trắng */}
            <div className="relative w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-inner z-10 animate-phone-wiggle">
              {/* Đuôi nhọn chat bubble góc 7-8h */}
              <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-white rotate-45 rounded-bl-[1px]" />
              {/* Icon ống nghe điện thoại màu cam */}
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-[#f97316] fill-current -rotate-12 relative z-10"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
              </svg>
            </div>
          </div>

          {/* Dòng số điện thoại màu đỏ */}
          <span className="ml-3 font-bold text-red-600 group-hover:text-red-700 text-[15px] sm:text-[16px] tracking-wide whitespace-nowrap font-mono tabular-nums transition-colors">
            {displayPhone}
          </span>
        </a>
      </div>
    </div>
  );
};

export default FloatingContact;
