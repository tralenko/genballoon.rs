const SUPABASE_URL = "https://dnfzmmytdonyrrzdxnzb.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoiZG5mem1teXRkb255cnJ6ZHh6bmIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4MDI4MTc1NSwiZXhwIjoyMDk1ODU3NzU1fQ.HlCNlOancnoiEknx81YN5_ALTsdmTY6mwn9P3RxnkiY";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);



const state = {

    userId:null,

    userName:"Friend",

    courses:[],

    lessons:[],

    certificates:[],

    products:[]

};



// ===============================
// ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
// ===============================


async function loadUserProfile(){


    const {
        data:{
            session
        }
    } = await supabaseClient.auth.getSession();



    if(!session){

        window.location.href="auth.html";

        return null;

    }



    const user = session.user;


    state.userId = user.id;



    const {
        data:profile,
        error
    } = await supabaseClient

        .from("profiles")

        .select("name,email")

        .eq("id",user.id)

        .maybeSingle();



    if(error){

        console.error(
            "Profile error:",
            error
        );

    }



    let name="Friend";



    if(profile?.name){

        name = profile.name;

    }

    else if(profile?.email){

        name = profile.email.split("@")[0];

    }

    else if(user.email){

        name = user.email.split("@")[0];

    }



    state.userName=name;



    document.getElementById(
        "greetingTitle"
    ).textContent =
        `Hello, ${name} 👋`;



    return user.id;

}



// ===============================
// СТАТИСТИКА
// ===============================

function renderStats(){


    document.getElementById(
        "greetingTitle"
    ).textContent =
        `Hello, ${state.userName} 👋`;



    document.getElementById(
        "statCoursesTotal"
    ).textContent =
        state.courses.length;



    document.getElementById(
        "statLessonsTotal"
    ).textContent =
        state.lessons.length;



    document.getElementById(
        "statProductsTotal"
    ).textContent =
        state.products.length;



    document.getElementById(
        "statCertificates"
    ).textContent =
        state.certificates.filter(
            c=>c.status==="issued"
        ).length;


}






// ===============================
// ЗАПУСК
// ===============================

async function init(){


    const userId = await loadUserProfile();


    if(!userId) return;



    state.courses =
        await loadCourses(userId);



    state.lessons =
        await loadLessons(userId);



    state.certificates =
        await loadCertificates(userId);



    state.products =
        await loadProducts(userId);




    renderStats();


    renderCourses();


    renderLessons();


    renderCertificates();


    renderProducts();


}




document.addEventListener(
    "DOMContentLoaded",
    init
);

const CONFIG = {

    LEARNING_PAGE_URL:"learning.html"

};

/* ===========================================================
   МОК-ДАННЫЕ (демо-режим)
=========================================================== */

const MOCK_USER = { id: 'demo-user', name: 'Анна' };

const MOCK_COURSES = [
    { id: 'demo-course', title: 'Дизайн интерфейсов с нуля до PRO', cover_url: '', total_lessons: 7, completed_lessons: 3 },
    { id: 'course-2', title: 'Маркетинг для творческих специалистов', cover_url: '', total_lessons: 10, completed_lessons: 10 },
    { id: 'course-3', title: 'Съёмка и монтаж на телефон', cover_url: '', total_lessons: 8, completed_lessons: 0 }
];

// отдельно купленные одиночные уроки — тот же принцип, что и курс,
// только total_lessons всегда 1 (открываются на learning.html как мини-курс)
const MOCK_LESSONS = [
    { id: 'lesson-1', title: 'Как настроить свет для съёмки на телефон', cover_url: '', total_lessons: 1, completed_lessons: 1 },
    { id: 'lesson-2', title: 'Быстрый ретушь портрета в Lightroom', cover_url: '', total_lessons: 1, completed_lessons: 0 }
];

const MOCK_CERTIFICATES = [
    {
        id: 'cert-1', course_id: 'course-2', course_title: 'Маркетинг для творческих специалистов',
        certificate_number: 'CERT-2026-0042', status: 'issued',
        issued_at: '2026-06-14', pdf_url: 'https://example.com/certificate-demo.pdf'
    }
];

