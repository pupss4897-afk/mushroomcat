/* 香菇爸 App — 全站搜尋元件（純前端，零後端）
   三層回退：1 精準命中 → 2 同類別推薦 → 3 熱門 ＋ 導 LINE（自動帶上他打的字） */
(function () {
  var IDX = window.SHROOM_SEARCH_INDEX || [];
  if (!IDX.length) return;

  var TOP = window.SHROOM_SEARCH_TOP || [];
  var OA = window.SHROOM_SEARCH_LINE_OA || "@mushroom131";

  /* 子資料夾的頁面要往上一層才找得到根目錄的頁 */
  var BASE = /\/貓咪熱量計算機\//.test(decodeURIComponent(location.pathname)) ? "../" : "";
  var here = decodeURIComponent(location.pathname).split("/").pop();

  /* ---------- 樣式 ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".sfx-wrap{padding:12px 16px 4px;position:relative;font-family:var(--font-b,-apple-system,'Segoe UI',sans-serif)}",
    ".sfx-box{display:flex;align-items:center;gap:8px;background:var(--surface,#fff);border:1px solid var(--line,#ece2d0);",
    "border-radius:var(--radius,20px);padding:10px 14px;box-shadow:var(--shadow,0 8px 24px rgba(150,130,100,.12))}",
    ".sfx-box:focus-within{border-color:var(--pink,#e8a39b)}",
    ".sfx-ico{font-size:16px;flex-shrink:0;opacity:.6}",
    ".sfx-in{flex:1;border:0;outline:0;background:transparent;font-size:15px;color:var(--text,#5a5246);min-width:0}",
    ".sfx-in::placeholder{color:var(--text-soft,#9a8f7e)}",
    ".sfx-clr{border:0;background:transparent;font-size:15px;color:var(--text-soft,#9a8f7e);cursor:pointer;padding:0 2px;display:none}",
    ".sfx-res{margin-top:10px;background:var(--surface,#fff);border:1px solid var(--line,#ece2d0);border-radius:var(--radius,20px);",
    "box-shadow:var(--shadow,0 8px 24px rgba(150,130,100,.12));overflow:hidden;display:none}",
    ".sfx-note{padding:11px 16px;font-size:12.5px;color:var(--text-soft,#9a8f7e);background:var(--cream-2,#f4ead7)}",
    ".sfx-item{display:flex;align-items:center;gap:11px;padding:12px 15px;text-decoration:none;color:inherit;border-top:1px solid var(--line,#ece2d0)}",
    ".sfx-item:first-child{border-top:0}",
    ".sfx-item:active{background:var(--cream,#fbf5e9)}",
    ".sfx-em{font-size:20px;flex-shrink:0;width:26px;text-align:center}",
    ".sfx-tx{flex:1;min-width:0}",
    ".sfx-t{display:block;font-size:14.5px;font-weight:600;line-height:1.35}",
    ".sfx-d{display:block;font-size:12px;color:var(--text-soft,#9a8f7e);line-height:1.45;margin-top:2px}",
    ".sfx-ar{color:var(--text-soft,#9a8f7e);font-size:17px;flex-shrink:0}",
    ".sfx-line{display:flex;align-items:center;gap:10px;padding:13px 15px;text-decoration:none;color:#fff;background:#06C755;font-weight:700;font-size:14px}",
    ".sfx-line span.e{font-size:18px}"
  ].join("");
  document.head.appendChild(css);

  /* ---------- 建立 UI ---------- */
  var wrap = document.createElement("div");
  wrap.className = "sfx-wrap";
  wrap.innerHTML =
    '<div class="sfx-box"><span class="sfx-ico">🔍</span>' +
    '<input class="sfx-in" type="search" autocomplete="off" enterkeyhint="search" ' +
    'placeholder="想找什麼？打「幾餐」「晶片」「中暑」都行" aria-label="站內搜尋">' +
    '<button class="sfx-clr" type="button" aria-label="清除">✕</button></div>' +
    '<div class="sfx-res" role="listbox"></div>';

  function mount() {
    var host = document.querySelector(".app-header");
    if (host && host.parentNode) { host.parentNode.insertBefore(wrap, host.nextSibling); return; }
    host = document.querySelector(".app-shell") || document.body;
    host.insertBefore(wrap, host.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  var input = wrap.querySelector(".sfx-in");
  var clr = wrap.querySelector(".sfx-clr");
  var res = wrap.querySelector(".sfx-res");

  /* ---------- 比對 ---------- */
  function grams(s) { var a = []; for (var i = 0; i < s.length - 1; i++) a.push(s.substr(i, 2)); return a; }

  function score(q, p) {
    var s = 0, hay = (p.t + " " + p.d).toLowerCase(), ql = q.toLowerCase();
    if (hay.indexOf(ql) > -1) s += 9;
    for (var i = 0; i < p.kw.length; i++) {
      var k = p.kw[i].toLowerCase();
      if (k === ql) s += 12;
      else if (k.indexOf(ql) > -1) s += 10;
      else if (ql.indexOf(k) > -1) s += 8;
    }
    if (q.length > 1) {
      var g = grams(ql), pool = (hay + " " + p.kw.join(" ")).toLowerCase();
      for (var j = 0; j < g.length; j++) if (pool.indexOf(g[j]) > -1) s += 3;
    }
    return s;
  }

  function byUrl(u) { for (var i = 0; i < IDX.length; i++) if (IDX[i].u === u) return IDX[i]; return null; }

  function row(p) {
    var ext = /^https?:\/\//.test(p.u);
    return '<a class="sfx-item" href="' + (ext ? p.u : BASE + p.u) + '"' +
      (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
      '<span class="sfx-em">' + p.i + '</span><span class="sfx-tx">' +
      '<span class="sfx-t">' + p.t + '</span><span class="sfx-d">' + p.d + '</span></span>' +
      '<span class="sfx-ar">' + (ext ? '↗' : '›') + '</span></a>';
  }

  function lineRow(q) {
    var msg = q ? ("我想找「" + q + "」的資料") : "我想找資料";
    return '<a class="sfx-line" href="https://line.me/R/oaMessage/' + OA + '/?' + encodeURIComponent(msg) +
      '" target="_blank" rel="noopener"><span class="e">💬</span>' +
      '<span>把「' + q + '」直接問香菇爸</span></a>';
  }

  function render(q) {
    q = q.trim();
    if (!q) { res.style.display = "none"; clr.style.display = "none"; return; }
    clr.style.display = "block";

    var scored = [];
    for (var i = 0; i < IDX.length; i++) {
      if (IDX[i].u.split("/").pop() === here) continue;   /* 不推薦自己 */
      var s = score(q, IDX[i]);
      if (s > 0) scored.push({ p: IDX[i], s: s });
    }
    scored.sort(function (a, b) { return b.s - a.s; });

    var strong = scored.filter(function (x) { return x.s >= 8; }).slice(0, 6);
    var html = "";

    if (strong.length) {
      html = strong.map(function (x) { return row(x.p); }).join("");
      html += lineRow(q);
    } else if (scored.length) {
      /* 第 2 層：沒有精準命中，推最接近的 */
      html = '<div class="sfx-note">沒有完全對上，這幾篇可能也在講你要的 👇</div>' +
        scored.slice(0, 4).map(function (x) { return row(x.p); }).join("") + lineRow(q);
    } else {
      /* 第 3 層：完全沒有 */
      var tops = TOP.map(byUrl).filter(Boolean);
      html = '<div class="sfx-note">😿 還沒有「' + q + '」這篇～先看看這些，或直接問香菇爸</div>' +
        tops.map(row).join("") + lineRow(q);
    }
    res.innerHTML = html;
    res.style.display = "block";
  }

  input.addEventListener("input", function () { render(input.value); });
  clr.addEventListener("click", function () { input.value = ""; render(""); input.focus(); });
  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) res.style.display = "none";
  });
  input.addEventListener("focus", function () { if (input.value.trim()) render(input.value); });
})();
