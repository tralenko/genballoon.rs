document.addEventListener("DOMContentLoaded", async () => {

    const productId = new URLSearchParams(window.location.search).get("id");

    if (!productId) {
        console.error("Нет ID товара");
        return;
    }


    const {
        data: product,
        error
    } = await window.supabaseClient
        .from("products_rs")
        .select("*")
        .eq("id", productId)
        .single();



    if (error) {

        console.error("Ошибка загрузки:", error);

        document.getElementById("product-title").textContent =
            "Proizvod nije pronađen";

        return;
    }



    console.log("PRODUCT:", product);



    // TITLE

    document.getElementById("product-title").textContent =
        product.title_sr;



    // DESCRIPTION

    document.getElementById("product-desc").innerHTML =
        `
        <p>${product.description_sr || ""}</p>
        `;



    // PRICE

    document.getElementById("product-price").innerHTML =
        `
        ${product.price} din
        `;


    const mobilePrice =
        document.getElementById("mobile-cta-price");

    if(mobilePrice){

        mobilePrice.textContent =
            product.price + " din";

    }



    // BREADCRUMB

    const breadcrumb =
        document.getElementById("breadcrumb-title");

    if(breadcrumb){

        breadcrumb.textContent =
            product.title_sr;

    }




    // GALLERY

    const images = [
        product.image_url,
        product.image_url_2,
        product.image_url_3,
        product.image_url_4
    ]
    .filter(Boolean);



    const gallery =
        document.getElementById("gallery-track");


    const dots =
        document.getElementById("gallery-dots");


    const thumbs =
        document.getElementById("gallery-thumbs");



    if(images.length === 0){

        gallery.innerHTML =
        `
        <div class="gallery-slide placeholder">
            Nema slike
        </div>
        `;

        return;
    }




    images.forEach((img,index)=>{


        gallery.innerHTML +=
        `
        <div class="gallery-slide">

            <img 
            src="${img}"
            alt="${product.title_sr}">

        </div>
        `;



        dots.innerHTML +=
        `
        <span class="dot ${index===0 ? "active":""}">
        </span>
        `;



        thumbs.innerHTML +=
        `
        <div class="thumb ${index===0 ? "active":""}">
            <img src="${img}">
        </div>
        `;



    });



});
