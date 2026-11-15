import React, { MutableRefObject } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useLanguage } from "../../hooks/useLanguage";
import { data } from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";

interface BookingSuccessProps {
  successRef: MutableRefObject<HTMLDivElement | null>;
  onNewBooking: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  successRef,
  onNewBooking,
}) => {
  const { L } = useLanguage();
  const success = useSelector((state: RootState) => state.booking.success);

  return (
    <div
      className="card done booking-successful"
      hidden={!success}
      ref={successRef}
    >
      <div className="ok">
        <Icon name="check" />
      </div>
      <h2>{L.success_title}</h2>
      <p>
        Cảm ơn bạn đã đặt lịch. Nail Room sẽ gọi điện xác nhận lại với bạn.
        <br />
        Thank you for your booking. We&apos;ll contact you for confirmation.
      </p>
      {success && (
        <dl>
          <dt>{L.appointment_date}</dt>
          <dd id="final_booked_at">{success.bookedAt}</dd>
          {success.services ? (
            <>
              <dt className="svc-row">{L.success_service}</dt>
              <dd className="svc-row" id="booking_service_names">
                {success.services}
              </dd>
            </>
          ) : null}
          {success.operatorName ? (
            <>
              <dt className="op-row">{L.success_tech}</dt>
              <dd className="op-row" id="booking_operator_name">
                {success.operatorName}
              </dd>
            </>
          ) : null}
          <dt>{L.success_address}</dt>
          <dd id="fullAddress">{success.address}</dd>
          <dt>{L.success_name}</dt>
          <dd id="bookedCustomerName">{success.name}</dd>
          <dt>{L.success_phone}</dt>
          <dd id="bookedCustomerPhone">{success.phone}</dd>
          <dt>{L.hotline}</dt>
          <dd>{data.phone}</dd>
        </dl>
      )}
      <button
        type="button"
        className="btn primary"
        id="new-booking-btn"
        onClick={onNewBooking}
      >
        {L.next_appointment}
      </button>
    </div>
  );
};

export default BookingSuccess;
