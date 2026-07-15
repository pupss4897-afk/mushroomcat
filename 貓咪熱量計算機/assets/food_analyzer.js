// 飼料成分分析器
// 分析引擎與成分資料庫已移至後端 Cloudflare Worker（前端不再持有）

// ============================================================
//  體驗碼設定 — 香菇爸可以自行新增/修改
//  uses: 體驗次數;設為 -1 = 無限次
//  輸入時不分大小寫 (內部會轉成大寫)
// ============================================================
const ACCESS_CODES = {
    '100': { uses: 3,  label: '三次體驗碼' },
    '520': { uses: -1, label: '永久使用碼' }
};

const LINE_INVITE_URL = 'https://s.luckycat.no8.io/link/channels/ifVUGO3ckT';

(function() {
    const els = {
        textArea: document.getElementById('ingredient-text'),
        analyzeBtn: document.getElementById('btn-analyze'),
        results: document.getElementById('analyze-results'),
        sample1Btn: document.getElementById('btn-sample1'),
        sample2Btn: document.getElementById('btn-sample2'),
        clearTextBtn: document.getElementById('btn-clear-text'),
        photoHelper: document.getElementById('photo-helper'),
        photoHelperToggle: document.getElementById('photo-helper-toggle'),
        platformTabs: document.getElementById('platform-tabs'),
    };

    // ============== 範例與清空 ==============
    els.sample1Btn.addEventListener('click', () => {
        els.textArea.value = '台灣鴨肉、澳洲雞肉、巴布亞紐幾內亞鮪魚、台灣鰹魚、澳洲牛肉、綜合纖維粉(木薯、鳳梨纖維)、凍乾雞肉粉、專利益菌配方(芽孢乳酸菌、羅伊氏乳桿菌、EC80酪酸菌、紅麴)、乳清蛋白、酪蛋白、膠原蛋白、阿拉斯加鱈魚油、鳳梨酵素、青木瓜酵素、大豆卵磷脂、酵母粉、碳酸鈣、綜合維生素(牛磺酸、A、D、E、K、B1、B2、B6、B12、葉酸、β胡蘿蔔素)、綜合礦物質';
        els.textArea.focus();
    });
    els.sample2Btn.addEventListener('click', () => {
        els.textArea.value = '成分:脫水家禽蛋白、米、植物分離蛋白、大豆粉、小麥、玉米粉、動物脂肪、小麥麵粉、水解動物蛋白、蔬菜纖維、礦物質、米麩質、甜菜漿、大豆油、小麥麩。';
        els.textArea.focus();
    });
    els.clearTextBtn.addEventListener('click', () => {
        els.textArea.value = '';
        els.results.classList.add('hidden');
        els.textArea.focus();
    });

    // ============== Photo Helper 互動 ==============
    els.photoHelperToggle.addEventListener('click', () => {
        els.photoHelper.classList.toggle('open');
    });

    // 識破行銷話術 摺疊
    const trapsCard = document.getElementById('traps-card');
    const trapsToggle = document.getElementById('traps-toggle');
    if (trapsToggle) {
        trapsToggle.addEventListener('click', () => trapsCard.classList.toggle('open'));
    }
    els.platformTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.platform-tab');
        if (!btn) return;
        const platform = btn.dataset.platform;
        document.querySelectorAll('.platform-tab').forEach(t => t.classList.toggle('active', t === btn));
        document.querySelectorAll('.platform-content').forEach(c => c.classList.toggle('active', c.dataset.platform === platform));
    });

    // ============== 體驗碼閘門 ==============
    const ACCESS_KEY = 'mushroom_analyzer_access';
    const USED_KEY   = 'mushroom_analyzer_used_codes';
    const accessCard = document.getElementById('access-card');

    function getAccess() {
        try { return JSON.parse(localStorage.getItem(ACCESS_KEY)) || null; }
        catch { return null; }
    }
    function setAccess(data) { localStorage.setItem(ACCESS_KEY, JSON.stringify(data)); }
    function clearAccess() { localStorage.removeItem(ACCESS_KEY); }

    // 已用過的碼清單(防止用完後再次輸入同碼重置次數)
    function getUsedCodes() {
        try { return JSON.parse(localStorage.getItem(USED_KEY)) || []; }
        catch { return []; }
    }
    function markCodeUsed(code) {
        const list = getUsedCodes();
        if (!list.includes(code)) {
            list.push(code);
            localStorage.setItem(USED_KEY, JSON.stringify(list));
        }
    }

    function canAnalyze() {
        const d = getAccess();
        if (!d) return false;
        return d.unlimited || d.remaining > 0;
    }

    function consumeUse() {
        const d = getAccess();
        if (!d) return false;
        if (d.unlimited) return true;
        if (d.remaining <= 0) return false;
        d.remaining--;
        setAccess(d);
        return true;
    }

    function activateCode(rawCode) {
        const code = (rawCode || '').trim().toUpperCase();
        if (!code) return { ok: false, msg: '請輸入體驗碼' };
        const cfg = ACCESS_CODES[code];
        if (!cfg) return { ok: false, msg: '體驗碼無效,請確認後再試一次' };

        const existing = getAccess();
        // 同碼且仍有 access 紀錄 → 沿用現有剩餘次數(避免重複扣)
        if (existing && existing.code === code) {
            return { ok: true };
        }
        // 已用過的碼(非無限碼)不能再用
        if (cfg.uses !== -1 && getUsedCodes().includes(code)) {
            return { ok: false, msg: '這個體驗碼在此裝置已使用過,請輸入其他碼或加入 LINE 領取新的碼' };
        }

        const data = {
            code, label: cfg.label,
            remaining: cfg.uses,
            unlimited: cfg.uses === -1,
            activatedAt: new Date().toISOString(),
        };
        setAccess(data);
        // 啟用的當下就標記為「已使用過」,任何離開後重輸都會被擋
        if (cfg.uses !== -1) markCodeUsed(code);
        return { ok: true };
    }

    function renderAccess() {
        const d = getAccess();
        if (!d) {
            accessCard.className = 'access-card locked';
            accessCard.innerHTML = `
                <div class="access-locked-grid">
                    <span class="ico">🔐</span>
                    <div>
                        <h3>輸入體驗碼解鎖分析功能</h3>
                        <p>輸入體驗碼可免費試用 3 次完整成分分析。沒有碼?加入香菇爸 LINE 社群免費領取!</p>
                        <div class="access-form">
                            <input id="code-input" type="text" placeholder="輸入 100" autocomplete="off" maxlength="32">
                            <button id="code-submit" type="button">啟用</button>
                        </div>
                        <div class="access-msg" id="access-msg"></div>
                        <a href="${LINE_INVITE_URL}" target="_blank" rel="noopener" class="access-line-cta">
                            📲 加入香菇爸 LINE 領取體驗碼
                        </a>
                    </div>
                </div>`;
            const input = document.getElementById('code-input');
            document.getElementById('code-submit').addEventListener('click', () => trySubmit(input.value));
            input.addEventListener('keydown', e => { if (e.key === 'Enter') trySubmit(input.value); });
            input.focus();
            updateAnalyzeBtnLock();
            return;
        }

        if (!d.unlimited && d.remaining <= 0) {
            accessCard.className = 'access-card depleted';
            accessCard.innerHTML = `
                <h3>🍄 體驗結束 — 感謝你的試用!</h3>
                <p>覺得這個工具有用嗎?加入<strong>香菇爸 LINE 社群</strong>取得更多體驗次數,還能收看「護貓直播」、和其他家長一起交流。或輸入新的體驗碼繼續使用。</p>
                <div class="depleted-actions">
                    <a href="${LINE_INVITE_URL}" target="_blank" rel="noopener" class="access-line-cta">
                        📲 加入香菇爸 LINE 社群
                    </a>
                    <button class="btn-secondary" id="code-reenter" type="button">🔑 輸入新的體驗碼</button>
                </div>`;
            document.getElementById('code-reenter').addEventListener('click', () => {
                clearAccess();
                renderAccess();
            });
            updateAnalyzeBtnLock();
            return;
        }

        // unlocked
        accessCard.className = 'access-card unlocked';
        const countHtml = d.unlimited
            ? '<span class="badge-count unlimited">⭐ 無限次</span>'
            : `<span class="badge-count">剩餘 <strong>${d.remaining}</strong> 次</span>`;
        accessCard.innerHTML = `
            <div class="badge-row">
                <span class="badge-ico">✨</span>
                <span class="badge-label">已啟用 · ${escapeHtml(d.label)}</span>
                ${countHtml}
                <button class="badge-reset" id="badge-reset" type="button">重新輸入</button>
            </div>`;
        document.getElementById('badge-reset').addEventListener('click', () => {
            const isUnlimited = d.unlimited;
            const msg = isUnlimited
                ? '確定要登出無限體驗碼嗎?'
                : '⚠️ 確定要清除目前的體驗碼嗎?\n\n剩餘次數會遺失,而且此碼之後不能再次啟用(需要使用新的體驗碼)。';
            if (confirm(msg)) {
                clearAccess();
                renderAccess();
            }
        });
        updateAnalyzeBtnLock();
    }

    function trySubmit(value) {
        const result = activateCode(value);
        const msgEl = document.getElementById('access-msg');
        if (!result.ok) {
            if (msgEl) msgEl.textContent = '❌ ' + result.msg;
            return;
        }
        renderAccess();
    }

    function updateAnalyzeBtnLock() {
        if (canAnalyze()) {
            els.analyzeBtn.classList.remove('locked');
            els.analyzeBtn.textContent = '🍄 香菇爸幫我分析';
        } else {
            els.analyzeBtn.classList.add('locked');
            els.analyzeBtn.textContent = '🔐 請先輸入體驗碼';
        }
    }

    renderAccess();

    // ============== 分析按鈕 ==============
    els.analyzeBtn.addEventListener('click', () => {
        if (!canAnalyze()) {
            accessCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const input = document.getElementById('code-input');
            if (input) input.focus();
            return;
        }
        if (!consumeUse()) {
            renderAccess();
            return;
        }
        analyzeRemote(els.textArea.value);
        renderAccess(); // 更新剩餘次數
    });

    // ============== 分析（改由後端 Worker 運算，資料庫已隱藏） ==============
    const ANALYZER_API = 'https://mushroom-food-analyzer.pupss4897.workers.dev/';

    async function analyzeRemote(rawText){
        const text = (rawText || '').trim();
        els.results.classList.remove('hidden');
        if (!text){
            els.results.innerHTML = '<div class="empty-result">請先輸入或貼上成分文字。</div>';
            return;
        }
        els.results.innerHTML = '<div class="empty-result">🍄 香菇爸分析中…</div>';
        try {
            const d = getAccess();
            const res = await fetch(ANALYZER_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text, code: d ? d.code : '' })
            });
            const data = await res.json();
            if (data.badCode){
                els.results.innerHTML = '<div class="empty-result">體驗碼驗證失敗，請重新輸入體驗碼後再分析。</div>';
                return;
            }
            els.results.innerHTML = data.html || '<div class="empty-result">分析暫時無法使用，請稍後再試。</div>';
            els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e){
            els.results.innerHTML = '<div class="empty-result">😿 連線失敗，請檢查網路後再試一次。</div>';
        }
    }

})();
