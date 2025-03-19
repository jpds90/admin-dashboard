import { useState, useEffect } from "react";

const Translate = () => {
    const [selectedLang, setSelectedLang] = useState("pt");

    // Adiciona o script do Google Translate na página
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { pageLanguage: "pt" },
                "google_translate_element"
            );
        };
    }, []);

    // Função para trocar idioma sem abrir o seletor do Google
    const changeLanguage = (langCode) => {
        setSelectedLang(langCode);
        const googleFrame = document.querySelector(".goog-te-combo");
        if (googleFrame) {
            googleFrame.value = langCode;
            googleFrame.dispatchEvent(new Event("change"));
        }
    };

    return (
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
            <span className="font-bold">🌍</span>
            {[
                { code: "pt", label: "PT" },
                { code: "en", label: "EN" },
                { code: "es", label: "ES" },
                { code: "fr", label: "FR" }
            ].map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2 py-1 rounded ${
                        selectedLang === lang.code ? "bg-green-300 font-bold" : ""
                    }`}
                >
                    {lang.label}
                </button>
            ))}
            <div id="google_translate_element" className="hidden"></div>
        </div>
    );
};

export default Translate;
