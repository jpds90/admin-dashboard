import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react"; // Ícone para a seta

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
        <div className="relative">
            <button className="flex items-center bg-green-200 text-green-800 px-4 py-2 rounded-2xl shadow-md gap-2">
                <span className="text-xl">🈯</span>
                <span className="font-semibold">{selectedLang.toUpperCase()}</span>
                <ChevronUp size={16} />
            </button>
            <div id="google_translate_element" className="hidden"></div>
            <div className="absolute top-14 left-0 bg-white shadow-lg rounded-md p-2 hidden">
                {["pt", "en", "es", "fr"].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Translate;
