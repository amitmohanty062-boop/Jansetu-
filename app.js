// ==========================================
// JanSetu App - Service Engine
// ==========================================
// ==========================================
// JanSetu Multilingual System
// English | Hindi | Odia
// ==========================================

const translations = {
  en: {
    tagline: "Citizen & Opportunity Gateway",
    heroTitle: "Welcome to JanSetu App 🇮🇳",
    heroText:
      "One simple gateway to government schemes, jobs, education, business support, agriculture and essential online services across Bharat.",
    askTitle: "Ask JanSetu",
    askSubtitle:
      "Tell me what you need and I will guide you to the appropriate JanSetu service.",
    askPlaceholder: "Example: I need a government job...",
    askButton: "Ask",
    searchPlaceholder:
      "Search jobs, schemes, scholarships, MSME...",
    clear: "Clear",
    quickServices: "Quick Services",
    services: "JanSetu Services",
    noServices: "No services found.",
    openService:  →"${translations[currentLanguage].openService}
  },

  hi: {
    tagline: "नागरिक एवं अवसर द्वार",
    heroTitle: "जनसेतु ऐप में आपका स्वागत है 🇮🇳",
    heroText:
      "सरकारी योजनाओं, नौकरियों, शिक्षा, व्यवसाय सहायता, कृषि और आवश्यक ऑनलाइन सेवाओं के लिए भारत का एक सरल डिजिटल द्वार।",
    askTitle: "जनसेतु से पूछें",
    askSubtitle:
      "अपनी आवश्यकता बताएं और मैं आपको उचित जनसेतु सेवा तक पहुंचने में मार्गदर्शन करूंगा।",
    askPlaceholder: "उदाहरण: मुझे सरकारी नौकरी चाहिए...",
    askButton: "पूछें",
    searchPlaceholder:
      "नौकरी, योजनाएं, छात्रवृत्ति, MSME खोजें...",
    clear: "साफ करें",
    quickServices: "त्वरित सेवाएं",
    services: "जनसेतु सेवाएं",
    noServices: "कोई सेवा नहीं मिली।",
    openService: "सेवा खोलें →"
  },

  or: {
    tagline: "ନାଗରିକ ଓ ସୁଯୋଗ ଦ୍ୱାର",
    heroTitle: "ଜନସେତୁ ଆପ୍‌କୁ ସ୍ୱାଗତ 🇮🇳",
    heroText:
      "ସରକାରୀ ଯୋଜନା, ଚାକିରି, ଶିକ୍ଷା, ବ୍ୟବସାୟ ସହାୟତା, କୃଷି ଏବଂ ଆବଶ୍ୟକ ଅନଲାଇନ୍ ସେବା ପାଇଁ ଭାରତର ଏକ ସରଳ ଡିଜିଟାଲ୍ ଦ୍ୱାର।",
    askTitle: "ଜନସେତୁକୁ ପଚାରନ୍ତୁ",
    askSubtitle:
      "ଆପଣଙ୍କ ଆବଶ୍ୟକତା କୁହନ୍ତୁ ଏବଂ ମୁଁ ଆପଣଙ୍କୁ ଉପଯୁକ୍ତ ଜନସେତୁ ସେବା ପାଇବାରେ ସାହାଯ୍ୟ କରିବି।",
    askPlaceholder: "ଉଦାହରଣ: ମୋତେ ସରକାରୀ ଚାକିରି ଦରକାର...",
    askButton: "ପଚାରନ୍ତୁ",
    searchPlaceholder:
      "ଚାକିରି, ଯୋଜନା, ଛାତ୍ରବୃତ୍ତି, MSME ଖୋଜନ୍ତୁ...",
    clear: "ସଫା କରନ୍ତୁ",
    quickServices: "ତ୍ୱରିତ ସେବା",
    services: "ଜନସେତୁ ସେବା",
    noServices: "କୌଣସି ସେବା ମିଳିଲା ନାହିଁ।",
    openService: "ସେବା ଖୋଲନ୍ତୁ →"
  }
};

let currentLanguage = localStorage.getItem("jansetuLanguage") || "en";

function changeLanguage() {
  const selector = document.getElementById("languageSelector");

  if (selector) {
    currentLanguage = selector.value;
  }

  localStorage.setItem("jansetuLanguage", currentLanguage);

  applyLanguage();
}

