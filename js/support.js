document.querySelectorAll(".accordion-button")
.forEach(button => {


button.addEventListener("click",()=>{


const content = button.nextElementSibling;

const icon = button.querySelector("span");


content.classList.toggle("active");


if(content.classList.contains("active")){

icon.textContent="-";

}else{

icon.textContent="+";

}


});


});