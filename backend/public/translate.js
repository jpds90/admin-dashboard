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

function applyTranslation(lang) {
    console.log("🔄 Aplicando tradução para:", lang);

    const translations = {
        en: {
            "Início": "Home",
            "Notícias": "News",
            "Agenda": "Schedule",
            "Loja": "Shop",
            "Clube": "Club",
            "Carregando banners...": "Loading banners...",
            "Últimas Notícias": "Latest News",
            "Carregando notícias...": "Loading news...",
            "Nenhuma notícia disponível.": "No news available.",
            "Nenhum banner disponível.": "No banner available.",
            "Leia mais": "Read more",
            "Todos os direitos reservados.": "All rights reserved."
        },
        es: {
            "Início": "Inicio",
            "Notícias": "Noticias",
            "Agenda": "Agenda",
            "Loja": "Tienda",
            "Clube": "Club",
            "Carregando banners...": "Cargando banners...",
            "Últimas Notícias": "Últimas Noticias",
            "Carregando notícias...": "Cargando noticias...",
            "Nenhuma notícia disponível.": "No hay noticias disponibles.",
            "Nenhum banner disponível.": "No hay banners disponibles.",
            "Leia mais": "Leer más",
            "Todos os direitos reservados.": "Todos los derechos reservados."
        },
        fr: {
            "Início": "Accueil",
            "Notícias": "Actualités",
            "Agenda": "Agenda",
            "Loja": "Boutique",
            "Clube": "Club",
            "Carregando banners...": "Chargement des bannières...",
            "Últimas Notícias": "Dernières nouvelles",
            "Carregando notícias...": "Chargement des actualités...",
            "Nenhuma notícia disponível.": "Aucune nouvelle disponible.",
            "Nenhum banner disponível.": "Aucune bannière disponible.",
            "Leia mais": "Lire la suite",
            "Todos os direitos reservados.": "Tous droits réservés."
        },
        de: {
            "Início": "Startseite",
            "Notícias": "Nachrichten",
            "Agenda": "Agenda",
            "Loja": "Shop",
            "Clube": "Verein",
            "Carregando banners...": "Lade Banner...",
            "Últimas Notícias": "Neueste Nachrichten",
            "Carregando notícias...": "Lade Nachrichten...",
            "Nenhuma notícia disponível.": "Keine Nachrichten verfügbar.",
            "Nenhum banner disponível.": "Kein Banner verfügbar.",
            "Leia mais": "Mehr lesen",
            "Todos os direitos reservados.": "Alle Rechte vorbehalten."
        }
    };

    document.querySelectorAll("[data-translate]").forEach(element => {
        const text = element.innerText.trim();
        if (translations[lang] && translations[lang][text]) {
            element.innerText = translations[lang][text];
        }
    });

    console.log("✅ Tradução aplicada com sucesso!");
}

document.addEventListener("DOMContentLoaded", function () {
    const languageDropdown = document.getElementById("language-dropdown");

    // 🔹 Pega o idioma salvo no localStorage
    const savedLang = localStorage.getItem("selectedLanguage") || "pt";

    // 🔹 Se não for "pt" (padrão), aplica a tradução automaticamente
    if (savedLang !== "pt") {
        applyTranslation(savedLang);
    }

    if (languageDropdown) {
        languageDropdown.value = savedLang;

        // 🔹 Quando o usuário muda o idioma, salva e aplica a tradução
        languageDropdown.addEventListener("change", function () {
            const selectedLang = this.value;
            localStorage.setItem("selectedLanguage", selectedLang);
            applyTranslation(selectedLang);
        });
    }
});
