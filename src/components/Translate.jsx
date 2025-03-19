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
                    includedLanguages: "en,es,pt,fr", // Restringe as línguas disponíveis
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
                },
                "google_translate_element"
            );
        };
    }, []);

    return <div id="google_translate_element"></div>;
};

export default Translate;
