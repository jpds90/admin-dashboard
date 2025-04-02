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
    document.getElementById("btn-pt").addEventListener("click", () => translatePage("pt"));
    document.getElementById("btn-en").addEventListener("click", () => translatePage("en"));
    document.getElementById("btn-es").addEventListener("click", () => translatePage("es"));

    console.log("✅ Botões de tradução adicionados com sucesso!");
});
