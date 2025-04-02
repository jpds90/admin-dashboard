const backendUrl = "https://backendsafor.onrender.com/traduzir";

async function translateText(text, targetLang) {
    console.log("🔄 Traduzindo:", text, "->", targetLang);

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang })
        });

        if (!response.ok) {
            throw new Error(`Erro na tradução: ${response.statusText}`);
        }

        const data = await response.json();
        return data.translations[0].text;
    } catch (error) {
        console.error("❌ Erro ao traduzir:", error);
        return text; // Retorna o texto original se houver erro
    }
}

async function translatePage(targetLang) {
    console.log("🔄 Traduzindo página para:", targetLang);

    const elements = document.querySelectorAll("[data-translate]"); // Seleciona os elementos com data-translate

    for (const el of elements) {
        const originalText = el.innerText.trim();
        if (!originalText) continue;

        el.setAttribute("data-original", originalText); // Salva o texto original

        try {
            const translatedText = await translateText(originalText, targetLang);
            el.innerText = translatedText;
        } catch (error) {
            console.error("❌ Erro ao traduzir o elemento:", el, error);
        }
    }

    console.log("✅ Tradução aplicada com sucesso!");
}

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("language-dropdown");

    // 🟢 Verifica se há um idioma salvo no localStorage
    const savedLang = localStorage.getItem("selectedLanguage") || "pt";
    dropdown.value = savedLang;
    translatePage(savedLang); // Traduz automaticamente ao carregar a página

    // 🟡 Evento para mudar o idioma quando o usuário selecionar no dropdown
    dropdown.addEventListener("change", function () {
        const selectedLang = dropdown.value;
        localStorage.setItem("selectedLanguage", selectedLang); // Salva no localStorage
        translatePage(selectedLang); // Traduz a página
    });

    console.log("✅ Seletor de idioma carregado com sucesso!");
});


