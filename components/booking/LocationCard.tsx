import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookingActions } from "../../store/booking-slice";
import { useLanguage } from "../../hooks/useLanguage";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { buildRegions, locationList } from "../../utilities/bookingUtils";
import ScrollRow from "../UI/ScrollRow";

const LocationCard: React.FC = () => {
  const dispatch = useDispatch();
  const { T, L } = useLanguage();
  const { width } = useWindowDimensions();
  const { loc, region, locMore } = useSelector(
    (state: RootState) => state.booking
  );

  const locationLimit = width <= 520 ? 3 : 6;
  const regions = buildRegions(T.other_region);
  const inRegion = locationList.filter(
    (l) => !region || l.region_key === region
  );

  let shownLocs = locMore ? inRegion : inRegion.slice(0, locationLimit);
  if (!locMore && inRegion.length > locationLimit) {
    const sel = inRegion.find((l) => l.id == loc);
    if (sel && !shownLocs.includes(sel)) {
      shownLocs = [...shownLocs];
      shownLocs[shownLocs.length - 1] = sel;
    }
  }

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

  return (
    <div className="card">
      <div className="step-h">
        <i></i>
        <h2>{L.select_location}</h2>
      </div>
      <ScrollRow
        className="chips"
        id="regions"
        hidden={regions.length < 2}
        deps={[region]}
      >
        {regionChips}
      </ScrollRow>
      <div className="opt-grid" id="locationBtn">
        {shownLocs.map((l) => {
          const area = [l.district_name, l.city_name]
            .filter(Boolean)
            .join(", ");
          return (
            <button
              type="button"
              className="opt location-btn"
              key={l.id}
              aria-pressed={l.id == loc}
              onClick={() => dispatch(bookingActions.selectLocation(l.id))}
            >
              <b>{l.name}</b>
              <small>{l.address}</small>
              {area ? <small>{area}</small> : null}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="more"
        id="loc-more"
        hidden={inRegion.length <= locationLimit}
        onClick={() => dispatch(bookingActions.setLocMore(!locMore))}
      >
        {locMore
          ? T.collapse
          : T.more_locations.replace(
              "{count}",
              String(inRegion.length - shownLocs.length)
            )}
      </button>
    </div>
  );
};

export default LocationCard;
