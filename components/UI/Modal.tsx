import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import Icon from "./Icon";

const Modal: React.FC = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.booking.modal);
  const { T } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(bookingActions.setModal(null));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dispatch]);

  return (
    <div
      className="modal"
      id="modal"
      hidden={!modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dispatch(bookingActions.setModal(null));
        }
      }}
    >
      <div
        className="modal-box"
        role="alertdialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-text"
      >
        <div className="modal-icon">
          <Icon name="alert" />
        </div>
        <h3 id="modal-title">{T.booking_failed_title}</h3>
        <p id="modal-text">{modal}</p>
        <button
          type="button"
          className="btn primary"
          id="modal-ok"
          onClick={() => dispatch(bookingActions.setModal(null))}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
