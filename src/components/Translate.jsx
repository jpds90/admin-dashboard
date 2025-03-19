import { useState } from "react";

const Translate = () => {
    const [selectedLang, setSelectedLang] = useState("PT");

    // Função para trocar idioma
    const changeLanguage = (langCode, langLabel) => {
        setSelectedLang(langLabel);
        const googleFrame = document.querySelector(".goog-te-combo");
        if (googleFrame) {
            googleFrame.value = langCode;
            googleFrame.dispatchEvent(new Event("change"));
        }
    };

    return (
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
            <span className="font-bold">🌍</span>
            {["PT", "EN", "ES", "FR"].map((lang) => (
                <button
                    key={lang}
                    onClick={() => changeLanguage(lang.toLowerCase(), lang)}
                    className={`px-2 py-1 rounded ${
                        selectedLang === lang ? "bg-green-300 font-bold" : ""
                    }`}
                >
                    {lang}
                </button>
            ))}
        </div>
    );
};

export default Translate;
