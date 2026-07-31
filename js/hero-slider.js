document.addEventListener("DOMContentLoaded",()=>{


const slider = document.querySelector(".hero-slider");

if(!slider) return;


const slides = Array.from(
    slider.querySelectorAll(".hero-slide")
);


const prevBtn = slider.querySelector(".hero-prev");
const nextBtn = slider.querySelector(".hero-next");

const dotsBox = document.querySelector(".hero-dots");



/*
    создаём track автоматически
*/


const track = document.createElement("div");

track.className = "hero-track";



slides.forEach(slide=>{

    track.appendChild(slide);

});


slider.insertBefore(
    track,
    prevBtn
);



let current = 0;



function getVisibleCount(){

    if(window.innerWidth <= 900){

        return 1;

    }

    if(window.innerWidth <= 1200){

        return 2;

    }

    return 3;

}




function updateSlider(){


    const visible = getVisibleCount();


    const slideWidth =
    slides[0].getBoundingClientRect().width;


    const gap =
    parseInt(
        getComputedStyle(track).gap
    ) || 0;



    const offset =
    current * (slideWidth + gap);



    track.style.transform =
    `translateX(-${offset}px)`;


    updateDots();

}




function maxIndex(){

    return Math.max(
        0,
        slides.length - getVisibleCount()
    );

}




function nextSlide(){


    current++;


    if(current > maxIndex()){

        current = 0;

    }


    updateSlider();

}




function prevSlide(){


    current--;


    if(current < 0){

        current = maxIndex();

    }


    updateSlider();

}




if(nextBtn){

    nextBtn.onclick = nextSlide;

}


if(prevBtn){

    prevBtn.onclick = prevSlide;

}




/*
    точки
*/


function createDots(){


    if(!dotsBox) return;


    dotsBox.innerHTML="";


    slides.forEach((_,i)=>{


        const dot =
        document.createElement("div");


        dot.className="hero-dot";


        dot.onclick=()=>{


            current=i;


            if(current>maxIndex()){

                current=maxIndex();

            }


            updateSlider();


        };


        dotsBox.appendChild(dot);


    });


}




function updateDots(){


    if(!dotsBox) return;


    const dots =
    dotsBox.querySelectorAll(".hero-dot");


    dots.forEach(dot=>
        dot.classList.remove("active")
    );


    if(dots[current]){

        dots[current].classList.add("active");

    }


}



createDots();


updateSlider();




/*
    авто листание
*/


setInterval(()=>{

    nextSlide();

},5000);





window.addEventListener(
"resize",
()=>{


    if(current > maxIndex()){

        current=maxIndex();

    }


    updateSlider();


});



});
