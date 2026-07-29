console.log("home-products.js loaded");

const db = window.supabaseClient;

async function loadCourses() {
  const container = document.getElementById("featured-courses");

  if (!container) return;

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("type", "course")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Courses error:", error);
    return;
  }

  if (!data || !data.length) {
    container.innerHTML = "<p>No courses found.</p>";
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="course-card">
      <div class="course-thumbnail">
        <img
          class="thumbnail"
          src="${item.image_url || ''}"
          alt="${item.title}">
      </div>

      <div class="course-name-box">
        <p class="course-name">${item.title}</p>
      </div>

      <div class="price-box">
        <div class="price-ammount-box">
          <p>${item.price} din</p>
        </div>
      </div>

      <div class="course-description">
        <div class="description-text">
          <p>${item.description || ''}</p>
        </div>
      </div>

      <div class="start-course">
        <button
          class="start-button"
          onclick="window.location.href='product-page.html?id=${item.id}'">
          VIEW COURSE
        </button>
      </div>
    </div>
  `).join("");
}

async function loadFiles() {
  const container = document.getElementById("featured-files");

  if (!container) return;

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("type", "file")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Files error:", error);
    return;
  }

  if (!data || !data.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="product-card">

      <div class="product-thumbnail">
        <img
          class="p-thumbnail"
          src="${item.image_url || ''}"
          alt="${item.title}">
      </div>

      <div class="product-name-box">
        <p class="product-name">${item.title}</p>
      </div>
      
      <a
        class="p-buy-link"
        href="product-page.html?id=${item.id}">
        VIEW
      </a>

      <div class="p-price-box">
        <div class="p-price-ammount-box">
          <p>$${item.price}</p>
        </div>
      </div>

    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!db) {
    console.error("Supabase client not found");
    return;
  }

  await loadCourses();
  await loadFiles();
});
