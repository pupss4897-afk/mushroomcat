// 飼料成分分析器
// 依賴:cat_ingredients_db.js (INGREDIENTS_DB, FUNCTION_META, PREMIUM_FUNCTIONS)

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
                            <input id="code-input" type="text" placeholder="輸入體驗碼..." autocomplete="off" maxlength="32">
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
        analyze(els.textArea.value);
        renderAccess(); // 更新剩餘次數
    });

    // ============== 解析成分順序(法規重點)==============
    function parseIngredientOrder(rawText) {
        let text = (rawText || '').trim();
        // 移除前綴 "成分:" / "Ingredients:" / "原料:"
        text = text.replace(/^[\s]*(成分|原料|ingredients?)[\s::︰]*/i, '');
        // 在「營養成分」「保證分析」「Guaranteed Analysis」「能量值」處截斷
        const stop = text.search(/(營養成分|營養標示|保證分析|guaranteed analysis|能量值|kcal|蛋白質\s*\d|粗蛋白)/i);
        if (stop > 0) text = text.slice(0, stop);

        // 依「、, ,」分割,但忽略括號內的分隔符
        const items = [];
        let depth = 0, current = '';
        for (const c of text) {
            if (c === '(' || c === '(' || c === '[' || c === '【') depth++;
            else if (c === ')' || c === ')' || c === ']' || c === '】') depth = Math.max(0, depth - 1);

            if (depth === 0 && (c === '、' || c === ',' || c === ',' || c === ';' || c === ';')) {
                const cleaned = current.trim().replace(/[*◎○◯\s]+$/, '').replace(/^[*\s]+/, '');
                if (cleaned) items.push(cleaned);
                current = '';
            } else {
                current += c;
            }
        }
        const last = current.trim().replace(/[*◎○◯\s。.]+$/, '');
        if (last) items.push(last);
        return items;
    }

    // 找最佳匹配的 DB 成分(用於前位體檢)
    function findIngredientMatch(itemText) {
        const lower = itemText.toLowerCase();
        let best = null;
        INGREDIENTS_DB.forEach(ing => {
            ing.aliases.forEach(a => {
                const al = a.toLowerCase();
                if (lower.includes(al)) {
                    if (!best || al.length > best.aliasLen) {
                        best = { ing, aliasLen: al.length };
                    }
                }
            });
        });
        return best ? best.ing : null;
    }

    // 對「前位」適合度判斷
    function topPositionVerdict(ing) {
        if (!ing) return { v: 'unknown', label: '? 未收錄', note: '資料庫沒有這個成分,請手動判斷。' };
        if (ing.level === 'bad') return { v: 'flag', label: '🚨 應避免', note: '不該出現在飼料中' };

        const fn = ing.function;
        const vague = ing.isVague;

        if (fn === 'protein-meat' && !vague) {
            return { v: 'good', label: '✅ 達標', note: '指明物種的肉類,前位首選' };
        }
        if (fn === 'fat-omega') {
            return { v: 'good', label: '✅ 達標', note: '優質動物 Omega-3 來源' };
        }
        if (fn === 'protein-absorb') {
            return { v: 'good', label: '✅ 達標', note: '高吸收動物蛋白,前位 OK' };
        }
        if (fn === 'protein-meat' && vague) {
            return { v: 'vague', label: '⚠️ 模糊', note: '未指明物種/處理過,品質難判斷' };
        }
        if (fn === 'fat' && vague) {
            return { v: 'vague', label: '⚠️ 模糊', note: '未指明油脂來源' };
        }
        if (fn === 'carb') {
            return { v: 'flag', label: '🚩 紅旗', note: '貓是肉食動物,前位該是肉而非碳水' };
        }
        if (fn === 'fiber') {
            return { v: 'flag', label: '🚩 紅旗', note: '纖維出現在前位,代表肉的比例偏低' };
        }
        if (fn === 'fat') {
            return { v: 'supp', label: '🟡 油脂', note: '油脂在前位算可接受,但量不該超過肉' };
        }
        // 保健類:gut, skin, joint, urinary, neural, amino, vit-min
        return { v: 'supp', label: '💊 保健/添加', note: '保健成分,通常後位即可' };
    }

    // ============== 腸道敏感風險評估 ==============
    function analyzeGutRisk(matched) {
        const allergenNames = ['玉米', '小麥', '大豆', '豌豆'];
        const allergens = matched.filter(m => allergenNames.includes(m.name));
        const vague = matched.filter(m => m.isVague && (m.function === 'protein-meat' || m.function === 'fat'));
        const hasGut = matched.some(m => m.function === 'gut');

        let risk = 'low';
        const reasons = [];

        if (allergens.length >= 2) {
            reasons.push(`含有 <strong>${allergens.length}</strong> 種常見過敏原:${allergens.map(a => a.name).join('、')}`);
            risk = 'high';
        } else if (allergens.length === 1) {
            reasons.push(`含有過敏原:<strong>${allergens[0].name}</strong>`);
            risk = 'medium';
        }

        if (vague.length >= 2) {
            reasons.push(`有 <strong>${vague.length}</strong> 個來源模糊的蛋白/油脂(${vague.map(v => v.name).join('、')})`);
            risk = 'high';
        } else if (vague.length === 1) {
            reasons.push(`有來源不明的蛋白/油脂:<strong>${vague[0].name}</strong>`);
            if (risk === 'low') risk = 'medium';
        }

        if (!hasGut && (allergens.length > 0 || vague.length > 0)) {
            reasons.push('沒有任何<strong>益生菌、益生元或消化酵素</strong>來保護腸道');
            if (risk === 'medium') risk = 'high';
        }

        return { risk, reasons, allergens, vague, hasGut };
    }

    // ============== 主成分匹配 ==============
    function analyze(rawText) {
        const text = (rawText || '').trim();
        if (!text) {
            els.results.innerHTML = '<div class="empty-result">請先輸入或貼上成分文字。</div>';
            els.results.classList.remove('hidden');
            return;
        }

        // 1) 解析成分順序
        const orderedItems = parseIngredientOrder(text);

        // 2) 全文匹配(用於整體分析、功能分組)
        const allAliases = [];
        INGREDIENTS_DB.forEach(ing => {
            ing.aliases.forEach(a => allAliases.push({ alias: a, ing }));
        });
        allAliases.sort((a, b) => b.alias.length - a.alias.length);

        let work = text.toLowerCase();
        const seen = new Set();
        const matched = [];
        for (const { alias, ing } of allAliases) {
            const a = alias.toLowerCase();
            if (work.includes(a) && !seen.has(ing.name)) {
                seen.add(ing.name);
                matched.push({ ...ing, foundAs: alias });
                work = work.split(a).join('░'.repeat(a.length));
            }
        }

        // 3) 前 5 項體檢
        const topN = Math.min(5, orderedItems.length);
        const topAnalysis = orderedItems.slice(0, topN).map((itemText, idx) => {
            const ing = findIngredientMatch(itemText);
            const verdict = topPositionVerdict(ing);
            return { idx: idx + 1, itemText, ing, verdict };
        });

        // 4) 腸道風險
        const gutRisk = analyzeGutRisk(matched);

        renderResults(matched, topAnalysis, gutRisk);
    }

    function renderResults(matched, topAnalysis, gutRisk) {
        els.results.classList.remove('hidden');

        if (matched.length === 0 && topAnalysis.length === 0) {
            els.results.innerHTML = `
                <div class="empty-result">
                    😿 沒有辨識到資料庫裡的成分。<br>
                    <small>可能成分超出目前資料庫範圍,或文字格式特殊。可以試試「高品質配方範例」看看效果。</small>
                </div>`;
            return;
        }

        const levelBuckets = { good: [], neutral: [], warn: [], bad: [] };
        matched.forEach(m => levelBuckets[m.level].push(m));

        const fnBuckets = {};
        matched.forEach(m => {
            const f = m.function || 'misc';
            (fnBuckets[f] = fnBuckets[f] || []).push(m);
        });

        const premiumFnsHit = PREMIUM_FUNCTIONS.filter(f => fnBuckets[f] && fnBuckets[f].length > 0);
        const premiumIngsCount = matched.filter(m => m.isPremium).length;

        // 前 5 項判讀:必須達標才能算高端
        const top5Flags  = topAnalysis.filter(t => t.verdict.v === 'flag').length;
        const top5Vague  = topAnalysis.filter(t => t.verdict.v === 'vague').length;
        const top5Good   = topAnalysis.filter(t => t.verdict.v === 'good').length;

        // 真高端:前位達標 + 多種保健 + 沒有 bad
        const isHighEnd = premiumFnsHit.length >= 3
            && top5Good >= 3
            && top5Flags === 0
            && levelBuckets.bad.length === 0;

        // 偽高端:有保健但前位疑慮 — 「澱粉+灑保健粉」
        const isFakeHighEnd = !isHighEnd
            && premiumFnsHit.length >= 2
            && top5Flags >= 2;

        let html = '';

        // ===== Hero:真整合配方 (前位必須達標) =====
        if (isHighEnd) {
            html += renderHero(premiumFnsHit, premiumIngsCount);
        }

        // ===== 前 5 項體檢卡 =====
        if (topAnalysis.length > 0) {
            html += renderTopPositionCard(topAnalysis);
        }

        // ===== 偽高端對照警示(關鍵新增) =====
        if (isFakeHighEnd) {
            html += renderFakeHighEndCard(premiumFnsHit, premiumIngsCount, top5Flags, top5Vague);
        }

        // ===== 腸道敏感風險 =====
        if (gutRisk.risk !== 'low' && gutRisk.reasons.length > 0) {
            html += renderGutRiskCard(gutRisk);
        }

        // ===== 摘要 =====
        const summaryHint = (top5Flags >= 2)
            ? `<strong style="color: var(--accent-red);">⚠️ 注意:</strong>下方「推薦」數量是統計所有匹配到的好成分,但<strong>前 5 項紅旗已說明這款主食結構有問題</strong>。優劣判斷請以前 5 項為主。`
            : `共辨識出 <strong>${matched.length}</strong> 項已知成分。資料庫持續擴充中,未列出的成分不代表沒問題。`;

        html += `
            <div class="result-summary">
                <h3>📊 整體分析(全部成分統計)</h3>
                <div class="summary-pills">
                    <span class="pill pill-good">推薦 ${levelBuckets.good.length}</span>
                    <span class="pill pill-neutral">中性 ${levelBuckets.neutral.length}</span>
                    <span class="pill pill-warn">注意 ${levelBuckets.warn.length}</span>
                    <span class="pill pill-bad">避免 ${levelBuckets.bad.length}</span>
                </div>
                <p class="summary-note">${summaryHint}</p>
            </div>`;

        // ===== 應避免區 =====
        if (levelBuckets.bad.length > 0) {
            html += `
                <div class="result-section section-bad">
                    <div class="result-section-head">
                        <h4>🚫 應避免成分 <span class="count-badge">${levelBuckets.bad.length}</span></h4>
                        <p>對貓咪有疑慮的成分,建議避開或更換主食</p>
                    </div>
                    <div class="ingredient-list">${levelBuckets.bad.map(renderIngredientCard).join('')}</div>
                </div>`;
        }

        // ===== 按功能分組 =====
        const fnRenderOrder = [
            'gut', 'skin', 'fat-omega', 'protein-absorb', 'immune', 'neural', 'joint', 'urinary',
            'protein-meat', 'fat', 'carb', 'fiber', 'amino', 'vit-min'
        ];
        fnRenderOrder.forEach(fnKey => {
            const items = fnBuckets[fnKey];
            if (!items || items.length === 0) return;
            const meta = FUNCTION_META[fnKey];
            if (!meta) return;
            html += `
                <div class="result-section section-fn ${meta.premium ? 'section-premium' : ''}">
                    <div class="result-section-head">
                        <h4>${meta.emoji} ${meta.label} <span class="count-badge">${items.length}</span></h4>
                        ${meta.retail ? `<p class="retail-contrast">👉 ${meta.retail}</p>` : ''}
                    </div>
                    <div class="ingredient-list">${items.map(renderIngredientCard).join('')}</div>
                </div>`;
        });

        // ===== 警告區(warn 級別)=====
        if (levelBuckets.warn.length > 0) {
            html += `
                <div class="result-section section-warn">
                    <div class="result-section-head">
                        <h4>⚠️ 需注意項目 <span class="count-badge">${levelBuckets.warn.length}</span></h4>
                        <p>不一定不好,但有更乾淨選擇可考慮</p>
                    </div>
                    <div class="ingredient-list">${levelBuckets.warn.map(renderIngredientCard).join('')}</div>
                </div>`;
        }

        // ===== 香菇爸總評 =====
        html += renderOverallAdvice(levelBuckets, isHighEnd, premiumFnsHit, topAnalysis, gutRisk);

        els.results.innerHTML = html;
        els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ============== Render: 偽高端對照警示 ==============
    function renderFakeHighEndCard(premiumFnsHit, premiumIngsCount, top5Flags, top5Vague) {
        const fnLabels = premiumFnsHit.map(f => FUNCTION_META[f]?.label.replace(/類$/, '')).filter(Boolean).slice(0, 4).join('、');
        return `
            <div class="fake-card">
                <div class="fake-head">
                    <span class="fake-emoji">🎭</span>
                    <h3>表面有保健,但底子不對</h3>
                </div>
                <div class="fake-body">
                    <p class="fake-lede">
                        這款雖然加了 <strong>${premiumIngsCount}</strong> 項保健成分(${fnLabels} 功能都有),
                        看起來像高端配方 — <strong>但前 5 項裡有 ${top5Flags} 個紅旗${top5Vague > 0 ? '、' + top5Vague + ' 個模糊蛋白' : ''}</strong>。
                    </p>
                    <div class="fake-vs">
                        <div class="fake-col fake-col-good">
                            <h5>✅ 真高端配方</h5>
                            <p>前 5 項是<strong>明確物種的肉</strong>,再加保健成分 — 主食結構對,保健只是錦上添花。</p>
                        </div>
                        <div class="fake-col fake-col-bad">
                            <h5>🎭 這款的設計</h5>
                            <p>前 5 項<strong>植物蛋白與澱粉占比偏高</strong>,然後在後面「灑」一些保健粉提高賣相。<strong>主食結構的「比例與排序」沒到位</strong>。</p>
                        </div>
                    </div>
                    <div class="fake-takeaway">
                        🍄 <strong>香菇爸的話:</strong>保健成分當然是好東西,但<strong>不能用來補救前位錯誤的主食結構</strong>。
                        如果只是想補益生菌、魚油,直接買保健品分開吃就好,不用花高價買這種「補健粉灑在澱粉上」的飼料。
                    </div>
                </div>
            </div>`;
    }

    // ============== Render: Hero ==============
    function renderHero(premiumFnsHit, premiumIngsCount) {
        const fnTags = premiumFnsHit.map(f => FUNCTION_META[f]).filter(Boolean)
            .map(m => `<span class="hero-tag">${m.emoji} ${m.label.replace(/類$/, '').replace(/(.+) \/ Omega-3$/, '$1')}</span>`)
            .join('');

        return `
            <div class="hero-card">
                <div class="hero-badge">⭐ 高端整合配方</div>
                <h2>這款配方的高度,不只是肉</h2>
                <p class="hero-sub">而是 <strong>把功能型保健直接整合進主食</strong> — 一般市面上這些通常是分開賣的保健品。</p>
                <div class="hero-tags">${fnTags}</div>
                <div class="hero-foot">
                    📌 偵測到 <strong>${premiumFnsHit.length}</strong> 種保健功能整合,<strong>${premiumIngsCount}</strong> 項高端訊號成分。
                </div>
                <div class="hero-pitch">
                    🧠 <strong>香菇爸的話</strong>:很多品牌只是在「賣飼料」,而高端整合配方比較像「把主食 + 保健打包在一起」 — 你不用再另外買一堆保健粉,腸胃、皮毛、營養吸收、神經代謝都顧到了。
                </div>
            </div>`;
    }

    // ============== Render: 前 5 項體檢 ==============
    function renderTopPositionCard(topAnalysis) {
        const counts = { good: 0, vague: 0, flag: 0, supp: 0, unknown: 0 };
        topAnalysis.forEach(t => counts[t.verdict.v]++);

        let cardClass, takeaway;
        const totalFlag = counts.flag;
        const totalGood = counts.good;

        if (totalFlag >= 3) {
            cardClass = 'top-bad';
            takeaway = `🚩 <strong>前 ${topAnalysis.length} 項有 ${totalFlag} 個紅旗</strong> — 這款主要結構是<strong>植物蛋白與澱粉為主體</strong>。植物蛋白並非「不能吃」,但對肉食性的貓而言,<strong>動物蛋白的氨基酸譜更完整、生物利用率更高</strong>。同價位有更多「前段動物蛋白比例更高」的配方可以挑。`;
        } else if (totalFlag === 2) {
            cardClass = 'top-bad';
            takeaway = `🚩 <strong>前 ${topAnalysis.length} 項有 ${totalFlag} 個紅旗</strong> — 前段雖然有肉類,但也<strong>混入不少植物蛋白與豆類來源</strong>。重點不是「植物蛋白不好」,而是<strong>「比例 + 排序 + 吸收率」</strong>這三件事 — 對肉食性的貓,前段動物蛋白比例越高越合適。`;
        } else if (totalGood >= topAnalysis.length - 1 && counts.flag === 0) {
            cardClass = 'top-good';
            takeaway = `✅ <strong>前 ${topAnalysis.length} 項主要是指明物種的肉類</strong> — 這正是肉食性貓咪該有的主食結構,動物蛋白的氨基酸譜完整、吸收率高。`;
        } else {
            cardClass = 'top-mixed';
            takeaway = `⚠️ 前 ${topAnalysis.length} 項<strong>有亮點也有疑慮</strong> — 不算糟,但離「前段純動物蛋白」還有距離,同價位的其他選項可以比一比。`;
        }

        const stats = [];
        if (counts.good)    stats.push(`<span class="stat stat-good">✅ 達標 ${counts.good}</span>`);
        if (counts.vague)   stats.push(`<span class="stat stat-vague">⚠️ 模糊 ${counts.vague}</span>`);
        if (counts.flag)    stats.push(`<span class="stat stat-flag">🚩 紅旗 ${counts.flag}</span>`);
        if (counts.supp)    stats.push(`<span class="stat stat-supp">💊 保健 ${counts.supp}</span>`);
        if (counts.unknown) stats.push(`<span class="stat stat-supp">? 未收錄 ${counts.unknown}</span>`);

        return `
            <div class="top-card ${cardClass}">
                <div class="top-card-head">
                    <h3>📋 前 ${topAnalysis.length} 項成分體檢</h3>
                    <div class="verdict-stat">${stats.join('')}</div>
                </div>
                <div class="top-law">
                    <strong>📚 法規重點:</strong>依台灣《寵物食品標示應遵行事項》規定,成分必須<strong>由「重量降冪」排列</strong>。
                    意思是:<strong>排在最前面的成分用得最多</strong>,前 3-5 項決定整袋飼料的主體。
                    對<strong>肉食性的貓咪</strong>而言,這幾項最好都是「指明物種的肉類」(如雞肉、鴨肉、鮭魚),而非碳水或植物蛋白。
                </div>
                <div class="top-list">
                    ${topAnalysis.map(t => `
                        <div class="top-item v-${t.verdict.v}">
                            <div class="top-num">${t.idx}</div>
                            <div class="top-text">
                                ${escapeHtml(t.itemText)}
                                <small>${t.verdict.note}</small>
                            </div>
                            <div class="top-verdict">${t.verdict.label}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="top-takeaway">${takeaway}</div>
            </div>`;
    }

    // ============== Render: 腸道風險 ==============
    function renderGutRiskCard(gutRisk) {
        const riskClass = gutRisk.risk === 'high' ? '' : 'risk-medium';
        const riskLabel = gutRisk.risk === 'high' ? '高' : '中';
        const symptoms = gutRisk.risk === 'high' ? [
            '軟便、便便不順、放臭屁',
            '反覆皮膚癢、抓不停',
            '黑眼屎、淚痕',
            '嘔吐毛球頻率變高'
        ] : [
            '偶發軟便',
            '輕微皮膚搔癢',
            '對食物變得挑嘴'
        ];

        const recommendation = gutRisk.risk === 'high'
            ? '建議換成<strong>肉源明確指定品種</strong>(如雞、鴨、鮭魚)、且配方中<strong>內建益生菌或消化酵素</strong>的飼料,並搭配輪換蛋白源。'
            : '可以觀察主子吃完後的便便、皮膚狀況再決定要不要換糧。如果有腸胃保健需求,另外補一點益生菌也行。';

        return `
            <div class="gut-risk-card ${riskClass}">
                <div class="gut-risk-head">
                    <span class="icon">${gutRisk.risk === 'high' ? '🚨' : '⚠️'}</span>
                    <h3>🦠 腸道敏感風險評估 <span class="level-badge">${riskLabel}</span></h3>
                </div>
                <div class="gut-risk-grid">
                    <div class="gut-risk-block">
                        <h5>🔍 為什麼有風險</h5>
                        <ul>
                            ${gutRisk.reasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="gut-risk-block">
                        <h5>🐾 腸胃敏感的貓可能出現</h5>
                        <ul>
                            ${symptoms.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="gut-risk-rec">
                    💡 <strong>香菇爸建議:</strong>${recommendation}
                </div>
            </div>`;
    }

    function renderIngredientCard(ing) {
        return `
            <div class="ing-card ing-${ing.level}">
                <div class="ing-head">
                    <div class="ing-name">${ing.isPremium ? '⭐ ' : ''}${ing.name}</div>
                    <div class="ing-cat">${ing.category}</div>
                </div>
                ${ing.pros ? `<div class="ing-line"><span class="ing-label good">✓ 優點</span><span>${ing.pros}</span></div>` : ''}
                ${ing.cons ? `<div class="ing-line"><span class="ing-label bad">! 注意</span><span>${ing.cons}</span></div>` : ''}
            </div>`;
    }

    function renderOverallAdvice(buckets, isHighEnd, premiumFnsHit, topAnalysis, gutRisk) {
        const bad = buckets.bad.length;
        const warn = buckets.warn.length;
        const good = buckets.good.length;
        const flagCount = topAnalysis.filter(t => t.verdict.v === 'flag').length;

        let verdict, emoji, cls;

        if (flagCount >= 2 || gutRisk.risk === 'high') {
            verdict = (flagCount >= 3)
                ? `我自己比較在意的是,這款<strong>前段以植物蛋白與澱粉為主體</strong>${gutRisk.risk === 'high' ? ',加上腸道風險偏高' : ''}。植物蛋白並非完全不能吃,但對肉食性的貓而言,<strong>動物蛋白的吸收率與氨基酸完整度都更合適</strong>。同價位有更多前段動物蛋白比例高的配方可以挑。`
                : `我自己比較在意的是,這款<strong>前段雖有肉類,但混入不少植物蛋白與豆類來源</strong>${gutRisk.risk === 'high' ? ',加上腸道風險偏高' : ''}。問題不是「植物蛋白不好」,而是「<strong>比例 + 排序 + 吸收率</strong>」這三件事 — 對肉食性的貓,前段動物蛋白越多越合適。`;
            emoji = '🚩'; cls = 'verdict-bad';
        } else if (isHighEnd && bad === 0) {
            verdict = `這款已經達到<strong>「主食保健一體化」</strong>的等級 — 涵蓋 ${premiumFnsHit.length} 種保健功能,前位成分達標。如果不是處方需求,這已經是台灣可買到的高水準配方,香菇爸自己會放心給主子吃。`;
            emoji = '🎖️'; cls = 'verdict-good';
        } else if (bad >= 2) {
            verdict = '我自己比較在意的是,這款含有多項<strong>容易引起爭議的成分</strong>。倒不是說「一定不好」,但同價位有更乾淨的選擇可以挑。';
            emoji = '⚠️'; cls = 'verdict-bad';
        } else if (bad === 1) {
            verdict = '出現了 1 個比較有疑慮的成分,可以拿這個給獸醫或店家確認來源,有同價位更乾淨的選擇就換吧。';
            emoji = '⚠️'; cls = 'verdict-warn';
        } else if (warn >= 3 && good < 4) {
            verdict = '有不少<strong>需要注意</strong>的成分(常見過敏原或品質模糊),不一定不好,但有更乾淨的選擇可以考慮。我自己會比較在意這幾項。';
            emoji = '🤔'; cls = 'verdict-warn';
        } else if (good >= 3) {
            verdict = '看起來是不錯的配方!有多項對貓咪有益的成分,搭配蛋白源輪換食用會更好。';
            emoji = '🎉'; cls = 'verdict-good';
        } else {
            verdict = '配方還行,但亮點不算多。建議多看品牌的營養比例(蛋白質/脂肪/灰分)、含水量、是否符合 AAFCO 全齡標準再決定。';
            emoji = '🍄'; cls = 'verdict-neutral';
        }

        return `
            <div class="overall-verdict ${cls}">
                <div class="verdict-emoji">${emoji}</div>
                <div class="verdict-text">
                    <h4>香菇爸總評</h4>
                    <p>${verdict}</p>
                    <small>※ 此分析僅供參考。最終選擇請考量主子個別狀況、過敏史與獸醫建議。</small>
                </div>
            </div>`;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
})();
