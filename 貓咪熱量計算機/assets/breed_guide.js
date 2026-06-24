document.addEventListener('DOMContentLoaded', () => {
    const breedSelect = document.getElementById('breed-select');
    const infoOrigin = document.getElementById('info-origin');
    const infoPros = document.getElementById('info-pros');
    const infoCons = document.getElementById('info-cons');

    // 已有「會動的療癒貓」影格的品種（畫好新品種就把 key 加進來）
    const animatedBreeds = new Set([
        'none', 'british_shorthair', 'ragdoll',
        'american_shorthair', 'exotic_shorthair', 'persian',
        'maine_coon', 'russian_blue', 'siamese',
        'sphynx', 'scottish_fold', 'munchkin',
        'bengal', 'norwegian_forest', 'abyssinian',
        'somali', 'siberian', 'burmese',
        'birman', 'oriental_shorthair', 'british_longhair'
    ]);
    // 已做好「完整照顧懶人包」的品種（breed_care.html 有資料的，新增就加進來）
    const careBreeds = new Set([
        'american_shorthair', 'british_shorthair', 'munchkin',
        'ragdoll', 'norwegian_forest', 'maine_coon',
        'exotic_shorthair', 'persian', 'siamese', 'scottish_fold'
    ]);
    const careLink = document.getElementById('breed-care-link');
    const careName = document.getElementById('care-breed-name');
    function updateCareLink(breedKey) {
        if (!careLink) return;
        if (careBreeds.has(breedKey) && breedData[breedKey]) {
            careLink.href = 'breed_care.html?breed=' + breedKey;
            if (careName) careName.textContent = breedData[breedKey].name;
            careLink.hidden = false;
        } else {
            careLink.hidden = true;
        }
    }

    const breedCat = document.getElementById('breed-cat');
    const catFrames = breedCat ? breedCat.querySelectorAll('.cat-frame') : [];
    function updateCat(breedKey) {
        if (!breedCat) return;
        if (animatedBreeds.has(breedKey)) {
            for (let i = 0; i < 3; i++) {
                catFrames[i].src = `../icons/cats/cat-${breedKey}-${i + 1}.png?v=2`;
            }
            breedCat.hidden = false;
        } else {
            breedCat.hidden = true;
        }
    }

    // Populate dropdown with breeds from cat_data.js
    const breeds = Object.keys(breedData);
    breeds.forEach(breedKey => {
        const option = document.createElement('option');
        option.value = breedKey;
        // Use the full name including English from the data or keep it simple
        option.textContent = breedData[breedKey].name;
        breedSelect.appendChild(option);
    });

    // Handle change to update information cards
    function updateInfo(breedKey) {
        const data = breedData[breedKey];
        if (data) {
            infoOrigin.textContent = data.origin || '目前尚無這品種的故事資料。';
            infoPros.textContent = data.pros || '目前尚無資料。';
            const consText = data.cons || '目前尚無資料。';
            infoCons.innerHTML = `${consText}<br><br><span style="color: var(--accent-red); font-weight: 600;">🍄 香菇爸小提醒：</span>針對${data.name}的體質，平常多留意飲食均衡、體重控制與定期健檢，有任何狀況都建議諮詢專業獸醫師喔！`;
        }
        updateCat(breedKey);
        updateCareLink(breedKey);
        if (typeof gtag === 'function' && data) {
            gtag('event', 'view_breed', { breed: data.name });
        }
    }

    breedSelect.addEventListener('change', (e) => {
        updateInfo(e.target.value);
    });

    // Initial load for the default selected breed
    updateInfo('none'); // Default to first item (e.g., 米克斯)
});
