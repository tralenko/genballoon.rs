document.addEventListener("DOMContentLoaded",()=>{


const cart = getCart();


const summary=document.getElementById("order-summary");


if(cart.length===0){

summary.innerHTML=
`
<p>
Korpa je prazna
</p>
`;

return;

}



let total=0;


summary.innerHTML=
`

<div class="order-summary">

${cart.map(item=>{


total+=Number(item.price);


return `

<div class="order-item">

<span>
${item.title}
</span>

<span>
${item.price} din
</span>

</div>

`

}).join("")}



<hr>


<div class="order-item">

<strong>
Ukupno
</strong>

<strong>
${total} din
</strong>


</div>


</div>

`;





document
.getElementById("order-form")
.addEventListener("submit",(e)=>{


e.preventDefault();



const randomNumber =
Math.floor(100000 + Math.random()*900000);



const orderNumber =
"GB-"+randomNumber;



document
.getElementById("order-number")
.innerHTML=
`

Broj vaše porudžbine:

<strong>${orderNumber}</strong>

`;



document
.getElementById("successModal")
.classList.add("show");



saveCart([]);



});



});