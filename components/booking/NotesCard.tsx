import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";

const NotesCard: React.FC = () => {
  const dispatch = useDispatch();
  const { L } = useLanguage();
  const note = useSelector((state: RootState) => state.booking.note);

  return (
    <div className="card">
      <div className="step-h">
        <i></i>
        <h2>
          <label htmlFor="note">{L.notes}</label>
        </h2>
      </div>
      <textarea
        className="input"
        id="note"
        value={note}
        onChange={(e) => dispatch(bookingActions.setNote(e.target.value))}
      ></textarea>
    </div>
  );
};

export default NotesCard;
