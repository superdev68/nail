import React from "react";

interface FloatingContactProps {
  phone?: string;
  displayPhone?: string;
  zaloUrl?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  phone = "0352222868",
  displayPhone = "0352222868",
  zaloUrl = "https://zalo.me/84352222868",
}) => {
  return (
    <>
      <div className="quick-call-button" id="draggable">
        <div className="call-now-button">
          <p
            className="call-text"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = `tel:${phone}`;
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {displayPhone}
          </p>
          <a
            href={`tel:${phone}`}
            id="quickcallbutton"
            title="Call Now"
            aria-label="Call Now"
          >
            <div className="quick-alo-ph-circle active" />
            <div className="quick-alo-ph-circle-fill active" />
            <div className="quick-alo-ph-img-circle shake" />
          </a>
        </div>
      </div>

      <div className="zalo-container left">
        <a
          id="zalo-btn"
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Contact Me on Zalo"
          aria-label="Contact Me on Zalo"
        >
          <div className="animated_zalo infinite zoomIn_zalo cmoz-alo-circle" />
          <div className="animated_zalo infinite pulse_zalo cmoz-alo-circle-fill" />
          <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/zalo-2.png"
              alt="Contact Me on Zalo"
              width={455}
              height={400}
            />
          </span>
        </a>
      </div>
    </>
  );
};

export default FloatingContact;
