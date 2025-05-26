// 主题切换功能
const themeSwitch = document.querySelector('.theme-switch');
const body = document.body;

// 预定义的图片列表
const imageLists = {
    't1': [
        'images/t1/Weixin Image_20250518112521.jpg',
        'images/t1/Weixin Image_202505181125191.jpg',
        'images/t1/Weixin Image_20250518112519.jpg',
        'images/t1/Weixin Image_20250518112518.jpg',
        'images/t1/Weixin Image_20250518112515.jpg',
        'images/t1/Weixin Image_20250518112514.jpg',
        'images/t1/Weixin Image_20250518112511.jpg',
        'images/t1/Weixin Image_20250518112509.jpg',
        'images/t1/Weixin Image_20250518112506.jpg',
        'images/t1/Weixin Image_20250518112504.jpg'
    ],
    't2': [
        'images/t2/Weixin Image_202505181022211.jpg',
        'images/t2/Weixin Image_20250518102221.jpg',
        'images/t2/Weixin Image_20250518102222.jpg',
        'images/t2/Weixin Image_202505181022252.jpg',
        'images/t2/Weixin Image_202505181022251.jpg',
        'images/t2/Weixin Image_20250518102225.jpg'
    ]
};

themeSwitch.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeSwitch.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// 检查本地存储中的主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    themeSwitch.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// 图片加载功能
function loadImages(category, container) {
    const images = imageLists[category] || [];
    
    // 只显示前6张图片在主页
    const previewImages = images.slice(0, 6);
    container.innerHTML = previewImages.map((src, index) => `
        <div class="gallery-item">
            <img src="${src}" alt="Gallery Image" loading="lazy" 
                 onclick="openFullScreen('${src}', ${index}, '${category}', ${images.length})">
        </div>
    `).join('');

    return images; // 返回所有图片链接供模态框使用
}

// 全屏显示图片
function openFullScreen(src, index, category, totalImages) {
    const images = imageLists[category];
    // 如果是首页图片（index小于6），直接显示当前图片
    if (index < 6) {
        showModal(images, index);
    } else {
        // 如果是"加载更多"后的图片，显示所有图片
        showModal(images, index);
    }
}

// 模态框功能
const modal = document.getElementById('imageModal');
const modalGallery = modal.querySelector('.modal-gallery');
const closeModal = modal.querySelector('.close-modal');
const prevBtn = modal.querySelector('.prev-btn');
const nextBtn = modal.querySelector('.next-btn');

let currentImages = [];
let currentIndex = 0;

function showModal(images, startIndex = 0) {
    currentImages = images;
    currentIndex = startIndex;
    modalGallery.innerHTML = images.map((src, index) => `
        <img src="${src}" alt="Gallery Image" loading="lazy" 
             class="${index === startIndex ? 'active' : ''}"
             onclick="showFullImage(${index})">
    `).join('');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showFullImage(index) {
    const img = modalGallery.querySelector(`img:nth-child(${index + 1})`);
    if (img) {
        const fullImg = document.createElement('div');
        fullImg.className = 'full-image';
        fullImg.innerHTML = `
            <div class="full-image-content">
                <img src="${currentImages[index]}" alt="Full Image">
                <button class="close-full-image">&times;</button>
            </div>
        `;
        document.body.appendChild(fullImg);
        
        fullImg.querySelector('.close-full-image').onclick = () => {
            fullImg.remove();
        };
    }
}

function navigateImages(direction) {
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    const images = modalGallery.querySelectorAll('img');
    images.forEach((img, index) => {
        img.classList.toggle('active', index === currentIndex);
    });
}

// 事件监听器
document.querySelectorAll('.view-more').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        const images = loadImages(category, document.createElement('div'));
        showModal(images);
    });
});

closeModal.addEventListener('click', closeModalHandler);
prevBtn.addEventListener('click', () => navigateImages(-1));
nextBtn.addEventListener('click', () => navigateImages(1));

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') closeModalHandler();
        if (e.key === 'ArrowLeft') navigateImages(-1);
        if (e.key === 'ArrowRight') navigateImages(1);
    }
});

// 初始加载图片
window.addEventListener('load', () => {
    const gallery1 = document.getElementById('gallery1');
    const gallery2 = document.getElementById('gallery2');
    
    loadImages('t1', gallery1);
    loadImages('t2', gallery2);
}); 