import React from "react";

export const IconSprite: React.FC = () => {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </symbol>
        <symbol id="i-phone" viewBox="0 0 24 24">
          <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </symbol>
        <symbol id="i-pin" viewBox="0 0 24 24">
          <path d="M12 21s7-6.200 7-11.500A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z" />
          <circle cx="12" cy="9.500" r="2.500" />
        </symbol>
        <symbol id="i-globe" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18" />
        </symbol>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <rect x="3.500" y="5" width="17" height="15" rx="2.500" />
          <path d="M3.500 10h17M8 3v4M16 3v4" />
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1-4.500 4.500-6 8-6s7 1.500 8 6" />
        </symbol>
        <symbol id="i-staff" viewBox="0 0 24 24">
          <path d="M12 3.500l2.500 5.200 5.700.800-4.100 4 1 5.700-5.100-2.700-5.100 2.700 1-5.700-4.100-4 5.700-.800z" />
        </symbol>
        <symbol id="i-alert" viewBox="0 0 24 24">
          <path d="M12 7.500v6M12 17h.010" />
          <circle cx="12" cy="12" r="9" />
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.500" />
          <path d="M16 16l4.500 4.500" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="M5 12.500l4.500 4.500L19 7.500" />
        </symbol>
        <symbol id="i-gift" viewBox="0 0 24 24">
          <rect x="3.500" y="9" width="17" height="11" rx="2" />
          <path d="M3.500 13h17M12 9v11M12 9c-4 0-5-5-2-5s2 5 2 5zm0 0c4 0 5-5 2-5s-2 5-2 5z" />
        </symbol>
        <symbol id="i-fb" viewBox="0 0 24 24">
          <path d="M14 8.500V7c0-1 .500-1.500 1.500-1.500H17V3h-2.500C12 3 10.500 4.500 10.500 7v1.500H8V11h2.500v10H14V11h2.500l.500-2.500z" />
        </symbol>
      </defs>
    </svg>
  );
};

export default IconSprite;
