import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { IDayOption, ISlotView, SectionOfDay } from "../../lib/types";
import {
  merchantNow,
  merchantTimezoneText,
  setting,
  useSectionOfDay,
} from "../../utilities/bookingUtils";
import ScrollRow from "../UI/ScrollRow";

interface DateTimeCardProps {
  dateTimeText: string;
  slotView: ISlotView;
  timeBlockRef: MutableRefObject<HTMLDivElement | null>;
}

const DateTimeCard: React.FC<DateTimeCardProps> = ({
  dateTimeText,
  slotView,
  timeBlockRef,
}) => {
  const dispatch = useDispatch();
  const { T, L } = useLanguage();
  const { today, date, section, timeErr, fieldErr } = useSelector(
    (state: RootState) => state.booking
  );
  const daysRef = useRef<HTMLDivElement | null>(null);

  const limit = setting.limitBookingDate;
  const numberOfDays =
    limit && limit <= 7 ? limit : limit ? Math.min(14, limit + 1) : 14;

  const days = useMemo<IDayOption[]>(() => {
    const arr: IDayOption[] = [];
    for (let i = 0; i < numberOfDays; i++) {
      const d = merchantNow().add(i, "days");
      arr.push({
        dateStr: d.format("YYYY-MM-DD"),
        top: i === 0 ? T.today : T.weekday[d.day()],
        dd: d.format("DD"),
        my: d.format("MM/YYYY"),
      });
    }
    return arr;
  }, [today, numberOfDays, T]); // eslint-disable-line react-hooks/exhaustive-deps

  const showOtherDate =
    !(limit && limit <= 7) && (!limit || limit + 1 > numberOfDays);
  const otherMax = limit
    ? merchantNow().add(limit, "days").format("YYYY-MM-DD")
    : undefined;

  const handleSelectDate = (dateStr: string) => {
    if (!dateStr || !moment(dateStr, "YYYY-MM-DD", true).isValid()) return;
    dispatch(bookingActions.selectDate(dateStr));
  };

  // cuộn hàng ngày tới ô đang chọn nếu bị khuất
  useEffect(() => {
    const strip = daysRef.current;
    const sel =
      strip &&
      (strip.querySelector('.day[aria-pressed="true"]') as HTMLElement | null);
    if (strip && sel) {
      if (
        sel.offsetLeft < strip.scrollLeft + 40 ||
        sel.offsetLeft + sel.offsetWidth >
          strip.scrollLeft + strip.clientWidth - 40
      ) {
        strip.scrollLeft =
          sel.offsetLeft - (strip.clientWidth - sel.offsetWidth) / 2;
      }
    }
  }, [date]);

  const tzDiff = moment().utcOffset() !== merchantNow().utcOffset();

  return (
    <div className="card">
      <div className="step-h">
        <i></i>
        <h2>{L.appointment_date}</h2>
        <span className="booking_time">{dateTimeText}</span>
      </div>
      <ScrollRow
        className="days"
        id="select-day"
        isDays
        scrollRef={daysRef}
        deps={[days]}
      >
        {days.map((d) => (
          <button
            type="button"
            className="day btn-select"
            key={d.dateStr}
            aria-pressed={d.dateStr === date}
            onClick={() => handleSelectDate(d.dateStr)}
          >
            <small>{d.top}</small>
            <b>{d.dd}</b>
            <small>{d.my}</small>
          </button>
        ))}
      </ScrollRow>
      <div className="other-date" id="other-date-row" hidden={!showOtherDate}>
        <label htmlFor="other-date">{L.other_date}</label>
        <input
          className="input"
          type="date"
          id="other-date"
          min={today}
          max={otherMax}
          value={date}
          onChange={(e) => {
            const v = e.target.value;
            if (!v || v < today || (otherMax && v > otherMax)) return;
            handleSelectDate(v);
          }}
        />
      </div>
      <div
        id="time-block"
        className={timeErr ? "has-error" : ""}
        ref={timeBlockRef}
      >
        <div className="sub">{L.appointment_time}</div>
        <div
          className="seg wide"
          role="group"
          id="selectTime"
          hidden={!useSectionOfDay}
        >
          {(["morning", "afternoon", "evening"] as SectionOfDay[]).map((s) => (
            <button
              type="button"
              key={s}
              value={s}
              aria-pressed={section === s}
              onClick={() => dispatch(bookingActions.setSection(s))}
            >
              {T[s]}
            </button>
          ))}
        </div>
        <p
          className="tz-warn"
          id="diff_timezone_warning_message"
          hidden={!tzDiff}
        >
          {tzDiff
            ? "* " +
              T.merchant_timezone_notice.replace("{tz}", merchantTimezoneText())
            : ""}
        </p>
        {slotView.status === "loading" ? (
          <div id="timeFrame">
            <p className="slot-loading">
              <span className="spin"></span>
              {T.loading_slots}
            </p>
          </div>
        ) : slotView.status === "failed" ? (
          <div id="timeFrame">
            <p className="slot-msg">{T.load_slots_failed}</p>
            <p style={{ textAlign: "center", margin: 0 }}>
              <button
                type="button"
                className="btn"
                id="slot-retry"
                onClick={() =>
                  dispatch(bookingActions.triggerReload({ silent: false }))
                }
              >
                {T.retry}
              </button>
            </p>
          </div>
        ) : slotView.status === "none" ? (
          <div id="timeFrame">
            <p className="slot-msg">{T.no_slot}</p>
          </div>
        ) : (
          <div className="slots" id="timeFrame">
            {(slotView.items || []).map((s) => (
              <button
                type="button"
                className="slot time-frame"
                key={s.hhmm}
                aria-pressed={s.isSel}
                disabled={s.isFull}
                onClick={() => {
                  dispatch(bookingActions.setTime(s.hhmm));
                  dispatch(bookingActions.setTimeErr(false));
                  if (!Object.values(fieldErr).some(Boolean)) {
                    dispatch(bookingActions.setErrMsg(""));
                  }
                }}
              >
                <span className="slot-time">{s.label}</span>
                <span className="slot-status">
                  {s.isFull ? T.full_slot : T.has_slot}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeCard;
