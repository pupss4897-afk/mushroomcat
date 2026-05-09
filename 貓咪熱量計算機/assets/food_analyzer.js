// 飼料成分分析器
// 依賴:cat_ingredients_db.js (INGREDIENTS_DB, FUNCTION_META, PREMIUM_FUNCTIONS)

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
        els.textArea.value = '成分:脫水家禽蛋白、米、植物分離蛋白、小麥、玉米、動物脂肪、小麥麵粉、水解動物蛋白、蔬菜纖維、礦物質、酵母及酵母提取物、玉米麩質、甜菜漿、大豆油、魚油、洋車前子及殼、水解酵母(甘露寡糖來源)、金盞花';
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

    // ============== 分析按鈕 ==============
    els.analyzeBtn.addEventListener('click', () => analyze(els.textArea.value));

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
        const isHighEnd = premiumFnsHit.length >= 3;

        let html = '';

        // ===== Hero:整合保健 (僅高端配方) =====
        if (isHighEnd && levelBuckets.bad.length === 0) {
            html += renderHero(premiumFnsHit, premiumIngsCount);
        }

        // ===== 前 5 項體檢卡 =====
        if (topAnalysis.length > 0) {
            html += renderTopPositionCard(topAnalysis);
        }

        // ===== 腸道敏感風險 =====
        if (gutRisk.risk !== 'low' && gutRisk.reasons.length > 0) {
            html += renderGutRiskCard(gutRisk);
        }

        // ===== 摘要 =====
        html += `
            <div class="result-summary">
                <h3>📊 整體分析</h3>
                <div class="summary-pills">
                    <span class="pill pill-good">推薦 ${levelBuckets.good.length}</span>
                    <span class="pill pill-neutral">中性 ${levelBuckets.neutral.length}</span>
                    <span class="pill pill-warn">注意 ${levelBuckets.warn.length}</span>
                    <span class="pill pill-bad">避免 ${levelBuckets.bad.length}</span>
                </div>
                <p class="summary-note">共辨識出 <strong>${matched.length}</strong> 項已知成分。資料庫持續擴充中,未列出的成分不代表沒問題。</p>
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

        if (totalFlag >= 2) {
            cardClass = 'top-bad';
            takeaway = `🚩 <strong>前 ${topAnalysis.length} 項有 ${totalFlag} 個紅旗</strong> — 這代表這款其實是<strong>「澱粉/植物為主」</strong>的飼料,只是把肉(或模糊蛋白)放在最前位給人看。對肉食性的貓來說,這種配方蛋白質吸收率低、容易引起過敏。`;
        } else if (totalGood >= topAnalysis.length - 1 && counts.flag === 0) {
            cardClass = 'top-good';
            takeaway = `✅ <strong>前 ${topAnalysis.length} 項主要是指明物種的肉類</strong> — 這正是肉食性貓咪該有的主食結構,蛋白吸收率與飽足感都會很好。`;
        } else {
            cardClass = 'top-mixed';
            takeaway = `⚠️ 前 ${topAnalysis.length} 項<strong>有亮點也有疑慮</strong> — 不算糟,但離「全肉前位」還有距離,可以拿同價位的其他選項比一比。`;
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
            verdict = `我自己比較在意的是,這款<strong>前位成分以澱粉或模糊蛋白為主</strong>${gutRisk.risk === 'high' ? ',加上腸道風險偏高' : ''}。對肉食性的貓咪來說,這種結構蛋白吸收率比較低。如果主子已經有軟便、皮膚癢、淚痕等狀況,可以考慮換更乾淨的配方試試。`;
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
