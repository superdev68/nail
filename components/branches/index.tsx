import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import {
  buildRegions,
  cleanAddress,
  locationList,
  mapUrl,
  matchKeyword,
  scrollToEl,
} from "../../utilities/bookingUtils";
import Icon from "../UI/Icon";
import ScrollRow from "../UI/ScrollRow";

const BranchesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L } = useLanguage();
  const { tab, region, bq } = useSelector((state: RootState) => state.booking);
  const hidden = tab !== "saloninfo";

  const regions = buildRegions(T.other_region);
  const inRegion = locationList.filter((l) => !region || l.region_key === region);
  const branches = inRegion.filter(
    (l) =>
      matchKeyword(l.name, bq) ||
      matchKeyword(cleanAddress(l.fullAddress), bq) ||
      matchKeyword(l.address, bq)
  );

  const regionChips =
    regions.length < 2
      ? null
      : [
          <button
            type="button"
            className="chip"
            key="_all"
            aria-pressed={region === ""}
            onClick={() => dispatch(bookingActions.setRegion(""))}
          >
            {T.all_regions}
            <small>{locationList.length}</small>
          </button>,
          ...regions.map((r) => (
            <button
              type="button"
              className="chip"
              key={r.key}
              aria-pressed={region === r.key}
              onClick={() => dispatch(bookingActions.setRegion(r.key))}
            >
              {r.label}
              <small>{r.count}</small>
            </button>
          )),
        ];

  const handleBookHere = (id: number) => {
    dispatch(bookingActions.selectLocation(id));
    dispatch(bookingActions.setTab("booking"));
    setTimeout(() => {
      if (typeof document !== "undefined") {
        scrollToEl(document.getElementById("booking"));
      }
    }, 0);
  };

  return (
    <section
      id="saloninfo"
      role="tabpanel"
      aria-labelledby="tab-saloninfo"
      hidden={hidden}
    >
      <div className="search" style={{ maxWidth: 420 }}>
        <Icon name="search" />
        <input
          className="input"
          id="branch-q"
          type="search"
          placeholder={L.search_branch}
          aria-label={L.search_branch}
          value={bq}
          onChange={(e) => dispatch(bookingActions.setBq(e.target.value))}
        />
      </div>
      <ScrollRow
        className="chips"
        id="regions2"
        hidden={regions.length < 2}
        deps={[region, hidden]}
      >
        {regionChips}
      </ScrollRow>
      <div className="branches" id="branches">
        {branches.length === 0 ? (
          <p className="none">{T.no_location_found}</p>
        ) : (
          branches.map((loc) => (
            <div className="card branch" key={loc.id}>
              <div className="map"></div>
              <div className="branch-b">
                <h3>{loc.name}</h3>
                <p>
                  <Icon name="pin" />
                  <span>{cleanAddress(loc.fullAddress)}</span>
                </p>
                {loc.phone ? (
                  <p>
                    <Icon name="phone" />
                    <a href={"tel:" + loc.phone}>{loc.phone}</a>
                  </p>
                ) : null}
                <div className="branch-a">
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => handleBookHere(loc.id)}
                  >
                    {T.book_here}
                  </button>
                  <a
                    className="btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={mapUrl(loc)}
                  >
                    {T.directions}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BranchesTab;
