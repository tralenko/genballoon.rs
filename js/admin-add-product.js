// ===============================
// CATEGORY SWITCH
// ===============================


const categoryButtons = document.querySelectorAll(".category-btn");
const subcategoryBox = document.getElementById("subcategoryBox");



categoryButtons.forEach(button => {


    button.addEventListener("click", () => {


        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");



        const category = button.dataset.category;



        if(category === "baloni"){

            subcategoryBox.style.display = "block";

        }else{


            subcategoryBox.style.display = "none";


            document
            .querySelectorAll(".subcategory-btn")
            .forEach(btn => {

                btn.classList.remove("active");

            });


        }


    });


});





// ===============================
// SUBCATEGORY SWITCH
// ===============================


const subcategoryButtons = document.querySelectorAll(".subcategory-btn");



subcategoryButtons.forEach(button => {


    button.addEventListener("click", () => {


        subcategoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


    });


});






// ===============================
// IMAGE UPLOAD PREVIEW
// ===============================


const imageInput = document.getElementById("productImages");

const imagePreview = document.getElementById("imagePreview");



let selectedImages = [];




imageInput.addEventListener("change", function(){


    const files = Array.from(this.files);



    files.forEach(file => {


        if(!file.type.startsWith("image/")){

            return;

        }



        selectedImages.push(file);



        const reader = new FileReader();



        reader.onload = function(e){


            const imageBox = document.createElement("div");

            imageBox.className = "preview-item";



            imageBox.innerHTML = `

                <img src="${e.target.result}">

            `;



            imagePreview.appendChild(imageBox);



        }



        reader.readAsDataURL(file);



    });



});






// ===============================
// CLICK AREA SUPPORT
// ===============================


const uploadArea = document.getElementById("uploadArea");


uploadArea.addEventListener("dragover", e => {

    e.preventDefault();

    uploadArea.style.borderColor="#1877f2";

});



uploadArea.addEventListener("dragleave", ()=>{

    uploadArea.style.borderColor="#d2d2d2";

});



uploadArea.addEventListener("drop", e=>{


    e.preventDefault();


    const files = Array.from(e.dataTransfer.files);



    files.forEach(file=>{


        if(file.type.startsWith("image/")){


            selectedImages.push(file);



            const reader = new FileReader();


            reader.onload=function(event){


                const img=document.createElement("img");


                img.src=event.target.result;


                imagePreview.appendChild(img);


            }



            reader.readAsDataURL(file);



        }


    });


});






// ===============================
// PRODUCT DATA PREVIEW
// ===============================


function getProductData(){


    const category =
    document.querySelector(".category-btn.active")
    ?.dataset.category;



    const subcategory =
    document.querySelector(".subcategory-btn.active")
    ?.textContent;



    return {

        category,

        subcategory,

        images:selectedImages

    };


}



// тест в консоли
console.log("Admin product page ready");
