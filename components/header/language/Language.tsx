import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

const Language: React.FC = () => {
  const { locale, changeLanguage } = useLanguage();

  return (
    <div className="lang" role="group" aria-label="Language">
      <button
        type="button"
        aria-pressed={locale === "vi"}
        onClick={() => changeLanguage("vi")}
      >
        VI
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
    </div>
  );
};

export default Language;
