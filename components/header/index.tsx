import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import {
  data,
  formatDisplayMobile,
  hhmmssToObj,
  locationList,
  scrollToEl,
  time_format_pttrn,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";
import Logo from "./Logo";
import Language from "./language/Language";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L } = useLanguage();
  const tab = useSelector((state: RootState) => state.booking.tab);
  const todayHours = useSelector(
    (state: RootState) => state.booking.todayHours
  );

  const openHours = todayHours ? (
    todayHours.is_working == 0 ? (
      <span>{T.closed_today}</span>
    ) : (
      (() => {
        const o = hhmmssToObj(todayHours.start_time) || { hour: 8, min: 0 };
        const c = hhmmssToObj(todayHours.end_time) || { hour: 22, min: 0 };
        return (
          <span>
            {T.open_today}:{" "}
            <b>
              {moment().hours(o.hour).minutes(o.min).format(time_format_pttrn)}{" "}
              –{" "}
              {moment().hours(c.hour).minutes(c.min).format(time_format_pttrn)}
            </b>
          </span>
        );
      })()
    )
  ) : null;

  const handleCtaClick = () => {
    dispatch(bookingActions.setTab("booking"));
    setTimeout(() => {
      if (typeof document !== "undefined") {
        scrollToEl(document.getElementById("booking"));
      }
    }, 0);
  };

  return (
    <>
      <header className="head">
        <div className="wrap">
          <div className="cover">
            {data.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.cover_image_url} alt="" />
            ) : (
              <svg
                viewBox="0 0 1120 320"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <rect className="cv-d" width="1120" height="320" />
                <circle className="cv-a" cx="900" cy="330" r="300" />
                <circle className="cv-b" cx="1010" cy="70" r="120" />
                <path
                  className="cv-c"
                  d="M560 320V190a90 90 0 0 1 180 0v130z"
                />
                <path
                  className="cv-b"
                  d="M400 320V230a70 70 0 0 1 140 0v90z"
                  opacity=".55"
                />
                <path
                  className="cv-a"
                  d="M0 320V210c120-60 250-40 330 30s130 80 230 80z"
                  opacity=".7"
                />
                <ellipse
                  className="cv-c"
                  cx="205"
                  cy="120"
                  rx="26"
                  ry="62"
                  transform="rotate(28 205 120)"
                />
                <ellipse
                  className="cv-b"
                  cx="150"
                  cy="150"
                  rx="22"
                  ry="54"
                  transform="rotate(-24 150 150)"
                />
                <ellipse
                  className="cv-c"
                  cx="255"
                  cy="175"
                  rx="18"
                  ry="44"
                  transform="rotate(58 255 175)"
                  opacity=".8"
                />
                <path
                  className="cv-l"
                  d="M180 320C180 240 190 190 200 130M650 320V150M0 80c200 60 420-40 620 10s330 60 500-20"
                />
                <circle className="cv-c" cx="760" cy="90" r="8" />
                <circle className="cv-c" cx="800" cy="130" r="4" />
                <circle className="cv-c" cx="470" cy="80" r="5" />
              </svg>
            )}
            <div className="cover-top">
              <Language />
            </div>
          </div>

          <div className="identity">
            <Logo />
            <div className="id-main">
              <h1>{data.name}</h1>
              <div className="meta">
                <span id="open-hours" hidden={!openHours}>
                  <Icon name="clock" />
                  {openHours}
                </span>
                <a href={"tel:" + data.phone}>
                  <Icon name="phone" />
                  <span className="merchant-phone">
                    {formatDisplayMobile(data.phone)}
                  </span>
                </a>
                {data.facebook && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={data.facebook}
                  >
                    <Icon name="fb" />
                    Facebook
                  </a>
                )}
                {data.website && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"http://" + data.website}
                  >
                    <Icon name="globe" />
                    {data.website}
                  </a>
                )}
              </div>
            </div>
            <div className="id-actions">
              <a className="btn" href={"tel:" + data.phone}>
                <Icon name="phone" />
                {L.call}
              </a>
              <button
                className="btn primary"
                type="button"
                id="cta"
                onClick={handleCtaClick}
              >
                <Icon name="cal" />
                {L.appointment}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <div className="wrap tabs-in" role="tablist">
          <button
            className="tab"
            role="tab"
            aria-selected={tab === "booking"}
            id="tab-booking"
            onClick={() => dispatch(bookingActions.setTab("booking"))}
          >
            {L.appointment}
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={tab === "saloninfo"}
            id="tab-saloninfo"
            onClick={() => dispatch(bookingActions.setTab("saloninfo"))}
          >
            {L.locations} <small>{locationList.length}</small>
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={tab === "services"}
            id="tab-services"
            onClick={() => dispatch(bookingActions.setTab("services"))}
          >
            {L.services}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
