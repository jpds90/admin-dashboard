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
        console.log("✅ Tradução recebida:", data.translations[0].text);
        return data.translations[0].text;
    } catch (error) {
        console.error("❌ Erro ao traduzir:", error);
        return text; // Retorna o texto original se houver erro
    }
}

async function translatePage(targetLang) {
    console.log("🔄 Traduzindo página para:", targetLang);

    const elements = document.querySelectorAll("[data-translate]"); // Elementos a traduzir

    for (const el of elements) {
        const originalText = el.innerText;
        el.setAttribute("data-original", originalText); // Salva o texto original

        const translatedText = await translateText(originalText, targetLang);
        el.innerText = translatedText;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const translateContainer = document.getElementById("translate-container");

    if (!translateContainer) {
        console.error("❌ Elemento #translate-container não encontrado!");
        return;
    }

    translateContainer.innerHTML = `
        <button onclick="translatePage('en')">EN</button>
        <button onclick="translatePage('es')">ES</button>
        <button onclick="translatePage('fr')">FR</button>
    `;

    console.log("✅ Contêiner de tradução carregado com sucesso!");
});

