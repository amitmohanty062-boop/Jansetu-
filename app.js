// ==========================================
// JanSetu App - Service Engine
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

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