function applyLanguage() {
  const t = translations[currentLanguage] || translations.en;

  const brandTagline = document.getElementById("brandTagline");
  const heroTitle = document.getElementById("heroTitle");
  const heroText = document.getElementById("heroText");
  const askTitle = document.getElementById("askTitle");
  const askSubtitle = document.getElementById("askSubtitle");
  const chatInput = document.getElementById("chatInput");
  const searchBox = document.getElementById("searchBox");
  const languageSelector = document.getElementById("languageSelector");

  if (brandTagline) brandTagline.textContent = t.tagline;
  if (heroTitle) heroTitle.textContent = t.heroTitle;
  if (heroText) heroText.textContent = t.heroText;
  if (askTitle) askTitle.textContent = t.askTitle;
  if (askSubtitle) askSubtitle.textContent = t.askSubtitle;

  if (chatInput) {
    chatInput.placeholder = t.askPlaceholder;
  }

  if (searchBox) {
    searchBox.placeholder = t.searchPlaceholder;
  }

  if (languageSelector) {
    languageSelector.value = currentLanguage;
  }

  document.documentElement.lang =
    currentLanguage === "hi"
      ? "hi"
      : currentLanguage === "or"
      ? "or"
      : "en";
}
applyLanguage();document.addEventListener("DOMContentLoaded", () => {applyLanguage();

    const searchInput =
        document.querySelector("#searchInput") ||
        document.querySelector("input[type='search']") ||
        document.querySelector("input");

    const serviceContainer =
        document.querySelector("#servicesContainer");

    // ------------------------------------------
    // Load Services
    // ------------------------------------------

    fetch("services.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load services.json");
            }
            return response.json();
        })
        .then(services => {

            console.log("JanSetu services loaded:", services.length);

            window.janSetuServices = services;

            createServiceSection(services);

            setupSearch(services);

        })
        .catch(error => {

            console.error("JanSetu Error:", error);

            if (serviceContainer) {
                serviceContainer.innerHTML = `
                    <div class="service-error">
                        <h3>⚠️ Services temporarily unavailable</h3>
                        <p>Please refresh the JanSetu App.</p>
                    </div>
                `;
            }
        });

    // ------------------------------------------
    // Create Service Section
    // ------------------------------------------

    function createServiceSection(services) {

        let container = serviceContainer;

        if (!container) {

            container = document.createElement("section");

            container.id = "servicesContainer";

            container.style.padding = "20px";

            document.body.appendChild(container);
        }

        container.innerHTML = `
            <h2 style="margin-bottom:15px;">
                🇮🇳 JanSetu Services
            </h2>

            <div id="serviceGrid"
                 style="
                 display:grid;
                 grid-template-columns:
                 repeat(auto-fit,minmax(240px,1fr));
                 gap:15px;
                 ">
            </div>
        `;

        renderServices(services);
    }

    // ------------------------------------------
    // Render Services
    // ------------------------------------------

    function renderServices(services) {

        const grid =
            document.querySelector("#serviceGrid");

        if (!grid) return;

        grid.innerHTML = "";

        if (services.length === 0) {

            grid.innerHTML = `
                <p>
                    No services found.
                </p>
            `;

            return;
        }

        services.forEach(service => {

            const card =
                document.createElement("div");

            card.style.cssText = `
                background:white;
                border-radius:16px;
                padding:18px;
                box-shadow:0 3px 12px rgba(0,0,0,0.08);
                border:1px solid #e5e7eb;
            `;

            const category =
                service.category || "Services";

            const name =
                service.name || "Online Service";

            const description =
                service.description ||
                "Access this service through JanSetu.";

            const url =
                service.url || "#";

            card.innerHTML = `

                <div style="font-size:28px;margin-bottom:8px;">
                    ${getIcon(category)}
                </div>

                <h3 style="
                    margin:0 0 8px 0;
                    font-size:18px;
                    ">
                    ${name}
                </h3>

                <div style="
                    font-size:13px;
                    color:#2563eb;
                    margin-bottom:8px;
                    ">
                    ${category.toUpperCase()}
                </div>

                <p style="
                    color:#64748b;
                    font-size:14px;
                    line-height:1.5;
                    ">
                    ${description}
                </p>

                <a href="${url}"
                   target="_blank"
                   rel="noopener noreferrer"
                   style="
                   display:block;
                   text-align:center;
                   background:#0757b8;
                   color:white;
                   text-decoration:none;
                   padding:11px;
                   border-radius:10px;
                   margin-top:12px;
                   font-weight:600;
                   ">
                   Open Service →
                </a>
            `;

            grid.appendChild(card);
        });
    }

    // ------------------------------------------
    // Search
    // ------------------------------------------

    function setupSearch(services) {

        if (!searchInput) return;

        searchInput.addEventListener("input", () => {

            const query =
                searchInput.value
                    .toLowerCase()
                    .trim();

            if (!query) {

                renderServices(services);

                return;
            }

            const results =
                services.filter(service => {

                    const text = [

                        service.name,

                        service.category,

                        service.description,

                        ...(service.keywords || []),

                        ...(service.audience || [])

                    ]
                    .join(" ")
                    .toLowerCase();

                    return text.includes(query);
                });

            renderServices(results);
        });
    }

    // ------------------------------------------
    // Service Icons
    // ------------------------------------------

    function getIcon(category) {

        const icons = {

            jobs: "💼",

            government: "🏛️",

            education: "🎓",

            scholarships: "📚",

            msme: "🏭",

            business: "🚀",

            agriculture: "🌾",

            finance: "💰",

            banking: "🏦",

            health: "🏥",

            transport: "🚗",

            documents: "📄",

            utility: "⚡",

            women: "👩",

            students: "🎓",

            farmers: "👨‍🌾",

            housing: "🏠",

            technology: "💻",

            legal: "⚖️",

            services: "🔗"
        };

        return icons[category] || "🔗";
    }

});
