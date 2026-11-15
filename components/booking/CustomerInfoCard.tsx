import React, { MutableRefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import {
  getLocation,
  getPreferredCountries,
  use_email4booking,
} from "../../utilities/bookingUtils";
import PhoneInput, { PhoneInputHandle } from "../UI/PhoneInput";

interface CustomerInfoCardProps {
  cardRef: MutableRefObject<HTMLDivElement | null>;
  phoneRef: MutableRefObject<PhoneInputHandle | null>;
  nameFilledByLookupRef: MutableRefObject<boolean>;
  onFieldBlur: (id: "customer_name" | "mobile" | "email") => void;
  onContactChange: (emailValue?: string) => void;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  cardRef,
  phoneRef,
  nameFilledByLookupRef,
  onFieldBlur,
  onContactChange,
}) => {
  const dispatch = useDispatch();
  const { L } = useLanguage();
  const { loc, email, name, gender, guests, fieldErr, checking } = useSelector(
    (state: RootState) => state.booking
  );

  const location = getLocation(loc);
  const preferredCountries = getPreferredCountries();

  const fieldCls = (id: string, extra = "") =>
    "field " + extra + (fieldErr[id] ? " has-error" : "");

  return (
    <div className="card" ref={cardRef}>
      <div className="step-h">
        <i></i>
        <h2>
          {L.customer_info}
          <span className="spin" id="checking" hidden={!checking}></span>
        </h2>
      </div>
      <div className="fields both-contact">
        <div className={fieldCls("mobile")}>
          <label htmlFor="mobile">
            {L.phone} <em>*</em>
          </label>
          <PhoneInput
            ref={phoneRef}
            preferredCountries={preferredCountries}
            locationCountry={location && location.country_code}
            onBlur={() => onFieldBlur("mobile")}
            onCommit={() => {
              if (!use_email4booking) onContactChange();
            }}
          />
        </div>
        <div className={fieldCls("email", "f-email")}>
          <label htmlFor="email">{L.email}</label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            maxLength={50}
            autoComplete="email"
            value={email}
            onChange={(e) => dispatch(bookingActions.setEmail(e.target.value))}
            onBlur={(e) => {
              onFieldBlur("email");
              if (use_email4booking) onContactChange(e.target.value);
            }}
          />
        </div>
        <div className={fieldCls("customer_name", "f-name")}>
          <label htmlFor="customer_name">
            {L.full_name} <em>*</em>
          </label>
          <input
            className="input"
            type="text"
            name="customer_name"
            id="customer_name"
            maxLength={50}
            autoComplete="name"
            value={name}
            onChange={(e) => {
              nameFilledByLookupRef.current = false;
              dispatch(bookingActions.setName(e.target.value));
            }}
            onBlur={() => onFieldBlur("customer_name")}
          />
        </div>
        <div className="field f-gender">
          <span className="lbl">&nbsp;</span>
          <div className="seg" role="group" id="gender" data-value={gender}>
            <button
              type="button"
              aria-pressed={gender === "F"}
              onClick={() => dispatch(bookingActions.setGender("F"))}
            >
              {L.gender_f}
            </button>
            <button
              type="button"
              aria-pressed={gender === "M"}
              onClick={() => dispatch(bookingActions.setGender("M"))}
            >
              {L.gender_m}
            </button>
          </div>
        </div>
      </div>
      <div className="guests">
        <b>{L.attending}</b>
        <div className="stepper">
          <button
            type="button"
            aria-label="-"
            onClick={() =>
              dispatch(bookingActions.setGuests(Math.max(1, guests - 1)))
            }
          >
            −
          </button>
          <output id="numberGuest">{guests}</output>
          <button
            type="button"
            aria-label="+"
            onClick={() =>
              dispatch(bookingActions.setGuests(Math.min(20, guests + 1)))
            }
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
