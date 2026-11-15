import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { mobileInputMask } from "../../utilities/bookingUtils";

export interface PhoneInputHandle {
  el: () => HTMLInputElement | null;
  getValue: () => string;
  setValue: (v: string) => void;
  getCountryData: () => { iso2?: string; dialCode?: string; name?: string } | null;
  setNumber: (n: string) => void;
}

interface PhoneInputProps {
  preferredCountries: string[];
  locationCountry?: string | null;
  onCommit?: () => void;
  onBlur?: () => void;
}

// Ô số điện thoại quốc tế (intl-tel-input 18.2.1 + inputmask), giống trang gốc
const PhoneInput = forwardRef<PhoneInputHandle, PhoneInputProps>(
  function PhoneInput(
    { preferredCountries, locationCountry, onCommit, onBlur },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const itiRef = useRef<any>(null);
    const userCountryRef = useRef<string | null>(null);
    const commitRef = useRef(onCommit);
    commitRef.current = onCommit;

    const applyMask = () => {
      if (typeof window === "undefined" || !inputRef.current) return;
      const Inputmask = require("inputmask");
      const maskFn = Inputmask.default || Inputmask;
      const country = userCountryRef.current || locationCountry || "VN";
      maskFn(mobileInputMask(country), {
        greedy: false,
        showMaskOnHover: false,
      }).mask(inputRef.current);
    };

    useEffect(() => {
      if (typeof window === "undefined" || !inputRef.current) return;
      const el = inputRef.current;
      const intlTelInputModule = require("intl-tel-input/build/js/intlTelInput.js");
      const intlTelInput = intlTelInputModule.default || intlTelInputModule;

      const iti = intlTelInput(el, {
        initialCountry:
          preferredCountries.length > 0
            ? preferredCountries[0].toLowerCase()
            : "vn",
        preferredCountries: preferredCountries.map((c) => c.toLowerCase()),
        separateDialCode: true,
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
      });
      itiRef.current = iti;

      const onCountry = () => {
        const d = iti.getSelectedCountryData();
        userCountryRef.current = d && d.iso2 ? d.iso2.toUpperCase() : null;
        applyMask();
      };
      const onNativeChange = () => commitRef.current && commitRef.current();

      el.addEventListener("countrychange", onCountry);
      el.addEventListener("change", onNativeChange);
      applyMask();

      return () => {
        el.removeEventListener("countrychange", onCountry);
        el.removeEventListener("change", onNativeChange);
        if (iti && typeof iti.destroy === "function") {
          iti.destroy();
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (itiRef.current) applyMask();
    }, [locationCountry]); // eslint-disable-line react-hooks/exhaustive-deps

    useImperativeHandle(ref, () => ({
      el: () => inputRef.current,
      getValue: () => (inputRef.current ? inputRef.current.value || "" : ""),
      setValue: (v: string) => {
        if (inputRef.current) inputRef.current.value = v;
      },
      getCountryData: () =>
        itiRef.current ? itiRef.current.getSelectedCountryData() : null,
      setNumber: (n: string) => itiRef.current && itiRef.current.setNumber(n),
    }));

    return (
      <input
        ref={inputRef}
        className="input"
        type="tel"
        name="mobile"
        id="mobile"
        autoComplete="tel"
        defaultValue=""
        onBlur={onBlur}
      />
    );
  }
);

export default PhoneInput;
