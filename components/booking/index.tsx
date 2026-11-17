import React, { useCallback, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { IProduct, ISlotView, ITimeSlotItem } from "../../lib/types";
import {
  createBooking,
  getCustomerByMobile,
  getTimeFrame,
} from "../../services/api";
import {
  cleanAddress,
  date_format_pttrn,
  dayStartISO,
  defaultLocation,
  defaultSection,
  EMAIL_REGEX,
  getLocation,
  getOperatorById,
  getProduct,
  hhmmssToObj,
  inMerchantTime,
  merchant_id,
  merchant_timezone,
  merchantNow,
  merchantToday,
  merchantTimezoneText,
  scrollToEl,
  setting,
  time_format_pttrn,
  trimCustomerName,
  use_email4booking,
  useSectionOfDay,
  validateMobile,
} from "../../utilities/bookingUtils";
import { PhoneInputHandle } from "../UI/PhoneInput";
import CustomerInfoCard from "./CustomerInfoCard";
import LocationCard from "./LocationCard";
import DateTimeCard from "./DateTimeCard";
import OperatorCard from "./OperatorCard";
import ServiceCard from "./ServiceCard";
import NotesCard from "./NotesCard";
import AppointmentTicket from "./AppointmentTicket";
import BookingSuccess from "./BookingSuccess";

const BookingView: React.FC = () => {
  const dispatch = useDispatch();
  const { T } = useLanguage();
  const {
    tab,
    loc,
    today,
    date,
    time,
    section,
    services,
    op,
    guests,
    gender,
    name,
    email,
    note,
    fieldErr,
    timeErr,
    success,
    slotState,
    reloadKey,
  } = useSelector((state: RootState) => state.booking);

  const phoneRef = useRef<PhoneInputHandle | null>(null);
  const bookingRef = useRef<HTMLElement | null>(null);
  const timeBlockRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const customerCardRef = useRef<HTMLDivElement | null>(null);

  const slotReq = useRef(0);
  const customerId = useRef<number | null>(null);
  const currentContact = useRef("");
  const nameFilledByLookup = useRef(false);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = getLocation(loc);
  const startTime = dayStartISO(date);

  // ---------- khung giờ ----------
  const loadSlots = useCallback(
    (isSilent: boolean) => {
      const requestId = ++slotReq.current;
      const requestedDate = date;
      const params: {
        merchant_id: number;
        location_id: number;
        date: string;
        operator_id?: number;
      } = {
        merchant_id,
        location_id: loc || defaultLocation,
        date: date,
      };
      if (op) params.operator_id = op;
      if (!isSilent) {
        dispatch(
          bookingActions.setSlotState({
            status: "loading",
            list: [],
            workingHours: null,
          })
        );
      }

      getTimeFrame(params)
        .then((result) => {
          if (requestId !== slotReq.current) return;
          if (result && result.timeFrame) {
            const wh = result.timeFrame.workingHours;
            dispatch(
              bookingActions.setSlotState({
                status: "ok",
                list: result.timeFrame.timeFrame || [],
                workingHours: wh,
              })
            );
            if (wh && requestedDate === merchantToday()) {
              dispatch(bookingActions.setTodayHours(wh));
            }
          } else {
            throw new Error("bad");
          }
        })
        .catch(() => {
          if (requestId !== slotReq.current || isSilent) return;
          dispatch(
            bookingActions.setSlotState({
              status: "failed",
              list: [],
              workingHours: null,
            })
          );
          dispatch(bookingActions.setTime(""));
        });
    },
    [date, loc, op, dispatch]
  );

  useEffect(() => {
    loadSlots(false);
  }, [loadSlots]);

  useEffect(() => {
    if (reloadKey.n) loadSlots(reloadKey.silent);
  }, [reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // tải lại khung giờ mỗi 15 phút
  useEffect(() => {
    const t = setInterval(
      () => dispatch(bookingActions.triggerReload({ silent: true })),
      15 * 60 * 1000
    );
    return () => clearInterval(t);
  }, [dispatch]);

  // đổi chi nhánh khi đang xem ngày khác: tải riêng giờ mở cửa hôm nay
  useEffect(() => {
    const td = merchantToday();
    if (date === td) return;
    const locationId = loc || defaultLocation;
    getTimeFrame({
      merchant_id,
      location_id: locationId,
      date: td,
    })
      .then((r) => {
        if (r && r.timeFrame) {
          dispatch(bookingActions.setTodayHours(r.timeFrame.workingHours));
        }
      })
      .catch(() => {});
  }, [loc]); // eslint-disable-line react-hooks/exhaustive-deps

  // trang để mở qua nửa đêm
  useEffect(() => {
    const check = () => {
      const td = merchantToday();
      if (today !== td) {
        dispatch(bookingActions.setToday(td));
        if (date < td) {
          dispatch(bookingActions.setTime(""));
          dispatch(bookingActions.setSection(defaultSection(false)));
          dispatch(bookingActions.selectDate(td));
        } else {
          dispatch(bookingActions.triggerReload({ silent: true }));
        }
      }
    };
    const t = setInterval(check, 60 * 1000);
    const onVis = () => {
      if (!document.hidden) check();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", check);
    };
  }, [today, date, dispatch]);

  // các ô giờ đang hiển thị
  const slotView = useMemo<ISlotView>(() => {
    const { status, list, workingHours } = slotState;
    if (status !== "ok") return { status };
    if (workingHours && workingHours.is_working == 0) {
      return { status: "none", keep: false };
    }

    const thisTime = merchantNow();
    if (setting.booking_before_min) {
      thisTime.add(setting.booking_before_min, "minutes");
    }
    const ds = (workingHours && hhmmssToObj(workingHours.start_time)) || {
      hour: 8,
      min: 0,
    };
    const de = (workingHours && hhmmssToObj(workingHours.end_time)) || {
      hour: 22,
      min: 0,
    };
    let startSlot = moment(startTime)
      .utcOffset(merchant_timezone)
      .hours(ds.hour)
      .minutes(ds.min);
    let endSlot = moment(startTime)
      .utcOffset(merchant_timezone)
      .hours(de.hour)
      .minutes(de.min);
    const dayStart = startSlot;
    const dayEnd = endSlot;
    const noon = moment(startTime)
      .utcOffset(merchant_timezone)
      .hours(12)
      .minutes(0);
    const eve = moment(startTime)
      .utcOffset(merchant_timezone)
      .hours(18)
      .minutes(0);

    switch (useSectionOfDay ? section : "") {
      case "morning":
        startSlot = startSlot.isSameOrBefore(noon) ? startSlot : noon;
        endSlot = endSlot.isSameOrBefore(noon) ? endSlot : noon;
        break;
      case "afternoon":
        startSlot = startSlot.isSameOrAfter(noon)
          ? startSlot.isSameOrBefore(eve)
            ? startSlot
            : eve
          : noon;
        endSlot = endSlot.isSameOrAfter(noon)
          ? endSlot.isSameOrBefore(eve)
            ? endSlot
            : eve
          : noon;
        break;
      case "evening":
        startSlot = startSlot.isSameOrAfter(eve) ? startSlot : eve;
        endSlot = endSlot.isSameOrAfter(eve) ? endSlot : eve;
        break;
      default:
        break;
    }

    const items: ITimeSlotItem[] = [];
    let keep = false;
    list.forEach((s) => {
      const m = inMerchantTime(s.time);
      if (m.diff(dayStart) < 0 || !m.isBefore(dayEnd)) return;
      const hhmm = m.format("HH:mm");
      const isFull = m.isBefore(thisTime) || !!s.isSlotFull;
      const isSel = !isFull && hhmm === time;
      if (isSel) keep = true;
      if (m.diff(startSlot) >= 0 && m.isBefore(endSlot)) {
        items.push({
          hhmm,
          label: m.format(time_format_pttrn),
          isFull,
          isSel,
        });
      }
    });
    return { status: items.length ? "ok" : "none", items, keep };
  }, [slotState, section, time, startTime]);

  // bỏ giờ đã chọn khi khung giờ đó không còn chỗ
  useEffect(() => {
    if (
      (slotView.status === "ok" || slotView.status === "none") &&
      !slotView.keep &&
      time
    ) {
      dispatch(bookingActions.setTime(""));
    }
  }, [slotView]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedSlotMoment = useCallback(() => {
    if (!time) return null;
    for (const s of slotState.list) {
      const m = inMerchantTime(s.time);
      if (m.format("HH:mm") === time) return m;
    }
    return null;
  }, [time, slotState.list]);

  const dateTimeText = useMemo(() => {
    const d =
      selectedSlotMoment() ||
      moment(date, "YYYY-MM-DD").utcOffset(merchant_timezone, true);
    return (
      T.weekday[d.day()] +
      ", " +
      d.format(date_format_pttrn) +
      (time ? " " + time + " (" + merchantTimezoneText() + ")" : "")
    );
  }, [selectedSlotMoment, date, time, T]);

  // ---------- kiểm tra dữ liệu ----------
  const values = () => ({
    customer_name: name,
    mobile: phoneRef.current ? phoneRef.current.getValue() : "",
    email,
  });

  const validateField = (
    id: "customer_name" | "mobile" | "email",
    nextErrs: Record<string, boolean>,
    v = values()
  ) => {
    const value = (v[id] || "").trim();
    let hasError = false;
    let message = T.required;
    if (id === "customer_name") {
      hasError = value.length <= 0;
    } else if (id === "mobile") {
      hasError = use_email4booking
        ? false
        : !validateMobile(value, location && location.country_code);
    } else if (id === "email") {
      if (value.length > 0 && !EMAIL_REGEX.test(value)) {
        hasError = true;
        message = T.email_invalid;
      } else if (use_email4booking && value.length <= 0) {
        hasError = true;
      }
    }
    nextErrs[id] = hasError;
    return { hasError, message };
  };

  const onFieldBlur = (id: "customer_name" | "mobile" | "email") => {
    const next = { ...fieldErr };
    const { hasError, message } = validateField(id, next);
    dispatch(bookingActions.setFieldErr(next));
    if (hasError) {
      dispatch(bookingActions.setErrMsg(message));
    } else if (!Object.values(next).some(Boolean) && !timeErr) {
      dispatch(bookingActions.setErrMsg(""));
    }
  };

  // ---------- tra cứu khách theo SĐT / email ----------
  const getCustomerInfo = (contact: string) => {
    const params: { merchant_id: number; email?: string; mobile?: string } = {
      merchant_id,
    };
    if (use_email4booking) params.email = contact;
    else params.mobile = contact;

    getCustomerByMobile(params)
      .then((result) => {
        if (
          result &&
          result.data &&
          Object.getOwnPropertyNames(result.data).length > 0
        ) {
          const c = result.data;
          if (c.gender === "F" || c.gender === "M") {
            dispatch(bookingActions.setGender(c.gender));
          }
          dispatch(bookingActions.setName(trimCustomerName(c.full_name)));
          nameFilledByLookup.current = true;
          if (c.email) dispatch(bookingActions.setEmail(c.email));
          if (c.phone_country_code && c.mobile && phoneRef.current) {
            phoneRef.current.setNumber(
              c.mobile.startsWith("+")
                ? c.mobile
                : "+" + c.phone_country_code + c.mobile
            );
          }
          const n = { ...fieldErr, customer_name: false };
          dispatch(bookingActions.setFieldErr(n));
          if (!Object.values(n).some(Boolean)) {
            dispatch(bookingActions.setErrMsg(""));
          }
          customerId.current = c.id || null;
        } else {
          if (nameFilledByLookup.current) {
            dispatch(bookingActions.setName(""));
            if (!use_email4booking) dispatch(bookingActions.setEmail(""));
            nameFilledByLookup.current = false;
          }
          customerId.current = null;
        }
      })
      .catch(() => {})
      .finally(() => dispatch(bookingActions.setChecking(false)));
  };

  const phoneUsesLeadingZero = () => {
    const d = phoneRef.current ? phoneRef.current.getCountryData() : null;
    const cc =
      d && d.iso2
        ? d.iso2.toUpperCase()
        : location && location.country_code
        ? location.country_code
        : "VN";
    return !["US", "CA", "SG"].includes(cc);
  };

  const onContactChange = (emailValue?: string) => {
    customerId.current = null;
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    dispatch(bookingActions.setChecking(true));
    lookupTimer.current = setTimeout(() => {
      let contact = "";
      if (use_email4booking) {
        contact = (emailValue || "").replace(/ /g, "");
      } else if (phoneRef.current) {
        contact = phoneRef.current
          .getValue()
          .toString()
          .replace(/ /g, "")
          .replace(/_/g, "");
        if (contact && !contact.startsWith("0") && phoneUsesLeadingZero()) {
          contact = "0" + contact;
          phoneRef.current.setValue(contact);
        }
      }
      if (contact === currentContact.current) {
        dispatch(bookingActions.setChecking(false));
        return;
      }
      currentContact.current = contact;
      const ok = use_email4booking
        ? EMAIL_REGEX.test(contact)
        : validateMobile(contact, location && location.country_code);
      if (!ok) {
        dispatch(bookingActions.setChecking(false));
        return;
      }
      getCustomerInfo(contact);
    }, 1000);
  };

  // ---------- gửi đặt lịch ----------
  const submitBooking = () => {
    dispatch(bookingActions.setTab("booking"));
    const next: Record<string, boolean> = {};
    let firstError: string | null = null;
    let lastMsg = "";

    (["customer_name", "mobile", "email"] as const).forEach((id) => {
      const { hasError, message } = validateField(id, next);
      if (hasError) {
        lastMsg = message;
        if (!firstError) firstError = id;
      }
    });

    dispatch(bookingActions.setFieldErr(next));
    if (lastMsg) dispatch(bookingActions.setErrMsg(lastMsg));
    const customerCard = customerCardRef.current;

    if (!time) {
      dispatch(bookingActions.setTimeErr(true));
      dispatch(bookingActions.setErrMsg(T.choose_time));
      scrollToEl(firstError ? customerCard : timeBlockRef.current);
      return;
    }
    if (firstError) {
      scrollToEl(customerCard);
      return;
    }

    const cur = time.split(":");
    if (cur.length !== 2) return;
    const bookedMoment =
      selectedSlotMoment() ||
      moment(date, "YYYY-MM-DD")
        .utcOffset(merchant_timezone, true)
        .hour(Number(cur[0]))
        .minutes(Number(cur[1]))
        .second(0);
    const booked_at = bookedMoment.toISOString();

    const earliest = merchantNow().add(setting.booking_before_min || 0, "minutes");
    if (bookedMoment.isBefore(earliest)) {
      dispatch(bookingActions.setTime(""));
      dispatch(bookingActions.setTimeErr(true));
      dispatch(bookingActions.setErrMsg(T.time_passed));
      dispatch(bookingActions.triggerReload({ silent: false }));
      scrollToEl(timeBlockRef.current);
      return;
    }

    const location_id = loc || defaultLocation;
    const l = getLocation(location_id);
    const booking_code =
      parseInt(String(location_id), 10).toString(36) +
      new Date().getTime().toString(36).toUpperCase();

    const selectedProducts = services
      .map(getProduct)
      .filter((p): p is IProduct => Boolean(p));

    const productArray: number[] = [];
    const serviceNames: string[] = [];
    let service_duration = 0;

    selectedProducts.forEach((p) => {
      productArray.push(p.id);
      service_duration += p.service_duration;
      serviceNames.push(p.name);
    });

    if (productArray.length === 0) {
      service_duration = setting.default_booking_duration || 30;
    }
    const selOp = op ? getOperatorById(op, T) : null;
    const operatorName = selOp ? selOp.name : "";
    const cd = phoneRef.current ? phoneRef.current.getCountryData() : null;
    const mobile = phoneRef.current ? phoneRef.current.getValue() : "";

    const bookingData = {
      location_id,
      merchant_id,
      customer_id: customerId.current,
      gender,
      product_id: productArray,
      booked_at,
      operator_id: [op || 0],
      note,
      customer_name: name,
      mobile,
      phone_country_code: cd && cd.dialCode ? cd.dialCode : null,
      email,
      booking_code,
      number_of_guests: guests <= 20 ? guests : 1,
      city_code: l?.city_code || 0,
      district_code: l?.district_code || 0,
      estimated_duration: service_duration,
      externalUserId: "",
      externalAppId: "",
    };

    dispatch(bookingActions.setSubmitting(true));
    dispatch(bookingActions.setErrMsg(""));

    createBooking(bookingData)
      .then((res) => {
        if (res.status == 1) {
          dispatch(
            bookingActions.setSuccess({
              bookedAt:
                inMerchantTime(booked_at).format("HH:mm DD/MM/YYYY") +
                " (" +
                merchantTimezoneText() +
                ")",
              services: serviceNames.join(", "),
              operatorName,
              address: cleanAddress(l?.fullAddress),
              name: bookingData.customer_name,
              phone: bookingData.mobile || bookingData.email || "",
            })
          );
          setTimeout(() => scrollToEl(successRef.current), 0);
        } else {
          dispatch(
            bookingActions.setModal(
              typeof res.message === "string" && res.message
                ? res.message
                : T.booking_failed
            )
          );
        }
      })
      .catch(() => dispatch(bookingActions.setModal(T.booking_failed)))
      .finally(() => dispatch(bookingActions.setSubmitting(false)));
  };

  const submitRef = useRef(submitBooking);
  submitRef.current = submitBooking;

  useEffect(() => {
    const handler = () => submitRef.current();
    window.addEventListener("nailroom:submit-booking", handler);
    return () => window.removeEventListener("nailroom:submit-booking", handler);
  }, []);

  const handleNewBooking = () => {
    dispatch(bookingActions.resetForNewBooking());
    setTimeout(() => scrollToEl(bookingRef.current), 0);
  };

  return (
    <section
      id="booking"
      role="tabpanel"
      aria-labelledby="tab-booking"
      hidden={tab !== "booking"}
      ref={bookingRef}
    >
      <div className="cols" id="form-view" hidden={!!success}>
        <div className="stack">
          <CustomerInfoCard
            cardRef={customerCardRef}
            phoneRef={phoneRef}
            nameFilledByLookupRef={nameFilledByLookup}
            onFieldBlur={onFieldBlur}
            onContactChange={onContactChange}
          />
          <LocationCard />
          <DateTimeCard
            dateTimeText={dateTimeText}
            slotView={slotView}
            timeBlockRef={timeBlockRef}
          />
          <OperatorCard />
          <ServiceCard />
          <NotesCard />
        </div>

        <AppointmentTicket
          dateTimeText={dateTimeText}
          onSubmit={submitBooking}
        />
      </div>

      {/* đặt lịch thành công */}
      <BookingSuccess
        successRef={successRef}
        onNewBooking={handleNewBooking}
      />
    </section>
  );
};

export default BookingView;
