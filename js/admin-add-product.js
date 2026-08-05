// ===============================
// CATEGORY SWITCH
// ===============================


const categoryButtons = document.querySelectorAll(".category-btn");
const subcategoryBox = document.getElementById("subcategoryBox");



categoryButtons.forEach(button => {


    button.addEventListener("click", () => {


        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );


        button.classList.add("active");


        const category = button.dataset.category;



        if(category === "baloni"){

            subcategoryBox.style.display="block";

        }else{


            subcategoryBox.style.display="none";


            document
            .querySelectorAll(".subcategory-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );


        }


    });


});




// ===============================
// SUBCATEGORY SWITCH
// ===============================


const subcategoryButtons =
document.querySelectorAll(".subcategory-btn");



subcategoryButtons.forEach(button => {


    button.addEventListener("click",()=>{


        subcategoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );


        button.classList.add("active");


    });


});





// ===============================
// IMAGES
// ===============================


const imageInput =
document.getElementById("productImages");


const imagePreview =
document.getElementById("imagePreview");


const uploadArea =
document.getElementById("uploadArea");



let selectedImages=[];




function createPreview(src){


    const box=document.createElement("div");

    box.className="preview-item";


    box.innerHTML=`

        <img src="${src}">

    `;


    imagePreview.appendChild(box);


}







// FILE UPLOAD


imageInput.addEventListener("change",function(){


    const files=
    Array.from(this.files);



    addFiles(files);


});





function addFiles(files){


    files.forEach(file=>{


        if(!file.type.startsWith("image/")){
            return;
        }



        selectedImages.push({

            type:"file",

            value:file

        });



        const reader=new FileReader();



        reader.onload=e=>{


            createPreview(e.target.result);


        };



        reader.readAsDataURL(file);



    });


}






// DRAG DROP


uploadArea.addEventListener(
"dragover",
e=>{


    e.preventDefault();

    uploadArea.style.borderColor="#1877f2";


});




uploadArea.addEventListener(
"dragleave",
()=>{


    uploadArea.style.borderColor="#d2d2d2";


});





uploadArea.addEventListener(
"drop",
e=>{


    e.preventDefault();


    uploadArea.style.borderColor="#d2d2d2";


    addFiles(
        Array.from(e.dataTransfer.files)
    );


});







// ===============================
// IMAGE URL
// ===============================



const imageUrlInput =
document.getElementById("imageUrl");


const addImageUrl =
document.getElementById("addImageUrl");




if(addImageUrl){


addImageUrl.addEventListener(
"click",
()=>{


    const url =
    imageUrlInput.value.trim();



    if(!url){
        return;
    }



    selectedImages.push({

        type:"url",

        value:url

    });



    createPreview(url);



    imageUrlInput.value="";



});


}







// ===============================
// GET DATA
// ===============================



function getProductData(){



    const category =
    document.querySelector(".category-btn.active")
    ?.dataset.category;



    const subcategory =
    document.querySelector(".subcategory-btn.active")
    ?.textContent || null;



    const inputs =
    document.querySelectorAll(".form-group input");



    const textareas =
    document.querySelectorAll(".form-group textarea");




    return{


        slug:inputs[5].value,


        title_sr:inputs[0].value,


        title_ru:inputs[1].value,



        description_sr:textareas[0].value,


        description_ru:textareas[1].value,



        category,


        subcategory,



        price:Number(inputs[2].value),


        old_price:
        Number(inputs[3].value) || null,



        stock:
        Number(inputs[4].value) || 0,



        images:selectedImages



    };


}







// ===============================
// SAVE PRODUCT
// ===============================



// ===============================
// CLEAR FORM
// ===============================

function clearForm(){

    // Очистить текстовые поля
    document.querySelectorAll(".form-group input").forEach(input=>{

        if(input.type==="number"){

            input.value="0";

        }else{

            input.value="";

        }

    });

    // Очистить textarea
    document.querySelectorAll(".form-group textarea")
    .forEach(textarea=>{

        textarea.value="";

    });

    // Очистить URL изображения
    imageUrlInput.value="";

    // Очистить file input
    imageInput.value="";

    // Очистить массив изображений
    selectedImages=[];

    // Очистить превью
    imagePreview.innerHTML="";

    // Вернуть категорию по умолчанию
    categoryButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    document
    .querySelector('[data-category="baloni"]')
    .classList.add("active");

    // Показать подкатегории
    subcategoryBox.style.display="block";

    // Вернуть первую подкатегорию
    subcategoryButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    subcategoryButtons[0].classList.add("active");

    // Чекбоксы
    const switches=document.querySelectorAll(".switches input");

    switches[0].checked=true;
    switches[1].checked=false;

}



// ===============================
// SAVE PRODUCT
// ===============================

const saveBtn =
document.querySelector(".save-btn");

saveBtn.addEventListener(
"click",
async()=>{

    saveBtn.disabled=true;
    saveBtn.textContent="Čuvanje...";

    try{

        const data=getProductData();

        let imageUrls=[];

        // Upload изображений
        for(const image of data.images){

            if(image.type==="url"){

                imageUrls.push(image.value);

            }

            if(image.type==="file"){

                const fileName=
                Date.now()+"_"+image.value.name;

                const {error}=await supabaseClient
                .storage
                .from("products")
                .upload(fileName,image.value);

                if(error) throw error;

                const publicUrl=
                supabaseClient
                .storage
                .from("products")
                .getPublicUrl(fileName)
                .data
                .publicUrl;

                imageUrls.push(publicUrl);

            }

        }

        imageUrls=imageUrls.slice(0,4);

        const product={

            slug:data.slug,

            title_sr:data.title_sr,
            title_ru:data.title_ru,

            description_sr:data.description_sr,
            description_ru:data.description_ru,

            category:data.category,
            subcategory:data.subcategory,

            price:data.price,
            old_price:data.old_price,

            image_url:imageUrls[0]||null,
            image_url_2:imageUrls[1]||null,
            image_url_3:imageUrls[2]||null,
            image_url_4:imageUrls[3]||null,

            stock:data.stock,

            active:
            document.querySelectorAll(".switches input")[0].checked,

            featured:
            document.querySelectorAll(".switches input")[1].checked

        };

        const {error}=await supabaseClient
        .from("products_rs")
        .insert(product);

        if(error) throw error;

        alert("Proizvod uspešno dodat!");

        // Очищаем форму вместо перехода
        clearForm();

    }
    catch(error){

        console.error(error);

        alert("Greška: "+error.message);

    }

    saveBtn.disabled=false;
    saveBtn.textContent="Sačuvaj proizvod";

});

console.log("Admin product page ready");
