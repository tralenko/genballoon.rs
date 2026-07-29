document.addEventListener("DOMContentLoaded", async () => {

    const row = document.getElementById("home-products-row");

    if (!row) return;

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("type", "file")
        .limit(5);

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
                <img src="${product.image_url || ""}" alt="${product.title}">
            </div>

            <div class="home-product-name">
                ${product.title}
            </div>

            <button
                class="home-product-buy add-to-cart-btn"
                data-id="${product.id}"
                data-title="${product.title}"
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

    // Карточка "Посмотреть все"

    const more = document.createElement("a");

    more.href = "product-catalog.html";

    more.className = "home-more-card";

    more.innerHTML = `
        <div class="home-more-icon">→</div>

        <div class="home-more-title">
            View all
        </div>

        <div class="home-more-text">
            Browse the complete digital goods catalog
        </div>
    `;

    row.appendChild(more);



    // Делегирование кликов

    row.addEventListener("click", e => {

        const buyBtn = e.target.closest(".add-to-cart-btn");

        if (buyBtn) {

            addToCart({
                id: buyBtn.dataset.id,
                title: buyBtn.dataset.title,
                price: buyBtn.dataset.price,
                image_url: buyBtn.dataset.image
            });

            if (typeof showCartToast === "function") {
                showCartToast();
            }

            return;
        }

        const card = e.target.closest(".home-product-card");

        if (!card) return;

        window.location.href = `product.html?id=${card.dataset.id}`;

    });

});
