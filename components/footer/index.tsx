import React, { useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useLanguage } from "../../hooks/useLanguage";
import {
  date_format_pttrn,
  getLocation,
  getProduct,
  inMerchantTime,
  merchantTimezoneText,
} from "../../utilities/bookingUtils";

const Footer: React.FC = () => {
  const { T, L } = useLanguage();
  const { tab, loc, services, date, time, slotState, submitting, success } =
    useSelector((state: RootState) => state.booking);

  const hasBar = tab === "booking" && !success;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("has-bar", hasBar);
    }
  }, [hasBar]);

  const location = getLocation(loc);
  const selectedProducts = services.map(getProduct).filter(Boolean);

  const selectedSlotMoment = () => {
    if (!time) return null;
    for (const s of slotState.list) {
      const m = inMerchantTime(s.time);
      if (m.format("HH:mm") === time) return m;
    }
    return null;
  };

  const d = selectedSlotMoment() || moment(date, "YYYY-MM-DD");
  const dateTimeText =
    T.weekday[d.day()] +
    ", " +
    d.format(date_format_pttrn) +
    (time ? " " + time + " (" + merchantTimezoneText() + ")" : "");

  const handleBarSubmit = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nailroom:submit-booking"));
    }
  };

  return (
    <>
      <footer className="foot">
        {L.footer}{" "}
        <a title="phần mềm quản lý spa" href="https://salonhero.vn">
          SalonHero.vn
        </a>
      </footer>

      {/* thanh đặt lịch dính đáy trên điện thoại */}
      <div className="bar" id="bar">
        <div>
          <small id="bar-sum">
            {(location ? location.name : "") +
              (selectedProducts.length
                ? " · " + selectedProducts.length + " " + T.services_count
                : "")}
          </small>
          <b id="bar-time">{time ? dateTimeText : T.time_not_selected}</b>
        </div>
        <button
          className="btn primary"
          type="button"
          id="bar-btn"
          disabled={submitting}
          onClick={handleBarSubmit}
        >
          {L.book_appointment}
        </button>
      </div>
    </>
  );
};

export default Footer;
