import { useEffect } from "react";

const Translate = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.type = "text/javascript";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "pt",
                    includedLanguages: "en,es,pt,fr", // Apenas Inglês, Espanhol, Português e Francês
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                "google_translate_element"
            );
        };
    }, []);

    return (
        <div className="relative">
            <div
                id="google_translate_element"
                className="bg-white text-gray-800 px-3 py-1 rounded-lg shadow-md cursor-pointer"
            ></div>
        </div>
    );
};

export default Translate;
