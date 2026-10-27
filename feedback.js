/* 香菇爸護貓網站：看過人數＋這篇有幫到你嗎＋留言（香菇爸審核後才公開）
   資料存在 Cloudflare Worker mushroom-cat-park 的 /fb/*（D1 資料庫）
   用法：頁尾加 <script src="feedback.js" defer></script>
   放的位置：有 [data-fb] 就放那裡，否則放在 .sources／.foot 前面，再不然放在 main 最後 */
(function () {
  var API = 'https://mushroom-cat-park.pupss4897.workers.dev/fb/';
  var me = document.currentScript;
  var LINE = (me && me.dataset.line) || 'https://agentone.metaepoch.life/link/channels/ifVUGO3ckT';

  // 頁面代號：cat-guide 是 guide/index，護貓網站是 mc/檔名
  var path = decodeURIComponent(location.pathname);
  var file = (path.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  var page = (/\/cat-guide\//.test(path) ? 'guide/' : 'mc/') + file.toLowerCase().replace(/[^a-z0-9_\-]/g, '');

  var dev = '';
  try { dev = localStorage.getItem('shroom-dev') || ''; } catch (e) {}
  if (!/^[a-z0-9]{8,24}$/.test(dev)) {
    dev = (Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/[^a-z0-9]/g, '').slice(0, 16);
    try { localStorage.setItem('shroom-dev', dev); } catch (e) {}
  }
  var mine = function (k) { try { return localStorage.getItem('shroom-fb-' + k + '-' + page); } catch (e) { return null; } };
  var keep = function (k) { try { localStorage.setItem('shroom-fb-' + k + '-' + page, '1'); } catch (e) {} };
  var post = function (p, d) {
    d.p = page; d.id = dev;
    return fetch(API + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(function (r) { return r.json(); });
  };
  var esc = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ga = function (n, o) { if (window.gtag) gtag('event', n, Object.assign({ page_id: page }, o || {})); };

  var css = '\
.fb{margin:18px 18px 6px;padding:16px;border-radius:20px;background:#fff;border:1px solid #eadfcd;box-shadow:0 8px 22px rgba(150,130,100,.08);color:#5a5246;font-size:13px;line-height:1.6;text-align:left}\
.fb *{box-sizing:border-box}\
.wrap>.fb,.main-content>.fb{margin:18px 0 6px}\
.fb-seen{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:#958a79;margin-bottom:12px}\
.fb-seen b{color:#a9835c;font-size:15px}\
.fb h3{font-size:14.5px;text-align:center;margin:0 0 9px}\
.fb-re{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
.fb-re button{display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 6px;border-radius:14px;border:1.5px solid #eadfcd;background:#fbf5e9;font:inherit;font-size:13px;font-weight:800;color:#5a5246;cursor:pointer;transition:.15s}\
.fb-re button em{font-style:normal;font-size:11.5px;color:#958a79;font-weight:700}\
.fb-re button.on{background:#e3eee5;border-color:#8fb89a;color:#4a7d5c}\
.fb-re button.on em{color:#4a7d5c}\
.fb-re button:active{transform:scale(.96)}\
.fb-cm{margin-top:16px;padding-top:14px;border-top:1px dashed #eadfcd}\
.fb-cm h4{font-size:13.5px;margin:0 0 8px}\
.fb-cm h4 small{font-weight:400;color:#958a79;font-size:11px;margin-left:4px}\
.fb-list{display:grid;gap:8px;margin-bottom:10px}\
.fb-c{padding:10px 12px;border-radius:14px;background:#fbf5e9}\
.fb-c b{font-size:12px}.fb-c time{font-size:10.5px;color:#958a79;margin-left:6px}\
.fb-c p{margin:3px 0 0;font-size:12.8px;white-space:pre-wrap;word-break:break-word}\
.fb-c .fb-rp{margin-top:7px;padding:8px 10px;border-radius:11px;background:#fff;border-left:3px solid #a9835c;font-size:12.3px}\
.fb-c .fb-rp i{font-style:normal;font-weight:800;color:#a9835c;margin-right:4px}\
.fb-none{font-size:12px;color:#958a79;margin-bottom:10px}\
.fb-form{display:grid;gap:7px}\
.fb-form input,.fb-form textarea{width:100%;padding:10px 12px;border-radius:12px;border:1px solid #eadfcd;background:#fffdf8;font:inherit;font-size:16px;color:#5a5246}\
.fb-form textarea{min-height:76px;resize:vertical}\
.fb-form button{padding:11px;border:0;border-radius:13px;background:#a9835c;color:#fff;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer}\
.fb-form button:disabled{opacity:.55}\
.fb-msg{font-size:12px;text-align:center;min-height:1em}\
.fb-msg.ok{color:#4a7d5c}.fb-msg.no{color:#c25a48}\
.fb-line{display:block;margin-top:12px;padding:11px;border-radius:13px;background:#06C755;color:#fff !important;text-align:center;font-size:13px;font-weight:800;text-decoration:none}\
.fb-note{display:block;margin-top:6px;text-align:center;font-size:10.5px;color:#958a79}';

  function mount() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('section'); box.className = 'fb'; box.id = 'feedback';
    box.innerHTML =
      '<div class="fb-seen">🐾 已經有 <b data-n>…</b> 位毛家長看過這篇</div>' +
      '<h3>這篇有幫到你嗎？</h3>' +
      '<div class="fb-re"><button type="button" data-k="up">👍 有幫助 <em>0</em></button><button type="button" data-k="more">😻 想看更多 <em>0</em></button></div>' +
      '<div class="fb-cm"><h4>💬 留言給香菇爸<small>香菇爸看過後才會公開</small></h4>' +
      '<div class="fb-list"></div>' +
      '<form class="fb-form"><input name="n" maxlength="12" placeholder="你的暱稱（可不填）" autocomplete="nickname">' +
      '<textarea name="t" maxlength="200" placeholder="想說的話、你家主子的狀況、想看什麼主題…" required></textarea>' +
      '<button type="submit">送出留言</button><p class="fb-msg"></p></form>' +
      '<a class="fb-line" href="' + LINE + '" target="_blank" rel="noopener">想直接問香菇爸？ 加 LINE 一對一問 ›</a>' +
      '<span class="fb-note">留言不要留電話、地址等個人資料喔</span></div>';
    var spot = document.querySelector('[data-fb]');
    if (spot) spot.appendChild(box);
    else {
      var before = document.querySelector('main .sources, .wrap > .foot, main > .sources');
      if (before) before.parentNode.insertBefore(box, before);
      else (document.querySelector('main') || document.body).appendChild(box);
    }

    var seen = box.querySelector('[data-n]');
    var btns = box.querySelectorAll('.fb-re button');
    btns.forEach(function (b) {
      if (mine(b.dataset.k)) b.classList.add('on');
      b.addEventListener('click', function () {
        if (b.classList.contains('on')) return;
        b.classList.add('on'); keep(b.dataset.k);
        var em = b.querySelector('em'); em.textContent = (+em.textContent || 0) + 1;
        ga('fb_react', { kind: b.dataset.k });
        post('react', { k: b.dataset.k }).then(function (r) { if (r.ok) em.textContent = r.n; }).catch(function () {});
      });
    });

    var list = box.querySelector('.fb-list');
    function show(cs) {
      if (!cs || !cs.length) { list.innerHTML = '<p class="fb-none">還沒有留言 ~ 來當第一個吧 🐾</p>'; return; }
      list.innerHTML = cs.map(function (c) {
        var d = new Date(c.t);
        return '<div class="fb-c"><b>' + esc(c.name || '毛家長') + '</b><time>' + (d.getMonth() + 1) + '/' + d.getDate() + '</time><p>' + esc(c.body) + '</p>' +
          (c.reply ? '<div class="fb-rp"><i>🍄 香菇爸</i>' + esc(c.reply) + '</div>' : '') + '</div>';
      }).join('');
    }

    fetch(API + 'stat?p=' + encodeURIComponent(page)).then(function (r) { return r.json(); }).then(function (r) {
      if (!r.ok) return;
      btns.forEach(function (b) { b.querySelector('em').textContent = (r.讚 && r.讚[b.dataset.k]) || 0; });
      if (r.看過) seen.textContent = r.看過.toLocaleString();
      show(r.留言);
    }).catch(function () { show([]); });
    post('hit', {}).then(function (r) { if (r.ok) seen.textContent = (r.看過 || 1).toLocaleString(); }).catch(function () { seen.parentNode.style.display = 'none'; });

    var form = box.querySelector('form'), msg = box.querySelector('.fb-msg'), send = form.querySelector('button');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = form.t.value.trim();
      if (t.length < 2) { msg.className = 'fb-msg no'; msg.textContent = '再多寫幾個字吧'; return; }
      send.disabled = true; msg.className = 'fb-msg'; msg.textContent = '送出中…';
      post('comment', { 名: form.n.value.trim(), 文: t, 題: document.title.split('｜')[0].slice(0, 40) }).then(function (r) {
        if (r.ok) { msg.className = 'fb-msg ok'; msg.textContent = '收到了 ~ 香菇爸看過後就會出現在這裡 🍄'; form.t.value = ''; ga('fb_comment'); }
        else { msg.className = 'fb-msg no'; msg.textContent = r.錯 || '沒有送出 請再試一次'; }
      }).catch(function () { msg.className = 'fb-msg no'; msg.textContent = '網路好像不穩 請再試一次'; })
        .then(function () { send.disabled = false; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
