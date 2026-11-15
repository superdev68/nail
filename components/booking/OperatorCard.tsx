import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import {
  matchKeyword,
  operatorsIn,
  operatorTypeLabel,
  showOperators,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";

const OperatorCard: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L } = useLanguage();
  const { loc, op, opq } = useSelector((state: RootState) => state.booking);

  const locOperators = useMemo(() => operatorsIn(loc, T), [loc, T]);
  const showOpCard = showOperators && locOperators.length > 0;
  const opType = operatorTypeLabel(T);

  if (!showOperators) return null;

  let found = 0;
  const items: React.ReactNode[] = [];

  if (matchKeyword(T.any_operator, opq) || op === 0) {
    items.push(
      <button
        type="button"
        className="opt tech"
        key="0"
        aria-pressed={op === 0}
        onClick={() => dispatch(bookingActions.setOp(0))}
      >
        <span className="av">
          <Icon name="user" />
        </span>
        <span className="tech-t">
          <b>{T.any_operator}</b>
          <small>{T.any_operator_desc}</small>
        </span>
      </button>
    );
  }

  locOperators.forEach((o) => {
    const nm = o.name || T.operator_no_name;
    if (!matchKeyword(nm, opq)) return;
    found++;
    const initials = nm
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase();
    items.push(
      <button
        type="button"
        className="opt tech"
        key={o.id}
        aria-pressed={op == o.id}
        onClick={() => dispatch(bookingActions.setOp(Number(o.id) || 0))}
      >
        {o.avatar_url ? (
          <span
            className="av"
            style={{ backgroundImage: `url("${encodeURI(o.avatar_url)}")` }}
          ></span>
        ) : (
          <span className="av">{initials}</span>
        )}
        <span className="tech-t">
          <b>{nm}</b>
          {o.title ? <small>{o.title}</small> : null}
        </span>
      </button>
    );
  });

  if (opq && found === 0) {
    items.push(
      <p className="none" key="none" style={{ gridColumn: "1/-1" }}>
        {T.no_operator_found}
      </p>
    );
  }

  return (
    <div className="card" id="operatorSetting" hidden={!showOpCard}>
      <div className="step-h">
        <i></i>
        <h2 id="operator-label">{opType}</h2>
      </div>
      <p className="hint" id="operator-hint">
        <Icon name="clock" />
        <span>
          {T.operator_slot_hint.replace("{type}", opType.toLowerCase())}
        </span>
      </p>
      <div className="search">
        <Icon name="search" />
        <input
          className="input"
          id="operator-q"
          type="search"
          placeholder={L.search_name}
          aria-label={L.search_name}
          value={opq}
          onChange={(e) => dispatch(bookingActions.setOpq(e.target.value))}
        />
      </div>
      <div className="opt-grid techs" id="operator">
        {items}
      </div>
    </div>
  );
};

export default OperatorCard;
