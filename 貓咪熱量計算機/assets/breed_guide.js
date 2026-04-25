document.addEventListener('DOMContentLoaded', () => {
    const breedSelect = document.getElementById('breed-select');
    const infoOrigin = document.getElementById('info-origin');
    const infoPros = document.getElementById('info-pros');
    const infoCons = document.getElementById('info-cons');

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
            infoCons.innerHTML = `${consText}<br><br><span style="color: var(--accent-red); font-weight: 600;">🍄 香菇爸特別推薦：</span>針對${data.name}的體質與常見健康隱患，建議可以搭配我們的「藍藻益生菌」，透過日常保養維持腸道健康與營養吸收，替毛孩建立強健的保護力！`;
        }
    }

    breedSelect.addEventListener('change', (e) => {
        updateInfo(e.target.value);
    });

    // Initial load for the default selected breed
    updateInfo('none'); // Default to first item (e.g., 米克斯)
});
