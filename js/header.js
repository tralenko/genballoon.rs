document.addEventListener("DOMContentLoaded", function() {

  const burger = document.getElementById("burger");
  const header = document.querySelector("header");

  if(burger && header){

    burger.addEventListener("click", function() {

      header.classList.toggle("open");

      // состояние открытого меню
      document.body.classList.toggle("menu-open");

    });

  }


});


// ===============================
// MOBILE AUTO HIDE HEADER
// ===============================

const header = document.querySelector("header");

if (window.innerWidth <= 900 && header) {

    let lastScroll = 0;


    window.addEventListener("scroll", () => {


        // если меню открыто — header всегда виден
        if(document.body.classList.contains("menu-open")){

            header.classList.remove("header-hidden");

            return;

        }



        const currentScroll = window.pageYOffset;



        // верх страницы
        if (currentScroll <= 10) {

            header.classList.remove("header-hidden");

            lastScroll = currentScroll;

            return;

        }



        // скролл вниз
        if (currentScroll > lastScroll) {

            header.classList.add("header-hidden");

        }



        // скролл вверх
        else {

            header.classList.remove("header-hidden");

        }



        lastScroll = currentScroll;


    });

}
