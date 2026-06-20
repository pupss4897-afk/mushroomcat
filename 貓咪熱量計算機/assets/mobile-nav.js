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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
