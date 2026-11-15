import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { IProduct } from "../../lib/types";
import {
  cleanAddress,
  formatMoneyNumber,
  formatTimeDuration,
  getLocation,
  getOperatorById,
  getProduct,
  operatorTypeLabel,
  priceText,
  servicesIn,
  showOperators,
  showPrice,
  showServices,
  svcName,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";

interface AppointmentTicketProps {
  dateTimeText: string;
  onSubmit: () => void;
}

const AppointmentTicket: React.FC<AppointmentTicketProps> = ({
  dateTimeText,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const { T, L, locale } = useLanguage();
  const { loc, time, name, guests, op, services, errMsg, submitting } =
    useSelector((state: RootState) => state.booking);

  const location = getLocation(loc);
  const locServices = useMemo(() => servicesIn(loc), [loc]);
  const showSvcCard = showServices && locServices.length > 0;
  const selOperator = op ? getOperatorById(op, T) : null;
  const opType = operatorTypeLabel(T);

  const selectedProducts = services
    .map(getProduct)
    .filter((p): p is IProduct => Boolean(p));

  const totalDuration = selectedProducts.reduce(
    (a, p) => a + p.service_duration,
    0
  );
  const totalPrice = selectedProducts.reduce((a, p) => a + p.default_price, 0);

  return (
    <aside className="card ticket">
      <h2>{L.your_appointment}</h2>
      <div className="ticket-b">
        <div className="row">
          <Icon name="pin" />
          <div id="t-loc">
            {location && (
              <>
                <b>{location.name}</b>
                <small>{cleanAddress(location.fullAddress)}</small>
              </>
            )}
          </div>
        </div>
        <div className="row">
          <Icon name="cal" />
          <div id="t-time">
            <b>{dateTimeText}</b>
            {!time && <small className="empty">{T.time_not_selected}</small>}
          </div>
        </div>
        <div className="row">
          <Icon name="user" />
          <div id="t-who">
            <small>{T.booked_by}</small>
            {name.trim() ? <b>{name.trim()}</b> : null}
            <small>
              {guests} {T.guests}
            </small>
          </div>
        </div>
        {showOperators && (
          <div className="row">
            <Icon name="staff" />
            <div id="t-op">
              <small>{opType}</small>
              <b>{selOperator ? selOperator.name : T.any_operator}</b>
            </div>
          </div>
        )}
        <div className="t-svcs" id="t-svcs" hidden={!showSvcCard}>
          {showSvcCard &&
            (selectedProducts.length ? (
              selectedProducts.map((p) => (
                <div className="t-svc" key={p.id}>
                  <span>{svcName(p, locale)}</span>
                  {showPrice ? (
                    <span className="price">{priceText(p, T)}</span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={T.remove}
                    onClick={() => dispatch(bookingActions.toggleService(p.id))}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="empty" style={{ color: "var(--muted)" }}>
                {T.service_not_selected}
              </span>
            ))}
        </div>
        <div className="total" id="t-total" hidden={selectedProducts.length === 0}>
          {selectedProducts.length > 0 && (
            <>
              <div>
                <span>{T.total_duration}</span>
                <b>{formatTimeDuration(totalDuration, T)}</b>
              </div>
              {showPrice && (
                <div className="big">
                  <span>{T.total_price}</span>
                  <b>{formatMoneyNumber(totalPrice)}</b>
                </div>
              )}
            </>
          )}
        </div>
        <p className="err general-message" id="err" hidden={!errMsg}>
          {errMsg}
        </p>
        <button
          className="btn primary block"
          type="button"
          id="btn-submit"
          disabled={submitting}
          onClick={onSubmit}
        >
          <Icon name="cal" />
          {L.book_appointment}
        </button>
      </div>
    </aside>
  );
};

export default AppointmentTicket;
