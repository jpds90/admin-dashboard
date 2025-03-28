document.addEventListener("DOMContentLoaded", function () {
    const translateContainer = document.getElementById("translate-container");
    translateContainer.innerHTML = `
        <button onclick="toggleTranslateDropdown()" style="background-color: #e0f9e0; color: #1b5e20; padding: 10px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px;">
            🌍 <span id="selected-lang">PT</span> ▼
        </button>

        <div id="translate-dropdown" style="display: none; position: absolute; bottom: 40px; right: 0; background: white; border: 1px solid #ccc; border-radius: 5px; padding: 5px;">
            <button onclick="changeLanguage('pt')">PT</button>
            <button onclick="changeLanguage('en')">EN</button>
            <button onclick="changeLanguage('es')">ES</button>
            <button onclick="changeLanguage('fr')">FR</button>
        </div>
        <div id="google_translate_element" style="display: none;"></div>
    `;

    // Carregar o script do Google Translate
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Esperar o carregamento completo do Google Translate
    script.onload = function () {
        // Ocultar o banner do Google Tradutor
        const translateBanner = document.querySelector('.goog-te-banner-frame');
        if (translateBanner) {
            translateBanner.style.display = 'none';
        }
    };
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: "pt" }, "google_translate_element");
}

function changeLanguage(langCode) {
    document.getElementById("selected-lang").innerText = langCode.toUpperCase();
    const googleFrame = document.querySelector(".goog-te-combo");
    if (googleFrame) {
        googleFrame.value = langCode;
        googleFrame.dispatchEvent(new Event("change"));
    }
    document.getElementById("translate-dropdown").style.display = "none";
}

function toggleTranslateDropdown() {
    const dropdown = document.getElementById("translate-dropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}