const MOCK_PRODUCTS = [
    {
        id: 'prod-1', title: 'Набор пресетов для обработки фото', description: 'Более 40 профессиональных пресетов для Lightroom и Camera Raw под разные стили съёмки.',
        cover_url: '', icon: '🎨',
        files: [
            { name: 'Presets-pack-vol1.zip', url: 'https://example.com/files/presets-1.zip', size: 18_400_000 },
            { name: 'Инструкция по установке.pdf', url: 'https://example.com/files/instructions.pdf', size: 820_000 }
        ]
    },
    {
        id: 'prod-2', title: 'Шаблоны сторис для Instagram', description: '20 редактируемых шаблонов в Figma для сторис и постов.',
        cover_url: '', icon: '📱',
        files: [
            { name: 'Templates.fig', url: 'https://example.com/files/templates.fig', size: 6_200_000 },
            { name: 'Шрифты.zip', url: 'https://example.com/files/fonts.zip', size: 3_100_000 },
            { name: 'Гайд по использованию.pdf', url: 'https://example.com/files/guide.pdf', size: 540_000 }
        ]
    }
];

/* Раздел «Почта» из кабинета убран по решению пользователя —
   если понадобится вернуть, структура MOCK_MAIL/loadMailThreads
   из предыдущей версии файла легко восстанавливается. */

/* ===========================================================
   СОСТОЯНИЕ
=========================== */

/* ===========================================================
   ЗАГРУЗКА ДАННЫХ
=========================== */

async function loadPurchasedItems(userId, kind){

    const { data: enrollments, error } = await supabaseClient
        .from('user_course_progress')
        .select('course_id, courses!inner(id, title, cover_url, kind)')
        .eq('user_id', userId)
        .eq('courses.kind', kind);


    if(error){

        console.error(
            "LOAD PURCHASED ITEMS ERROR:",
            error
        );

        return [];

    }



    const result = [];


    for(const enrollment of enrollments){


        const courseId = enrollment.course_id;



        const { count:totalLessons } = await supabaseClient
            .from('lessons')
            .select('id',{count:'exact',head:true})
            .eq('course_id',courseId);



        const { count:completedLessons } = await supabaseClient
            .from('lesson_progress')
            .select('id',{count:'exact',head:true})
            .eq('user_id',userId)
            .eq('course_id',courseId)
            .eq('completed',true);



        result.push({

            id:courseId,

            title:enrollment.courses.title,

            cover_url:enrollment.courses.cover_url,

            total_lessons:totalLessons || 0,

            completed_lessons:completedLessons || 0

        });


    }


    return result;

}

async function loadCourses(userId){
    return loadPurchasedItems(userId, 'course');
}

async function loadLessons(userId){
    return loadPurchasedItems(userId, 'lesson');
}

async function loadCertificates(userId){
    if (CONFIG.USE_SUPABASE && supabase) {
        const { data, error } = await supabase
            .from('certificates').select('id, course_id, certificate_number, status, issued_at, pdf_url, courses(title)')
            .eq('user_id', userId);
        if (error) { console.error(error); return []; }

        return data.map(row => ({
            id: row.id, course_id: row.course_id, course_title: row.courses?.title || '',
            certificate_number: row.certificate_number, status: row.status,
            issued_at: row.issued_at, pdf_url: row.pdf_url
        }));
    }

    const raw = localStorage.getItem(`certificates:${userId}`);
    return raw ? JSON.parse(raw) : MOCK_CERTIFICATES;
}

async function requestCertificate(userId, course){
    const newCert = {
        id: `cert-pending-${course.id}`, course_id: course.id, course_title: course.title,
        certificate_number: null, status: 'pending', issued_at: null, pdf_url: null
    };

    if (CONFIG.USE_SUPABASE && supabase) {
        await supabase.from('certificates').insert({
            user_id: userId, course_id: course.id, status: 'pending'
        });
    }

    state.certificates.push(newCert);
    if (!CONFIG.USE_SUPABASE) {
        localStorage.setItem(`certificates:${userId}`, JSON.stringify(state.certificates));
    }
    renderCertificates();
}

async function loadProducts(userId){
    if (CONFIG.USE_SUPABASE && supabase) {
        const { data: purchases, error } = await supabase
            .from('user_digital_products').select('product_id, digital_products(id, title, description, cover_url, icon)')
            .eq('user_id', userId);
        if (error) { console.error(error); return []; }

        const result = [];
        for (const purchase of purchases) {
            const { data: files } = await supabase
                .from('digital_product_files').select('name, file_url, file_size_bytes')
                .eq('product_id', purchase.product_id).order('order_index');

            result.push({
                id: purchase.digital_products.id,
                title: purchase.digital_products.title,
                description: purchase.digital_products.description,
                cover_url: purchase.digital_products.cover_url,
                icon: purchase.digital_products.icon || '📦',
                files: (files || []).map(f => ({ name: f.name, url: f.file_url, size: f.file_size_bytes }))
            });
        }
        return result;
    }

    return MOCK_PRODUCTS;
}



