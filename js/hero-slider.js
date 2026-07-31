document.addEventListener("DOMContentLoaded", () => {


    const slider = document.querySelector(".hero-slider");

    if (!slider) return;


    slider.style.visibility = "hidden";


    const slides = Array.from(
        slider.querySelectorAll(".hero-slide")
    );


    const dotsBox = document.querySelector(".hero-dots");


    if (!slides.length) return;



    /*
        создаём track
    */

    const track = document.createElement("div");

    track.className = "hero-track";


    slides.forEach(slide => {

        slide.style.display = "block";

        track.appendChild(slide);

    });


    slider.insertBefore(
        track,
        slider.firstChild
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




    function getMaxIndex(){


        return Math.max(
            0,
            slides.length - getVisibleCount()
        );


    }




    function updateSlider(){


        const visible = getVisibleCount();


        const slideWidth =
            slides[0].offsetWidth;


        const gap =
            parseInt(
                window.getComputedStyle(track).gap
            ) || 0;



        const move =
            current * (slideWidth + gap);



        track.style.transform =
            `translateX(-${move}px)`;


        updateDots();


    }





    function nextSlide(){


        current++;


        if(current > getMaxIndex()){


            current = 0;


        }


        updateSlider();


    }





    function prevSlide(){


        current--;


        if(current < 0){


            current = getMaxIndex();


        }


        updateSlider();


    }






    /*
        создаём точки
    */


    function createDots(){


        if(!dotsBox) return;


        dotsBox.innerHTML="";



        slides.forEach((slide,index)=>{


            const dot =
            document.createElement("div");


            dot.className="hero-dot";



            dot.onclick = ()=>{


                current = Math.min(
                    index,
                    getMaxIndex()
                );


                updateSlider();


            };



            dotsBox.appendChild(dot);


        });


    }





    function updateDots(){


        if(!dotsBox) return;


        const dots =
            dotsBox.querySelectorAll(".hero-dot");



        dots.forEach(dot=>{

            dot.classList.remove("active");

        });



        if(dots[current]){


            dots[current].classList.add("active");


        }


    }





    createDots();


    /*
       ждём размеры картинок
    */

    setTimeout(()=>{


        updateSlider();


        slider.style.visibility="visible";


    },50);




    /*
        авто листание
    */


    setInterval(()=>{


        nextSlide();


    },5000);





    /*
        resize
    */


    window.addEventListener("resize",()=>{


        if(current > getMaxIndex()){


            current = getMaxIndex();


        }


        updateSlider();


    });



});
