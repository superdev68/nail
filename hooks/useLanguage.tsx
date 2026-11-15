import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import en from "../locales/en";
import vi, { ILocaleTexts } from "../locales/vi";
import { setting } from "../utilities/bookingUtils";

const translations: Record<"vi" | "en", ILocaleTexts> = {
  en,
  vi,
};

export function resolveLocale(
  queryLang?: string | string[],
  routerLocale?: string
): "vi" | "en" {
  const q = Array.isArray(queryLang) ? queryLang[0] : queryLang;
  if (q === "vi" || q === "en") return q;
  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search).get("lang");
    if (sp === "vi" || sp === "en") return sp;
  }
  if (routerLocale === "vi" || routerLocale === "en") return routerLocale;
  return setting.language === "vi" ? "vi" : "en";
}

export const useLanguage = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<"vi" | "en">(() =>
    resolveLocale(router.query?.lang, router.locale)
  );

  useEffect(() => {
    const nextLocale = resolveLocale(router.query?.lang, router.locale);
    setLocale(nextLocale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = nextLocale;
    }
  }, [router.query?.lang, router.locale]);

  const t = translations[locale] ?? en;

  const changeLanguage = (lang: "vi" | "en") => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = "";
      url.searchParams.set("lang", lang);
      window.location.href = url.toString();
    }
  };

  return {
    t,
    T: t,
    L: t,
    locale,
    changeLanguage,
  };
};