/* ===========================================================
   УТИЛИТЫ
=========================== */

function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function formatFileSize(bytes){
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function fileExtensionLabel(name){
    const ext = (name.split('.').pop() || '').toUpperCase();
    return ext.slice(0, 4) || '📄';
}



/* ===========================================================
   РЕНДЕР: ХЕДЕР/СТАТИСТИКА
=========================== */

function renderStats(){
    document.getElementById('greetingTitle').textContent = `Hello, ${state.userName} 👋`;

    document.getElementById('statCoursesTotal').textContent = state.courses.length;
    document.getElementById('statLessonsTotal').textContent = state.lessons.length;
    document.getElementById('statProductsTotal').textContent = state.products.length;

    const issuedCerts = state.certificates.filter(c => c.status === 'issued').length;
    document.getElementById('statCertificates').textContent = issuedCerts;
}

/* ===========================================================
   РЕНДЕР: КУРСЫ
=========================== */

function renderCourseGrid(items, gridId, emptyStateId){
    const grid = document.getElementById(gridId);
    const empty = document.getElementById(emptyStateId);

    if (!items.length) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = items.map(course => {
        const percent = course.total_lessons ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0;
        const isDone = percent >= 100;
        const coverStyle = course.cover_url ? `style="background-image:url('${course.cover_url}')"` : '';
        const isSingleLesson = course.total_lessons === 1;

        return `
            <article class="course-card" data-course-id="${course.id}">
                <div class="course-card-cover" ${coverStyle}>
                    ${isDone ? '<span class="course-card-badge done">✓ Пройден</span>' : (percent > 0 ? `<span class="course-card-badge">${percent}%</span>` : '')}
                </div>
                <div class="course-card-body">
                    <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
                    ${isSingleLesson ? '' : `
                    <div class="course-progress-track">
                        <div class="course-progress-fill" style="width:${percent}%"></div>
                    </div>
                    <div class="course-progress-meta">
                        <span>${course.completed_lessons} из ${course.total_lessons} уроков</span>
                        <span>${percent}%</span>
                    </div>
                    `}
                    <button class="course-card-cta">${isDone ? (isSingleLesson ? 'Смотреть снова' : 'Смотреть курс снова') : (percent > 0 ? 'Продолжить' : (isSingleLesson ? 'Смотреть урок' : 'Начать обучение'))}</button>
                </div>
            </article>
        `;
    }).join('');

    grid.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `${CONFIG.LEARNING_PAGE_URL}?course=${card.dataset.courseId}`;
        });
    });
}

function renderCourses(){
    renderCourseGrid(state.courses, 'coursesGrid', 'coursesEmptyState');
}

function renderLessons(){
    renderCourseGrid(state.lessons, 'lessonsGrid', 'lessonsEmptyState');
}

/* ===========================================================
   РЕНДЕР: СЕРТИФИКАТЫ
=========================== */

