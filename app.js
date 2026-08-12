/* =========================================================
   JANSETU APP - Main Application Engine
   Version 1.0
   ========================================================= */

(() => {
  "use strict";

  const SERVICE_FILE = "./services.json";

  let services = [];
  let currentLanguage = "en";

  /* ---------------------------------------------------------
     Language text
     --------------------------------------------------------- */

  const translations = {
    en: {
      searchPlaceholder:
        "Search jobs, schemes, scholarships, MSME, services...",
      noResults: "No matching services found.",
      resultsFor: "Results for",
      visit: "Visit Service",
      official: "Official",
      private: "Private",
      government: "Government",
      ask: "Ask",
      chatbotTitle: "Ask JanSetu",
      chatbotHint:
        "Tell me what you need and I will guide you to the appropriate service.",
      faqTitle: "Frequently Asked Questions",
      error:
        "JanSetu could not load the service database. Please try again."
    },

    hi: {
      searchPlaceholder:
        "नौकरी, सरकारी योजना, छात्रवृत्ति, MSME, सेवाएं खोजें...",
      noResults: "कोई संबंधित सेवा नहीं मिली।",
      resultsFor: "खोज परिणाम",
      visit: "सेवा खोलें",
      official: "आधिकारिक",
      private: "निजी",
      government: "सरकारी",
      ask: "पूछें",
      chatbotTitle: "JanSetu से पूछें",
      chatbotHint:
        "अपनी जरूरत बताएं और JanSetu आपको सही सेवा तक पहुंचने में मदद करेगा।",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      error:
        "JanSetu सेवा डेटाबेस लोड नहीं कर पाया। कृपया पुनः प्रयास करें।"
    },

    od: {
      searchPlaceholder:
        "ଚାକିରି, ସରକାରୀ ଯୋଜନା, ଛାତ୍ରବୃତ୍ତି, MSME, ସେବା ଖୋଜନ୍ତୁ...",
      noResults: "କୌଣସି ସମ୍ପର୍କିତ ସେବା ମିଳିଲା ନାହିଁ।",
      resultsFor: "ଖୋଜା ଫଳାଫଳ",
      visit: "ସେବା ଖୋଲନ୍ତୁ",
      official: "ଅଧିକାରିକ",
      private: "ବେସରକାରୀ",
      government: "ସରକାରୀ",
      ask: "ପଚାରନ୍ତୁ",
      chatbotTitle: "JanSetu କୁ ପଚାରନ୍ତୁ",
      chatbotHint:
        "ଆପଣଙ୍କ ଆବଶ୍ୟକତା କହନ୍ତୁ ଏବଂ JanSetu ଆପଣଙ୍କୁ ଉପଯୁକ୍ତ ସେବା ଦେଖାଇବ।",
      faqTitle: "ସାଧାରଣ ପ୍ରଶ୍ନ",
      error:
        "JanSetu ସେବା ତଥ୍ୟ ଲୋଡ୍ କରିପାରିଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
    }
  };

  /* ---------------------------------------------------------
     Load services.json
     --------------------------------------------------------- */

  async function loadServices() {
    try {
      const response = await fetch(
        SERVICE_FILE + "?v=" + Date.now(),
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Service database unavailable");
      }

      services = await response.json();

      if (!Array.isArray(services)) {
        throw new Error("Invalid service database");
      }

      console.log(
        "JanSetu: Loaded " + services.length + " services."
      );

      createSearchResultsArea();
      setupSearch();
      setupChatbot();
      setupQuickServices();
      setupLanguage();
      createFAQ();

    } catch (error) {
      console.error("JanSetu database error:", error);

      createSearchResultsArea();

      const results = document.getElementById(
        "janSetuResults"
      );

      if (results) {
        results.innerHTML =
          '<div class="js-error">' +
          translations.en.error +
          "</div>";
      }
    }
  }

  /* ---------------------------------------------------------
     Search
     --------------------------------------------------------- */

  function setupSearch() {
    const searchInput = findSearchInput();

    if (!searchInput) {
      console.warn("JanSetu: Search input not found.");
      return;
    }

    searchInput.addEventListener("input", function () {
      performSearch(this.value);
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        performSearch(this.value);
      }
    });
  }

  function findSearchInput() {
    return (
      document.querySelector("#searchInput") ||
      document.querySelector("#search") ||
      document.querySelector(
        'input[placeholder*="Search"]'
      ) ||
      document.querySelector(
        'input[placeholder*="search"]'
      )
    );
  }

  function performSearch(query) {
    const results = document.getElementById(
      "janSetuResults"
    );

    if (!results) return;

    query = String(query || "").trim().toLowerCase();

    if (!query) {
      results.innerHTML = "";
      return;
    }

    const words = query
      .split(/\s+/)
      .filter(Boolean);

    const matches = services
      .map(service => {
        const searchableText = [
          service.name,
          service.category,
          service.description,
          service.state,
          service.type,
          ...(service.keywords || []),
          ...(service.audience || [])
        ]
          .join(" ")
          .toLowerCase();

        let score = 0;

        words.forEach(word => {
          if (searchableText.includes(word)) {
            score += 1;
          }

          if (
            String(service.name || "")
              .toLowerCase()
              .includes(word)
          ) {
            score += 3;
          }

          if (
            (service.keywords || [])
              .join(" ")
              .toLowerCase()
              .includes(word)
          ) {
            score += 2;
          }
        });

        return {
          service,
          score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    renderResults(
      matches.map(item => item.service),
      query
    );
  }

  /* ---------------------------------------------------------
     Results area
     --------------------------------------------------------- */

  function createSearchResultsArea() {
    if (document.getElementById("janSetuResults")) {
      return;
    }

    const section = document.createElement("section");

    section.id = "janSetuResults";

    section.style.cssText = `
      max-width:1200px;
      margin:20px auto;
      padding:0 16px;
      box-sizing:border-box;
    `;

    const search = findSearchInput();

    if (search) {
      const parent =
        search.closest("section") ||
        search.parentElement;

      if (parent && parent.parentElement) {
        parent.parentElement.insertBefore(
          section,
          parent.nextSibling
        );
        return;
      }
    }

    document.body.appendChild(section);
  }

  function renderResults(list, query) {
    const results = document.getElementById(
      "janSetuResults"
    );

    if (!results) return;

    if (!list.length) {
      results.innerHTML = `
        <div class="js-no-results">
          <h3>🔎 ${translations[currentLanguage].noResults}</h3>
          <p>Try searching for:</p>
          <p>
            government job · scholarship · MSME · solar ·
            agriculture · business loan · education
          </p>
        </div>
      `;

      applyResultStyles();
      return;
    }

    results.innerHTML = `
      <h2 class="js-results-title">
        ${translations[currentLanguage].resultsFor}
        "${escapeHTML(query)}"
      </h2>

      <div class="js-results-grid">
        ${list.map(createServiceCard).join("")}
      </div>
    `;

    applyResultStyles();
  }

  function createServiceCard(service) {
    const type =
      String(service.type || "").toLowerCase();

    const badge =
      type === "government"
        ? translations[currentLanguage].government
        : translations[currentLanguage].private;

    const official =
      service.official === true
        ? `<span class="js-official">
             ✓ ${translations[currentLanguage].official}
           </span>`
        : "";

    return `
      <article class="js-service-card">

        <div class="js-service-top">
          <span class="js-category">
            ${escapeHTML(service.category || "Service")}
          </span>

          <span class="js-type">
            ${badge}
          </span>
        </div>

        <h3>
          ${escapeHTML(service.name || "JanSetu Service")}
        </h3>

        <p>
          ${escapeHTML(
            service.description ||
            "Information and access to this service."
          )}
        </p>

        <div class="js-meta">
          ${official}
          ${
            service.state
              ? `<span>📍 ${escapeHTML(
                  service.state
                )}</span>`
              : ""
          }
        </div>

        <a
          class="js-visit"
          href="${safeURL(service.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${translations[currentLanguage].visit} →
        </a>

      </article>
    `;
  }

  /* ---------------------------------------------------------
     Quick service buttons
     --------------------------------------------------------- */

  function setupQuickServices() {
    document.addEventListener("click", event => {
      const card = event.target.closest(
        "[data-category]"
      );

      if (!card) return;

      const category = card.dataset.category;

      if (!category) return;

      const search = findSearchInput();

      if (search) {
        search.value = category;
        performSearch(category);

        document
          .getElementById("janSetuResults")
          ?.scrollIntoView({
            behavior: "smooth"
          });
      }
    });
  }

  /* ---------------------------------------------------------
     Ask JanSetu chatbot
     --------------------------------------------------------- */

  function setupChatbot() {
    const input =
      document.querySelector("#chatInput") ||
      document.querySelector("#askInput") ||
      document.querySelector(
        'input[placeholder*="government job"]'
      ) ||
      document.querySelector(
        'input[placeholder*="need"]'
      );

    const button =
      document.querySelector("#askButton") ||
      document.querySelector("#askBtn") ||
      findButtonWithText("Ask");

    if (!input || !button) {
      console.warn(
        "JanSetu: chatbot controls not found."
      );
      return;
    }

    button.addEventListener("click", () => {
      askJanSetu(input.value);
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        askJanSetu(input.value);
      }
    });
  }

  function askJanSetu(question) {
    question = String(question || "").trim();

    if (!question) return;

    const q = question.toLowerCase();

    let category = "";

    if (
      /job|jobs|career|employment|naukri|vacancy|recruitment|ଚାକିରି|नौकरी/.test(q)
    ) {
      category = "jobs";
    } else if (
      /scholarship|student|education|college|school|छात्रवृत्ति|ଶିକ୍ଷା/.test(q)
    ) {
      category = "education";
    } else if (
      /msme|business|startup|enterprise|व्यवसाय|ବ୍ୟବସାୟ/.test(q)
    ) {
      category = "msme";
    } else if (
      /farmer|agriculture|kisan|crop|farm|किसान|କୃଷକ/.test(q)
    ) {
      category = "agriculture";
    } else if (
      /solar|rooftop|सोलर|ସୋଲାର/.test(q)
    ) {
      category = "solar";
    } else if (
      /scheme|yojana|government|सरकारी|योजना|ଯୋଜନା/.test(q)
    ) {
      category = "government";
    }

    if (category) {
      const results = services.filter(service => {
        const text = [
          service.category,
          service.description,
          service.name,
          ...(service.keywords || [])
        ]
          .join(" ")
          .toLowerCase();

        return (
          text.includes(category) ||
          text.includes(q)
        );
      });

      if (results.length) {
        renderResults(results.slice(0, 20), question);

        document
          .getElementById("janSetuResults")
          ?.scrollIntoView({
            behavior: "smooth"
          });

        return;
      }
    }

    performSearch(question);

    document
      .getElementById("janSetuResults")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  /* ---------------------------------------------------------
     FAQ
     --------------------------------------------------------- */

  function createFAQ() {
    if (document.getElementById("janSetuFAQ")) {
      return;
    }

    const faq = document.createElement("section");

    faq.id = "janSetuFAQ";

    faq.innerHTML = `
      <div class="js-faq-inner">

        <h2>❓ ${translations[currentLanguage].faqTitle}</h2>

        <details>
          <summary>What is JanSetu?</summary>
          <p>
            JanSetu is a citizen-focused gateway designed to
            help people discover government schemes, jobs,
            education opportunities, business support and
            useful online services.
          </p>
        </details>

        <details>
          <summary>Are government services free?</summary>
          <p>
            JanSetu does not charge citizens merely for
            discovering information. Some external services
            may have their own official fees.
          </p>
        </details>

        <details>
          <summary>Can I apply directly?</summary>
          <p>
            Where an official online application is available,
            JanSetu can direct you to the relevant official
            website.
          </p>
        </details>

        <details>
          <summary>Does JanSetu guarantee approval?</summary>
          <p>
            No. Eligibility, approval and processing are
            controlled by the relevant authority or service
            provider.
          </p>
        </details>

        <details>
          <summary>Can I search for private jobs?</summary>
          <p>
            Yes. JanSetu can provide links to legitimate
            recruitment platforms and employers where
            appropriate.
          </p>
        </details>

      </div>
    `;

    document.body.appendChild(faq);

    applyFAQStyles();
  }

  /* ---------------------------------------------------------
     Language
     --------------------------------------------------------- */

  function setupLanguage() {
    const selector =
      document.querySelector("#languageSelect") ||
      document.querySelector("select");

    if (!selector) return;

    selector.addEventListener("change", event => {
      currentLanguage =
        event.target.value || "en";

      updateLanguage();
    });
  }

  function updateLanguage() {
    const search = findSearchInput();

    if (search) {
      search.placeholder =
        translations[currentLanguage]
          .searchPlaceholder;
    }

    performSearch(search?.value || "");
  }

  /* ---------------------------------------------------------
     Utility functions
     --------------------------------------------------------- */

  function findButtonWithText(text) {
    const buttons =
      document.querySelectorAll("button");

    for (const button of buttons) {
      if (
        button.textContent
          .trim()
          .toLowerCase() === text.toLowerCase()
      ) {
        return button;
      }
    }

    return null;
  }

  function safeURL(url) {
    try {
      const parsed = new URL(url);

      if (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      ) {
        return escapeAttribute(parsed.href);
      }

      return "#";
    } catch {
      return "#";
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---------------------------------------------------------
     Basic styling
     --------------------------------------------------------- */

  function applyResultStyles() {
    if (document.getElementById("janSetuResultStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "janSetuResultStyles";

    style.textContent = `
      .js-results-title {
        margin:20px 0;
        font-size:24px;
      }

      .js-results-grid {
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(260px,1fr));
        gap:16px;
      }

      .js-service-card {
        background:#fff;
        border-radius:18px;
        padding:20px;
        box-shadow:0 5px 20px rgba(0,0,0,.08);
        border:1px solid #e5e7eb;
      }

      .js-service-card h3 {
        margin:12px 0 8px;
        font-size:20px;
      }

      .js-service-card p {
        color:#555;
        line-height:1.5;
      }

      .js-service-top {
        display:flex;
        justify-content:space-between;
        gap:8px;
        flex-wrap:wrap;
      }

      .js-category,
      .js-type,
      .js-official {
        display:inline-block;
        padding:5px 9px;
        border-radius:20px;
        font-size:12px;
        background:#eef4ff;
      }

      .js-meta {
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin:12px 0;
        font-size:13px;
      }

      .js-visit {
        display:block;
        text-align:center;
        padding:12px;
        border-radius:12px;
        background:#0757b8;
        color:#fff !important;
        text-decoration:none;
        font-weight:700;
      }

      .js-no-results,
      .js-error {
        background:#fff;
        padding:22px;
        border-radius:18px;
        margin:20px 0;
        box-shadow:0 5px 20px rgba(0,0,0,.06);
      }
    `;

    document.head.appendChild(style);
  }

  function applyFAQStyles() {
    if (document.getElementById("janSetuFAQStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "janSetuFAQStyles";

    style.textContent = `
      #janSetuFAQ {
        max-width:1000px;
        margin:40px auto;
        padding:0 16px 50px;
      }

      .js-faq-inner {
        background:#fff;
        padding:24px;
        border-radius:20px;
        box-shadow:0 5px 20px rgba(0,0,0,.06);
      }

      .js-faq-inner h2 {
        margin-top:0;
      }

      .js-faq-inner details {
        border-bottom:1px solid #ddd;
        padding:15px 0;
      }

      .js-faq-inner summary {
        cursor:pointer;
        font-weight:700;
      }

      .js-faq-inner p {
        line-height:1.6;
        color:#555;
      }
    `;

    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------
     Start
     --------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      loadServices
    );
  } else {
    loadServices();
  }

})();
