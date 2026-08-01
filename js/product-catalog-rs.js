(function () {

"use strict";


const PAGE_SIZE = 20;


let container;
let searchInput;
let paginationEl;
let toast;


let catalogCategory = null;

let searchQuery = "";
let currentPage = 1;
let totalItems = 0;

let searchDebounce;



document.addEventListener(
"DOMContentLoaded",
init
);





function init(){


    container =
    document.getElementById("products-container");


    searchInput =
    document.getElementById("product-search");


    paginationEl =
    document.querySelector(".catalog-pagination");


    toast =
    document.getElementById("cart-toast");



    // получаем категорию из HTML

    const catalogSection =
    document.querySelector(".catalog-section");


    catalogCategory =
    catalogSection.dataset.category;



    highlightActiveMenuButton();


    bindSearchInput();


    bindGridClicks();


    loadProducts();


}







// ============================
// ACTIVE MENU
// ============================


function highlightActiveMenuButton(){


    const currentPage =
    window.location.href.split("/").pop();



    document
    .querySelectorAll(".menu-button")
    .forEach(button=>{


        const onclick =
        button.getAttribute("onclick");



        if(
            onclick &&
            onclick.includes(currentPage)
        ){

            button.classList.add("active");

        }


    });


}







// ============================
// SKELETON
// ============================


function showSkeletons(count = PAGE_SIZE){


    container.innerHTML="";


    const fragment =
    document.createDocumentFragment();



    for(let i=0;i<count;i++){


        const card =
        document.createElement("div");


        card.className =
        "home-product-card skeleton-card";



        card.innerHTML=`

            <div class="skeleton-image"></div>

            <div class="skeleton-line"></div>

            <div class="skeleton-line short"></div>

            <div class="skeleton-button"></div>

        `;


        fragment.appendChild(card);


    }



    container.appendChild(fragment);


}









// ============================
// LOAD PRODUCTS
// ============================


async function loadProducts(){



    showSkeletons();




    let query =
    supabaseClient
    .from("products_rs")
    .select("*",{count:"exact"})

    .eq(
        "category",
        catalogCategory
    );






    if(searchQuery){


        query =
        query.ilike(
            "title_sr",
            `%${searchQuery}%`
        );


    }







    const from =
    (currentPage-1)*PAGE_SIZE;



    const to =
    from + PAGE_SIZE - 1;




    query =
    query.range(from,to);






    const {
        data,
        error,
        count

    } =
    await query;







    if(error){


        console.error(error);


        container.innerHTML=
        `
        <p class="catalog-empty">
        Greška pri učitavanju proizvoda
        </p>
        `;


        return;


    }







    totalItems =
    count || 0;



    container.innerHTML="";





    if(!data || data.length===0){


        container.innerHTML=
        `
        <p class="catalog-empty">
        Nema proizvoda
        </p>
        `;


        renderPagination();

        return;


    }







    const fragment =
    document.createDocumentFragment();





    data.forEach(
        (product,index)=>{


            fragment.appendChild(
                createProductCard(
                    product,
                    index
                )
            );


        }
    );





    container.appendChild(fragment);



    renderPagination();



}









// ============================
// PRODUCT CARD
// ============================


function createProductCard(product,index){



    const card =
    document.createElement("div");



    card.className =
    "home-product-card fade-in";



    card.style.animationDelay =
    `${index*70}ms`;



    card.dataset.id =
    product.id;





    card.innerHTML=`

    <div class="home-product-image">

        <img 
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


        <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none">


        <path 
        d="M6 6h15l-2 9H7L6 6Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>


        <path 
        d="M6 6L5 3H2"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"/>


        <circle 
        cx="9"
        cy="20"
        r="1.5"
        fill="white"/>


        <circle 
        cx="18"
        cy="20"
        r="1.5"
        fill="white"/>


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




    return card;


}









// ============================
// PAGINATION
// ============================


async function goToPage(page){



    const totalPages =
    Math.max(
        1,
        Math.ceil(
            totalItems/PAGE_SIZE
        )
    );



    currentPage =
    Math.min(
        Math.max(1,page),
        totalPages
    );



    await loadProducts();




    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


}







function renderPagination(){


    if(!paginationEl)
    return;



    paginationEl.innerHTML="";



    const totalPages =
    Math.ceil(
        totalItems/PAGE_SIZE
    );



    if(totalPages<=1)
    return;





    for(
        let i=1;
        i<=totalPages;
        i++
    ){


        const button =
        document.createElement("button");



        button.className =
        "page-btn";



        if(i===currentPage)
        button.classList.add("active");



        button.textContent=i;



        button.onclick=()=>{

            goToPage(i);

        };



        paginationEl.appendChild(button);


    }


}









// ============================
// SEARCH
// ============================


function bindSearchInput(){



    if(!searchInput)
    return;




    searchInput.addEventListener(
    "input",
    ()=>{


        searchQuery =
        searchInput.value.trim();



        currentPage=1;



        clearTimeout(
            searchDebounce
        );



        searchDebounce =
        setTimeout(
            loadProducts,
            300
        );


    });


}









// ============================
// CART
// ============================


function bindGridClicks(){



container.addEventListener(
"click",
e=>{


const btn =
e.target.closest(
".add-to-cart-btn"
);



if(btn){



addToCart({

id:btn.dataset.id,

title:btn.dataset.title,

price:btn.dataset.price,

image_url:btn.dataset.image

});



showCartToast();



return;

}




const card =
e.target.closest(
".home-product-card"
);



if(card){


window.location.href =
`product.html?id=${card.dataset.id}`;


}



});


}




function showCartToast(){


if(!toast)
return;



toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2500);


}



})();