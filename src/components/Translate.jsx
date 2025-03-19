import { useEffect, useState } from "react";
import { FaLanguage } from "react-icons/fa"; // Ícone de linguagem
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"; // Ícones de seta

const Translate = () => {
    const [open, setOpen] = useState(false); // Estado para exibir/esconder as opções

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
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                },
                "google_translate_element"
            );
        };
    }, []);

    return (
        <div className="relative inline-block">
            {/* Botão personalizado */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-xl shadow-md transition-all hover:bg-green-200"
            >
                <FaLanguage size={20} />
                <span>PT</span> {/* Padrão: Português */}
                {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>

            {/* Container do Google Translate (oculto por padrão) */}
            <div
                id="google_translate_element"
                className={`absolute left-0 mt-2 bg-white p-2 rounded-lg shadow-md ${
                    open ? "block" : "hidden"
                }`}
            ></div>
        </div>
    );
};

export default Translate;
