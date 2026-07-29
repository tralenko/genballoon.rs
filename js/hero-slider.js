const slides = document.querySelectorAll(".hero-slide");
const dotsBox = document.querySelector(".hero-dots");

let current = 0;

slides.forEach((_,i)=>{

    const dot=document.createElement("div");

    dot.className="hero-dot";

    if(i===0) dot.classList.add("active");

    dot.onclick=()=>showSlide(i);

    dotsBox.appendChild(dot);

});

const dots=document.querySelectorAll(".hero-dot");

function showSlide(index){

    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current=index;

    slides[current].classList.add("active");
    dots[current].classList.add("active");

}

function nextSlide(){

    showSlide((current+1)%slides.length);

}

document.querySelector(".hero-next").onclick=nextSlide;

document.querySelector(".hero-prev").onclick=()=>{

    showSlide((current-1+slides.length)%slides.length);

};

setInterval(nextSlide,5000);
