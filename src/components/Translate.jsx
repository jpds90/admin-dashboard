import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Translate = () => {
    const [selectedLang, setSelectedLang] = useState("pt");
    const [isOpen, setIsOpen] = useState(false);

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

    const changeLanguage = (langCode) => {
        setSelectedLang(langCode);
        const googleFrame = document.querySelector(".goog-te-combo");
        if (googleFrame) {
            googleFrame.value = langCode;
            googleFrame.dispatchEvent(new Event("change"));
        }
        setIsOpen(false);
    };

    const languages = [
        { code: "pt", label: "PT" },
        { code: "en", label: "EN" },
        { code: "es", label: "ES" },
        { code: "fr", label: "FR" }
    ];

    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
            >
                <span className="font-bold">🌍 {languages.find(lang => lang.code === selectedLang)?.label}</span>
                <ChevronDown size={16} />
            </button>
            
            {isOpen && (
                <div className="absolute mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                selectedLang === lang.code ? "font-bold bg-gray-200" : ""
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
            <div id="google_translate_element" className="hidden"></div>
        </div>
    );
};

export default Translate;
