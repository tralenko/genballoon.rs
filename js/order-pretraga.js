/* ==========================================
   ORDERS SEARCH
========================================== */


const searchInput = document.querySelector(".orders-search-box input");
const searchButton = document.querySelector(".orders-search-box button");

const ordersList = document.querySelector(".orders-list");
const emptyBlock = document.querySelector(".orders-empty");



/* ==========================================
   TEST ORDERS DATA

   позже заменим на Supabase
========================================== */


const orders = [

    {
        id:"#1048",
        phone:"+381601234567",
        date:"05.08.2026",
        status:"U pripremi",
        statusClass:"preparing",

        products:3,
        total:"8.450 RSD",

        address:"Bulevar Oslobođenja 25, Novi Sad",

        items:[

            {
                name:"Latex baloni 30 cm",
                quantity:"100",
                price:"2.500 RSD"
            },

            {
                name:"Helijum",
                quantity:"1",
                price:"4.000 RSD"
            },

            {
                name:"Traka za balone",
                quantity:"2",
                price:"1.950 RSD"
            }

        ]

    },


    {
        id:"#1042",
        phone:"+381601234567",
        date:"29.07.2026",
        status:"Isporučeno",
        statusClass:"delivered",

        products:5,
        total:"14.250 RSD",

        address:"Novi Sad",

        items:[

            {
                name:"Folija balon broj 5",
                quantity:"1",
                price:"3.500 RSD"
            },

            {
                name:"Dekoracija",
                quantity:"1",
                price:"10.750 RSD"
            }

        ]

    }

];



/* ==========================================
   SEARCH
========================================== */


searchButton.addEventListener("click", searchOrders);


searchInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        searchOrders();

    }

});



function searchOrders(){


    let phone = searchInput.value
        .replace(/\s/g,"");


    if(!phone){

        showEmpty();

        return;

    }



    const result = orders.filter(order => {


        return order.phone === phone;


    });



    if(result.length === 0){

        showEmpty();

        return;

    }



    emptyBlock.style.display="none";

    renderOrders(result);


}





/* ==========================================
   SHOW EMPTY
========================================== */


function showEmpty(){


    ordersList.innerHTML="";

    emptyBlock.style.display="block";


}





/* ==========================================
   RENDER ORDERS
========================================== */


function renderOrders(data){


    ordersList.innerHTML="";


    data.forEach(order=>{


        const card=document.createElement("article");


        card.className="order-card";


        card.innerHTML=`

        <div class="order-header">

            <div>

                <h3>
                    Porudžbina ${order.id}
                </h3>

                <span>
                    ${order.date}
                </span>

            </div>


            <div class="order-status ${order.statusClass}">

                ${order.status}

            </div>


        </div>



        <div class="order-summary">


            <div>

                <small>
                    Proizvoda
                </small>

                <strong>
                    ${order.products}
                </strong>

            </div>



            <div>

                <small>
                    Ukupno
                </small>

                <strong>
                    ${order.total}
                </strong>


            </div>


        </div>



        <button 
        class="details-button"
        data-id="${order.id}">

            Pogledaj detalje

        </button>


        `;



        ordersList.appendChild(card);


    });



    document
    .querySelectorAll(".details-button")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const order = data.find(
                item=>item.id === button.dataset.id
            );


            showDetails(order);


        });


    });



}





/* ==========================================
   DETAILS
========================================== */


function showDetails(order){


    const details=document.querySelector(".order-details");


    details.innerHTML=`

    <div class="details-header">


        <h2>
            Porudžbina ${order.id}
        </h2>


        <div class="order-status ${order.statusClass}">

            ${order.status}

        </div>


    </div>



    <div class="details-info">


        <div>

            <span>
                Datum
            </span>

            <strong>
                ${order.date}
            </strong>

        </div>



        <div>

            <span>
                Telefon
            </span>

            <strong>
                ${order.phone}
            </strong>

        </div>



        <div>

            <span>
                Adresa
            </span>

            <strong>
                ${order.address}
            </strong>

        </div>


    </div>



    <div class="products-title">

        <h3>
            Proizvodi
        </h3>

    </div>



    <div class="order-products">


        ${

        order.items.map(item=>`

            <div class="order-product">


                <div>

                    <h4>
                        ${item.name}
                    </h4>


                    <span>
                        Količina: ${item.quantity}
                    </span>


                </div>


                <strong>
                    ${item.price}
                </strong>


            </div>


        `).join("")

        }


    </div>



    <div class="details-total">


        <span>
            Ukupno
        </span>


        <strong>
            ${order.total}
        </strong>


    </div>


    `;



    details.scrollIntoView({

        behavior:"smooth",
        block:"start"

    });


}