const backendUrl = "https://backendsafor.onrender.com/traduzir";

// Função de tradução do texto (API backend)
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

// Função para aplicar a tradução na página
async function translatePage(targetLang) {
    console.log("🔄 Traduzindo página para:", targetLang);

    // Selecionar todos os elementos que precisam ser traduzidos
    const elements = document.querySelectorAll("[data-translate]");

    // Iterar sobre os elementos para traduzir
    for (const el of elements) {
        const originalText = el.innerText.trim();
        if (!originalText) continue;

        el.setAttribute("data-original", originalText); // Salva o texto original

        try {
            // Enviar o texto para o backend e pegar a tradução
            const translatedText = await translateText(originalText, targetLang);
            el.innerText = translatedText;
        } catch (error) {
            console.error("❌ Erro ao traduzir o elemento:", el, error);
        }
    }

    console.log("✅ Tradução aplicada com sucesso!");
}

document.addEventListener("DOMContentLoaded", function () {
    // 🔹 Garante que o idioma salvo seja aplicado em todas as páginas
    const savedLang = localStorage.getItem("selectedLanguage") || "pt";
    
    const languageDropdown = document.getElementById("language-dropdown");

    if (languageDropdown) {
        languageDropdown.value = savedLang;
        
        // 🔹 Não traduzir automaticamente na carga da página, aguardar a escolha do idioma
        languageDropdown.addEventListener("change", function () {
            const selectedLang = this.value;
            localStorage.setItem("selectedLanguage", selectedLang);
            translatePage(selectedLang); // Chama a tradução após a seleção do idioma
        });
    }

    // 🔹 Traduzir somente após o usuário selecionar um idioma
    // Não aplica tradução automática aqui, a tradução ocorrerá após a escolha do idioma.
});
