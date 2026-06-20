/*
    手機抽屜選單 — 自動注入 ☰ 按鈕與遮罩
    所有頁面共用，只要在 </body> 前載入這支即可，不需改各頁結構。
*/
(function () {
    function init() {
        var sidebar = document.querySelector('.sidebar');
        if (!sidebar || document.querySelector('.mobile-nav-toggle')) return;

        var btn = document.createElement('button');
        btn.className = 'mobile-nav-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', '開啟選單');
        btn.textContent = '☰';

        var overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';

        function open() { document.body.classList.add('drawer-open'); btn.textContent = '✕'; }
        function close() { document.body.classList.remove('drawer-open'); btn.textContent = '☰'; }
        function toggle() {
            if (document.body.classList.contains('drawer-open')) close(); else open();
        }

        btn.addEventListener('click', toggle);
        overlay.addEventListener('click', close);

        // 點選單裡的連結後自動收起抽屜
        sidebar.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', close);
        });

        // 按 Esc 關閉
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });

        document.body.appendChild(btn);
        document.body.appendChild(overlay);

        // ---- App 底部分頁列（手機）----
        if (!document.querySelector('.app-bottom-nav')) {
            var items = [
                { ic: 'nav-home', label: '首頁', href: '../index測試版.html', tab: '首頁' },
                { ic: 'nav-tools', label: '工具', href: '../index測試版.html#tools', tab: '工具' },
                { ic: 'nav-wiki', label: '百科', href: '../index測試版.html#wiki', tab: '百科' },
                { ic: 'nav-community', label: '社群', href: '../index測試版.html#community', tab: '社群' }
            ];
            var activeMap = {
                'calculator.html': '工具', 'food_analyzer.html': '工具',
                'cat_sounds.html': '百科', 'breed_guide.html': '百科',
                'nutrition_guide.html': '百科', 'chip_guide.html': '百科',
                'sterilization_guide.html': '百科'
            };
            var page = location.pathname.split('/').pop();
            var nav = document.createElement('nav');
            nav.className = 'app-bottom-nav';
            items.forEach(function (it) {
                var a = document.createElement('a');
                a.href = it.href;
                if (activeMap[page] === it.tab) a.className = 'active';
                a.innerHTML = '<img src="../icons/' + it.ic + '.png?v=2" alt="">' + it.label;
                nav.appendChild(a);
            });
            document.body.appendChild(nav);
            document.body.classList.add('has-app-nav');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
