const apiKey = "4e4bfe98-e48a-4c0e-84f2-36ab6717b653:fx"; // ⚠️ Não compartilhe essa chave!
const url = "https://api-free.deepl.com/v2/translate";

// Função para traduzir um texto
async function translateText(text, targetLang) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `DeepL-Auth-Key ${apiKey}`
        },
        body: new URLSearchParams({
            "text": text,
            "target_lang": targetLang
        })
    });

    const data = await response.json();
    return data.translations[0].text;
}

// Função para traduzir toda a página
async function translatePage(lang) {
    const elementsToTranslate = document.querySelectorAll("[data-translate]");

    for (const element of elementsToTranslate) {
        const originalText = element.textContent;
        const translatedText = await translateText(originalText, lang);
        element.textContent = translatedText;
    }
}

// Adiciona eventos aos botões de troca de idioma
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-pt")?.addEventListener("click", () => translatePage("PT"));
    document.getElementById("btn-en")?.addEventListener("click", () => translatePage("EN"));
    document.getElementById("btn-es")?.addEventListener("click", () => translatePage("ES"));
});
