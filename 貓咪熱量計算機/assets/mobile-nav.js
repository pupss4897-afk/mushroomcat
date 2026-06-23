/*
    手機 App 底部分頁列 — 自動注入到每個工具頁
    手機上工具頁不再顯示側邊欄／☰ 抽屜，導覽一律用底部列，避免兩套選單混亂。
*/
(function () {
    function init() {
        if (document.querySelector('.app-bottom-nav')) return;

        var items = [
            { ic: 'nav-home', label: '首頁', href: '../index.html' },
            { ic: 'nav-tools', label: '工具', href: '../index.html#tools' },
            { ic: 'nav-wiki', label: '百科', href: '../index.html#wiki' },
            { ic: 'nav-community', label: '社群', href: '../index.html#community' }
        ];
        var activeMap = {
            'calculator.html': '工具', 'food_analyzer.html': '工具',
            'cat_sounds.html': '百科', 'breed_guide.html': '百科',
            'nutrition_guide.html': '百科', 'chip_guide.html': '百科',
            'sterilization_guide.html': '百科', 'age_care.html': '百科'
        };
        var page = location.pathname.split('/').pop();

        var nav = document.createElement('nav');
        nav.className = 'app-bottom-nav';
        items.forEach(function (it) {
            var a = document.createElement('a');
            a.href = it.href;
            if (activeMap[page] === it.label) a.className = 'active';
            a.innerHTML = '<img src="../icons/' + it.ic + '.png?v=2" alt="">' + it.label;
            nav.appendChild(a);
        });
        document.body.appendChild(nav);
        document.body.classList.add('has-app-nav');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/* GA4：自動追蹤每個按鈕/連結的點擊 */
(function () {
    document.addEventListener('click', function (e) {
        var el = e.target.closest('a, button');
        if (!el) return;
        var label = (el.getAttribute('data-ga') || el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
        if (!label) return;
        if (typeof gtag === 'function') {
            gtag('event', 'button_click', {
                label: label,
                page: location.pathname.split('/').pop() || 'home'
            });
        }
    }, true);
})();
