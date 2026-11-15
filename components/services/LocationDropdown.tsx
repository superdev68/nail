import React, { useEffect, useRef, useState } from "react";
import { cleanAddress, locationList } from "../../utilities/bookingUtils";
import { useLanguage } from "../../hooks/useLanguage";
import Icon from "../UI/Icon";

interface LocationDropdownProps {
  loc: number;
  onSelect: (id: number) => void;
}

// Ô chọn chi nhánh tự vẽ (tab Dịch vụ)
const LocationDropdown: React.FC<LocationDropdownProps> = ({
  loc,
  onSelect,
}) => {
  const { L } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = locationList.find((l) => l.id == loc);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="dd" id="locationSelect2" ref={ref}>
      <button
        type="button"
        className="input dd-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={L.filter_branch}
        onClick={() => setOpen(!open)}
      >
        <Icon name="pin" />
        <span>{current ? current.name : ""}</span>
      </button>
      <div className="dd-panel" role="listbox" hidden={!open}>
        {locationList.map((l) => {
          const address = cleanAddress(l.fullAddress);
          return (
            <button
              type="button"
              className="dd-item"
              role="option"
              key={l.id}
              aria-selected={l.id == loc}
              onClick={() => {
                setOpen(false);
                onSelect(l.id);
              }}
            >
              <b>{l.name}</b>
              {address ? <small>{address}</small> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationDropdown;