function renderCertificates(){
    const readyBlock = document.getElementById('certReadyBlock');
    const readyGrid = document.getElementById('certReadyGrid');
    const issuedHeading = document.getElementById('certIssuedHeading');
    const issuedGrid = document.getElementById('certificatesGrid');
    const empty = document.getElementById('certificatesEmptyState');

    const certByCoursId = {};
    state.certificates.forEach(c => { certByCoursId[c.course_id] = c; });

    const readyCourses = state.courses.filter(c =>
        c.total_lessons > 0 && c.completed_lessons >= c.total_lessons && !certByCoursId[c.id]
    );

    if (readyCourses.length) {
        readyBlock.hidden = false;
        readyGrid.innerHTML = readyCourses.map(course => `
            <div class="certificate-card pending">
                <div class="certificate-ribbon">🏆</div>
                <h3 class="certificate-course-title">${escapeHtml(course.title)}</h3>
                <span class="certificate-status-pill">Курс пройден</span>
                <div class="certificate-actions">
                    <button class="cert-btn" data-request-course-id="${course.id}">Запросить сертификат</button>
                </div>
            </div>
        `).join('');

        readyGrid.querySelectorAll('[data-request-course-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const course = state.courses.find(c => c.id === btn.dataset.requestCourseId);
                btn.disabled = true;
                btn.textContent = 'Запрошено…';
                requestCertificate(state.userId, course);
            });
        });
    } else {
        readyBlock.hidden = true;
    }

    if (state.certificates.length) {
        issuedHeading.hidden = false;
        issuedGrid.innerHTML = state.certificates.map(cert => {
            const pending = cert.status === 'pending';
            return `
                <div class="certificate-card ${pending ? 'pending' : ''}">
                    <div class="certificate-ribbon">${pending ? '⏳' : '🏆'}</div>
                    <h3 class="certificate-course-title">${escapeHtml(cert.course_title)}</h3>
                    <div class="certificate-meta">
                        ${cert.certificate_number ? `<span>№ ${escapeHtml(cert.certificate_number)}</span>` : ''}
                        ${cert.issued_at ? `<span>Выдан: ${new Date(cert.issued_at).toLocaleDateString('ru-RU')}</span>` : ''}
                    </div>
                    ${pending ? '<span class="certificate-status-pill">Готовится</span>' : ''}
                    <div class="certificate-actions">
                        ${pending
                            ? '<button class="cert-btn" disabled>Скоро будет готов</button>'
                            : `<a class="cert-btn" href="${cert.pdf_url}" target="_blank" rel="noopener">Скачать PDF</a>
                               <button class="cert-btn outline" data-copy-cert="${cert.id}">Копировать ссылку</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');

        issuedGrid.querySelectorAll('[data-copy-cert]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cert = state.certificates.find(c => c.id === btn.dataset.copyCert);
                navigator.clipboard?.writeText(cert.pdf_url);
                btn.textContent = 'Ссылка скопирована';
                setTimeout(() => { btn.textContent = 'Копировать ссылку'; }, 1800);
            });
        });
    } else {
        issuedHeading.hidden = true;
        issuedGrid.innerHTML = '';
    }

    empty.hidden = !!(readyCourses.length || state.certificates.length);
}

/* ===========================================================
   РЕНДЕР: ЦИФРОВЫЕ ТОВАРЫ
=========================== */

function renderProducts(){
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('productsEmptyState');

    if (!state.products.length) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = state.products.map(product => {
        const coverStyle = product.cover_url ? `style="background-image:url('${product.cover_url}')"` : '';
        return `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-card-cover" ${coverStyle}>${product.cover_url ? '' : (product.icon || '📦')}</div>
                <div class="product-card-body">
                    <h3 class="product-card-title">${escapeHtml(product.title)}</h3>
                    <p class="product-card-desc">${escapeHtml(product.description || '')}</p>
                    <div class="product-card-footer">
                        <span class="product-files-count">${product.files.length} ${filesWord(product.files.length)}</span>
                        <span class="product-open-btn">Открыть →</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openProductModal(card.dataset.productId));
    });
}

function filesWord(count){
    const mod10 = count % 10, mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'файл';
    if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'файла';
    return 'файлов';
}

function openProductModal(productId){
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = product.title;
    document.getElementById('productModalDescription').textContent = product.description || '';

    document.getElementById('productFilesList').innerHTML = product.files.map(file => `
        <div class="product-file-row">
            <div class="file-type-icon">${fileExtensionLabel(file.name)}</div>
            <div class="product-file-info">
                <span class="product-file-name">${escapeHtml(file.name)}</span>
                <span class="product-file-size">${formatFileSize(file.size)}</span>
            </div>
            <a class="file-download-btn" href="${file.url}" download title="Скачать">⬇</a>
        </div>
    `).join('');

    document.getElementById('productModal').classList.add('active');
}

function closeProductModal(){
    document.getElementById('productModal').classList.remove('active');
}

document.getElementById('productModalClose').addEventListener('click', closeProductModal);
document.getElementById('productModalBackdrop').addEventListener('click', closeProductModal);



/* ===========================================================
   ВКЛАДКИ
=========================== */

document.querySelectorAll('.cabinet-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.cabinet-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cabinet-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.panel).classList.add('active');
    });
});

/* ===========================================================
   ИНИЦИАЛИЗАЦИЯ
=========================== */

async function init(){
    state.courses = await loadCourses(state.userId);
    state.lessons = await loadLessons(state.userId);
    state.certificates = await loadCertificates(state.userId);
    state.products = await loadProducts(state.userId);

    renderStats();
    renderCourses();
    renderLessons();
    renderCertificates();
    renderProducts();
}
