import React, { Fragment, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { IProduct } from "../../lib/types";
import {
  data,
  formatTimeDuration,
  groupName,
  matchKeyword,
  priceText,
  servicesIn,
  showPrice,
  showServices,
  svcDesc,
  svcName,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";
import LocationDropdown from "./LocationDropdown";

// TAB 3: dịch vụ (bảng giá theo chi nhánh)
const ServicesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L, locale } = useLanguage();
  const { tab, loc, mq, services: selected } = useSelector(
    (state: RootState) => state.booking
  );
  const hidden = tab !== "services";
  const [openDesc, setOpenDesc] = useState<Record<number, boolean>>({});

  const products = useMemo(() => servicesIn(loc), [loc]);
  const list = products.filter((p) => matchKeyword(svcName(p, locale), mq));

  const groupIds: number[] = [];
  const groupMap: Record<number, { name: string; items: IProduct[] }> = {};

  list.forEach((p) => {
    if (!groupMap[p.group_id]) {
      groupMap[p.group_id] = { name: groupName(p, locale), items: [] };
      groupIds.push(p.group_id);
    }
    groupMap[p.group_id].items.push(p);
  });

  return (
    <section
      id="services"
      role="tabpanel"
      aria-labelledby="tab-services"
      hidden={hidden}
    >
      {showServices && (
        <>
          <div className="menu-tools">
            <div className="search">
              <Icon name="search" />
              <input
                className="input"
                id="menu-q"
                type="search"
                placeholder={L.search_service}
                aria-label={L.search_service}
                value={mq}
                onChange={(e) => dispatch(bookingActions.setMq(e.target.value))}
              />
            </div>
            {data.location && (
              <LocationDropdown
                loc={loc}
                onSelect={(id) => dispatch(bookingActions.selectLocation(id))}
              />
            )}
          </div>
          <div id="product-grid">
            {groupIds.length === 0 ? (
              <p className="none">{T.no_service_found}</p>
            ) : (
              groupIds.map((gid) => (
                <Fragment key={gid}>
                  {groupMap[gid].name ? (
                    <h2 className="cat-h">{groupMap[gid].name}</h2>
                  ) : null}
                  <div className="menu">
                    {groupMap[gid].items.map((p) => {
                      const isSel = selected.includes(p.id);
                      const desc = svcDesc(p, locale) || "";
                      const isOpen = !!openDesc[p.id];
                      return (
                        <div className="card item" key={p.id}>
                          <div className="svc-t">
                            <b>{svcName(p, locale)}</b>
                            {desc ? (
                              <small
                                className={"desc" + (isOpen ? " open" : "")}
                              >
                                {desc}
                              </small>
                            ) : null}
                            {desc.length > 90 ? (
                              <button
                                type="button"
                                className="toggle view-more"
                                onClick={() =>
                                  setOpenDesc({ ...openDesc, [p.id]: !isOpen })
                                }
                              >
                                {isOpen ? T.view_less : T.view_more}
                              </button>
                            ) : null}
                            <small className="dur">
                              {formatTimeDuration(p.service_duration, T)}
                            </small>
                          </div>
                          <div className="side">
                            {showPrice ? (
                              <span className="price">{priceText(p, T)}</span>
                            ) : null}
                            <button
                              type="button"
                              className="pick"
                              aria-pressed={isSel}
                              onClick={() =>
                                dispatch(bookingActions.toggleService(p.id))
                              }
                            >
                              {isSel ? T.selected : T.select}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ServicesTab;
