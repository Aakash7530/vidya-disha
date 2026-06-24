const LanguageSelector = () => null; export default LanguageSelector;
/*
import { useEffect, useState } from "react";
import { Languages, CheckCircle2, XCircle, Loader2, Activity, X as XIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "ur", name: "اردو (Urdu)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  { code: "as", name: "অসমীয়া (Assamese)" },
  { code: "ne", name: "नेपाली (Nepali)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ar", name: "العربية" },
  { code: "zh-CN", name: "中文" },
  { code: "ja", name: "日本語" },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __vidyaTranslateReady?: boolean;
  }
}

const readCurrentLang = (): string => {
  const match = document.cookie.match(/googtrans=([^;]+)/);
  if (!match) return "en";
  const parts = decodeURIComponent(match[1]).split("/");
  return parts[2] || "en";
};

type TestStatus = "idle" | "checking" | "ok" | "fail";

let __vidyaResetOwnerCount = 0;

const LanguageSelector = () => {
  const [current, setCurrent] = useState("en");
  const [status, setStatus] = useState<TestStatus>("idle");
  const [ownsReset, setOwnsReset] = useState(false);

  useEffect(() => {
    __vidyaResetOwnerCount += 1;
    if (__vidyaResetOwnerCount === 1) setOwnsReset(true);
    setCurrent(readCurrentLang());

    const mountPoint = document.getElementById("google_translate_element") || document.createElement("div");
    mountPoint.id = "google_translate_element";
    mountPoint.setAttribute("aria-hidden", "true");
    Object.assign(mountPoint.style, {
      position: "fixed",
      left: "-9999px",
      top: "-9999px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0",
      pointerEvents: "none",
    });
    if (!mountPoint.parentElement) document.body.appendChild(mountPoint);

    window.googleTranslateElementInit = () => {
      if (window.__vidyaTranslateReady || !window.google?.translate) return;
      window.__vidyaTranslateReady = true;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    if (window.google?.translate) {
      window.googleTranslateElementInit();
      return;
    }

    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      __vidyaResetOwnerCount = Math.max(0, __vidyaResetOwnerCount - 1);
    };
  }, []);

  const setCookie = (lang: string) => {
    const value = lang === "en" ? "/en/en" : `/en/${lang}`;
    const host = window.location.hostname;
    // Clear existing cookies first
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `googtrans=;path=/;${expire}`;
    document.cookie = `googtrans=;path=/;domain=${host};${expire}`;
    document.cookie = `googtrans=;path=/;domain=.${host};${expire}`;
    // Set new cookies
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=${host}`;
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  };

  const applyGoogleTranslate = (lang: string) => {
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!combo) {
      window.location.reload();
      return;
    }
    
    // Set combo value. For English (default), we set it to "en" or "" to revert.
    combo.value = lang === "en" ? "en" : lang;
    if (combo.value === "" && lang === "en") {
        combo.value = "";
    }
    
    // Dispatch native HTML event for better compatibility with Google Translate script
    const event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, true);
    combo.dispatchEvent(event);

    // If switching back to English, forcefully attempt to restore original text via the Google Translate iframe banner
    if (lang === "en") {
      try {
        const iframe = document.querySelector<HTMLIFrameElement>(".goog-te-banner-frame");
        if (iframe) {
          const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
          const restoreBtn = innerDoc?.getElementById(":1.restore") as HTMLElement;
          if (restoreBtn) restoreBtn.click();
        }
      } catch (e) {
        // Cross-origin iframe issues can be ignored
      }
      
      // Secondary fallback to remove Google Translate injected styles on 'body'
      document.body.style.top = "0px";
      document.body.style.position = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setCurrent(lang);
    setCookie(lang);
    // Increase timeout to ensure Google Translate combo is ready and reacts to the cookie change
    setTimeout(() => applyGoogleTranslate(lang), 300);
  };

  const runSelfTest = () => {
    setStatus("checking");
    const langName = LANGUAGES.find((l) => l.code === current)?.name ?? current;

    const check = (attemptsLeft: number) => {
      const scriptLoaded = !!document.getElementById("google-translate-script");
      const apiReady = !!window.google?.translate;
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");

      if (apiReady && combo) {
        setStatus("ok");
        toast({
          title: "✓ Translator working",
          description: `Engine loaded. Current language: ${langName}.`,
        });
        return;
      }

      if (attemptsLeft <= 0) {
        setStatus("fail");
        const reason = !scriptLoaded
          ? "Script failed to load (network/CSP blocked)."
          : !apiReady
            ? "Google Translate API did not initialize."
            : "Translate widget element missing.";
        toast({
          title: "✗ Translator unavailable",
          description: `${reason} Current selected language: ${langName}.`,
          variant: "destructive",
        });
        return;
      }

      setTimeout(() => check(attemptsLeft - 1), 500);
    };

    check(6);
  };

  const StatusIcon = () => {
    if (status === "checking") return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
    if (status === "ok") return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
    if (status === "fail") return <XCircle className="w-3.5 h-3.5 text-destructive" />;
    return <Activity className="w-3.5 h-3.5" />;
  };

  const currentLangName = LANGUAGES.find((l) => l.code === current)?.name ?? current;
  const statusText =
    status === "checking"
      ? `Checking translator for ${currentLangName}…`
      : status === "ok"
        ? `Loaded · ${currentLangName}`
        : status === "fail"
          ? `Not loaded · ${currentLangName}`
          : `Idle · ${currentLangName}`;
  const statusToneClass =
    status === "ok"
      ? "text-primary"
      : status === "fail"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-muted-foreground" />
        <select
          value={current}
          onChange={handleChange}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 notranslate"
          translate="no"
          aria-label="Select language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={runSelfTest}
          disabled={status === "checking"}
          title="Test translator"
          aria-label="Run translator self-test"
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors notranslate"
          translate="no"
        >
          <StatusIcon />
          <span className="hidden md:inline">Test</span>
        </button>
      </div>
      <span
        className={`text-[11px] leading-none pl-6 notranslate ${statusToneClass}`}
        translate="no"
        aria-live="polite"
      >
        {statusText}
      </span>

      {ownsReset && current !== "en" && (
        <button
          type="button"
          onClick={() => {
            const synthetic = { target: { value: "en" } } as React.ChangeEvent<HTMLSelectElement>;
            handleChange(synthetic);
          }}
          className="vidya-translate-reset notranslate flex items-center gap-1.5 px-3 py-2 rounded-full bg-destructive text-destructive-foreground shadow-lg text-xs font-medium hover:opacity-90 transition-opacity"
          translate="no"
          aria-label="Turn off translation"
          title="Turn off translation (back to English)"
        >
          <XIcon className="w-3.5 h-3.5" />
          <span>Stop translation</span>
        </button>
      )}
    </div>
  );
};

export default LanguageSelector;
*/
