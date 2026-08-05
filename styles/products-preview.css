document.addEventListener("DOMContentLoaded", async () => {

    const rows = document.querySelectorAll(".home-products-row");

    if (!rows.length) return;

    function getProductsLimit() {

        const width = window.innerWidth;

        if (width <= 900) {
            return 2;
        }

        return Math.max(
            5,
            Math.floor((width * 0.93) / 202)
        );

    }

    const limit = getProductsLimit();

    // Загружаем все категории одновременно
    const requests = [...rows].map(row => {

        const category = row.dataset.category;

        return window.supabaseClient
            .from("products_rs")
            .select("*")
            .eq("active", true)
            .eq("category", category)
            .limit(limit);

    });

    const results = await Promise.all(requests);

    rows.forEach((row, index) => {

        const { data, error } = results[index];

        if (error) {
            console.error(error);
            return;
        }

        row.innerHTML = "";

        data.forEach(product => {

            const card = document.createElement("div");

            card.className = "home-product-card";

            card.dataset.id = product.id;

            card.innerHTML = `

            <div class="home-product-image">

                <img loading="lazy"
                     src="${product.image_url || "icons/no-image.png"}">

            </div>

            <div class="home-product-name">

                ${product.title_sr}

            </div>

            <button
                class="home-product-buy add-to-cart-btn"
                data-id="${product.id}"
                data-title="${product.title_sr}"
                data-price="${product.price}"
                data-image="${product.image_url || ""}">

                <svg xmlns="http://www.w3.org/2000/svg"
                     width="22"
                     height="22"
                     viewBox="0 0 24 24"
                     fill="none">

                    <path d="M6 6h15l-2 9H7L6 6Z"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"/>

                    <path d="M6 6L5 3H2"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"/>

                    <circle cx="9" cy="20" r="1.5" fill="white"/>
                    <circle cx="18" cy="20" r="1.5" fill="white"/>

                </svg>

            </button>

            <div class="home-product-price">

                <span class="price-number">

                    ${product.price}

                </span>

                <span class="price-currency">

                    din

                </span>

            </div>

            `;

            row.appendChild(card);

        });

        // Ссылка зависит от категории
        let catalogLink = "product-catalog.html";

        switch (row.dataset.category) {

            case "baloni":
                catalogLink = "product-catalog.html?category=baloni";
                break;

            case "pokloni":
                catalogLink = "product-catalog.html?category=pokloni";
                break;

            case "cvece":
                catalogLink = "product-catalog.html?category=cvece";
                break;

        }

        const more = document.createElement("a");

        more.href = catalogLink;

        more.className = "home-more-card";

        more.innerHTML = `

            <div class="home-more-icon">

                →

            </div>

            <div class="home-more-title">

                Pogledajte sve

            </div>

            <div class="home-more-text">

                Svi proizvodi iz kategorije

            </div>

        `;

        row.appendChild(more);

    });

});
