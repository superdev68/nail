import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { IServiceGroupOption } from "../../lib/types";
import {
  formatTimeDuration,
  groupName,
  matchKeyword,
  priceText,
  servicesIn,
  showPrice,
  showServices,
  svcName,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";
import ScrollRow from "../UI/ScrollRow";

const ServiceCard: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L, locale } = useLanguage();
  const { loc, services, group, q } = useSelector(
    (state: RootState) => state.booking
  );

  const locServices = useMemo(() => servicesIn(loc), [loc]);
  const showSvcCard = showServices && locServices.length > 0;

  if (!showServices) return null;

  const svcGroups: IServiceGroupOption[] = [];
  locServices.forEach((p) => {
    if (!svcGroups.find((g) => g.id == p.group_id)) {
      svcGroups.push({ id: p.group_id, name: groupName(p, locale) });
    }
  });

  const svcRows = locServices.filter(
    (p) =>
      (group === "" || String(p.group_id) === group) &&
      matchKeyword(svcName(p, locale), q)
  );

  return (
    <div className="card" id="productSetting" hidden={!showSvcCard}>
      <div className="step-h">
        <i></i>
        <h2>{L.service_info}</h2>
      </div>
      <div className="search">
        <Icon name="search" />
        <input
          className="input"
          id="svc-q"
          type="search"
          placeholder={L.search_service}
          aria-label={L.search_service}
          value={q}
          onChange={(e) => dispatch(bookingActions.setQ(e.target.value))}
        />
      </div>
      <ScrollRow
        className="chips"
        id="svc-groups"
        hidden={svcGroups.length <= 1}
        deps={[loc, group]}
      >
        {svcGroups.length > 1 && [
          <button
            type="button"
            className="chip"
            key="_all"
            aria-pressed={group === ""}
            onClick={() => dispatch(bookingActions.setGroup(""))}
          >
            {T.all_groups}
          </button>,
          ...svcGroups.map((g) => (
            <button
              type="button"
              className="chip"
              key={g.id}
              aria-pressed={group === String(g.id)}
              onClick={() => dispatch(bookingActions.setGroup(String(g.id)))}
            >
              {g.name}
            </button>
          )),
        ]}
      </ScrollRow>
      <div className="svc-list" id="svc-list">
        {svcRows.length ? (
          svcRows.map((p) => {
            const isSel = services.includes(p.id);
            const nm = svcName(p, locale);
            return (
              <div className="svc" key={p.id}>
                <div className="svc-t">
                  <b>{nm}</b>
                  <small>{formatTimeDuration(p.service_duration, T)}</small>
                </div>
                {showPrice ? (
                  <span className="price">{priceText(p, T)}</span>
                ) : null}
                <button
                  type="button"
                  className="add"
                  aria-pressed={isSel}
                  aria-label={(isSel ? T.remove : T.select) + " " + nm}
                  onClick={() => dispatch(bookingActions.toggleService(p.id))}
                >
                  <Icon name={isSel ? "check" : "plus"} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="none">{T.no_service_found}</p>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
