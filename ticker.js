/* 香菇爸 App — 全站跑馬燈（固定在畫面最下方、底部選單上面）
   要改內容：只改下面 ITEMS 就好（t＝文字，u＝點了去哪；u 留空就只顯示不能點） */
(function () {
  var ITEMS = [
    { t: "🍄 本月藍藻菌開團中", u: "https://mushroomlove.pages.dev/" },
    { t: "🎉 11 月高端餐週年慶正式開始", u: "https://mushroomlove.pages.dev/food.html" },
    { t: "📺 菇爸每週社群直播 一・二・四・六", u: "https://agentone.metaepoch.life/link/channels/ifVUGO3ckT" }
  ];
  if (!ITEMS.length || document.querySelector(".tkr")) return;

  var css = document.createElement("style");
  css.textContent = [
    ".tkr{position:fixed;left:50%;transform:translateX(-50%);width:100%;max-width:440px;z-index:49;height:34px;overflow:hidden;",
    "background:linear-gradient(90deg,#8a6a49,#a9835c);color:#fff8ec;font:600 12.5px/34px -apple-system,'Segoe UI','Microsoft JhengHei',sans-serif;",
    "box-shadow:0 -4px 14px rgba(90,70,40,.15)}",
    ".tkr-run{display:inline-flex;white-space:nowrap;animation:tkr var(--tkr-s,28s) linear infinite;will-change:transform}",
    ".tkr:hover .tkr-run,.tkr.hold .tkr-run{animation-play-state:paused}",
    ".tkr a,.tkr span.i{color:inherit;text-decoration:none;padding:0 4px}",
    ".tkr a:active{opacity:.7}",
    ".tkr i{font-style:normal;opacity:.55;padding:0 14px}",
    "@keyframes tkr{from{transform:translateX(0)}to{transform:translateX(-50%)}}",
    "@media (prefers-reduced-motion:reduce){.tkr{overflow-x:auto}.tkr-run{animation:none}}"
  ].join("");
  document.head.appendChild(css);

  function one() {
    return ITEMS.map(function (x) {
      return x.u ? '<a href="' + x.u + '" target="_blank" rel="noopener" data-tkr="' + x.t + '">' + x.t + "</a>"
                 : '<span class="i">' + x.t + "</span>";
    }).join("<i>｜</i>") + "<i>｜</i>";
  }

  function mount() {
    var bar = document.createElement("div");
    bar.className = "tkr";
    bar.setAttribute("role", "marquee");
    /* 內容放兩份，捲到一半剛好接回開頭 → 無縫循環 */
    bar.innerHTML = '<div class="tkr-run">' + one() + one() + "</div>";
    document.body.appendChild(bar);

    var run = bar.firstChild;
    /* 依文字長度調速度：每秒約 45px */
    run.style.setProperty("--tkr-s", Math.max(16, Math.round(run.scrollWidth / 2 / 45)) + "s");

    /* 有底部選單就貼在它上面，沒有就貼畫面最下面 */
    function place() {
      var nav = document.querySelector(".bottom-nav, .app-bottom-nav");
      var h = nav && getComputedStyle(nav).display !== "none" ? nav.getBoundingClientRect().height : 0;
      bar.style.bottom = h ? h + "px" : "env(safe-area-inset-bottom)";
      document.body.style.paddingBottom = (h + 34) + "px";
    }
    place();
    setTimeout(place, 600);
    window.addEventListener("resize", place);

    /* 手機：按住暫停，放開繼續 */
    bar.addEventListener("touchstart", function () { bar.classList.add("hold"); }, { passive: true });
    bar.addEventListener("touchend", function () { bar.classList.remove("hold"); });

    bar.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-tkr]");
      if (a && typeof gtag === "function") gtag("event", "ticker_click", { item: a.getAttribute("data-tkr") });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
