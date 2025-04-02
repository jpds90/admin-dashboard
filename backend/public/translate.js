const backendUrl = "https://backendsafor.onrender.com/traduzir"; // API do backend

async function translateText(text, targetLang) {
    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, targetLang })
        });

        if (!response.ok) {
            throw new Error(`Erro na tradução: ${response.statusText}`);
        }

        const data = await response.json();
        return data.translations[0].text;
    } catch (error) {
        console.error("Erro ao traduzir:", error);
        return text; // Retorna o texto original se houver erro
    }
}
