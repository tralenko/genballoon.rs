document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("burger").addEventListener("click", function() {
    document.querySelector("header").classList.toggle("open")
  })
})

// ===============================
// MOBILE AUTO HIDE HEADER
// ===============================

const header = document.querySelector("header");

if (window.innerWidth <= 900 && header) {

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

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
