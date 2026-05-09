// 飼料成分分析器 - 純前端 OCR + 成分匹配
// 依賴:cat_ingredients_db.js (INGREDIENTS_DB), Tesseract.js (CDN)

(function() {
    const els = {
        fileInput: document.getElementById('photo-input'),
        cameraBtn: document.getElementById('btn-camera'),
        uploadBtn: document.getElementById('btn-upload'),
        previewWrap: document.getElementById('preview-wrap'),
        previewImg: document.getElementById('preview-img'),
        clearBtn: document.getElementById('btn-clear'),
        ocrProgressWrap: document.getElementById('ocr-progress-wrap'),
        ocrProgressBar: document.getElementById('ocr-progress-bar'),
        ocrProgressLabel: document.getElementById('ocr-progress-label'),
        textArea: document.getElementById('ingredient-text'),
        analyzeBtn: document.getElementById('btn-analyze'),
        results: document.getElementById('analyze-results'),
        sample1Btn: document.getElementById('btn-sample1'),
        sample2Btn: document.getElementById('btn-sample2'),
    };

    // ============== 圖片上傳 ==============
    els.cameraBtn.addEventListener('click', () => {
        els.fileInput.setAttribute('capture', 'environment');
        els.fileInput.click();
    });
    els.uploadBtn.addEventListener('click', () => {
        els.fileInput.removeAttribute('capture');
        els.fileInput.click();
    });
    els.fileInput.addEventListener('change', handleFile);
    els.clearBtn.addEventListener('click', () => {
        els.previewWrap.classList.add('hidden');
        els.fileInput.value = '';
    });
    els.analyzeBtn.addEventListener('click', () => analyze(els.textArea.value));

    els.sample1Btn.addEventListener('click', () => {
        els.textArea.value = '去骨雞肉、雞肉粉、糙米、雞油、鯡魚粉、蔓越莓、牛磺酸、葡萄糖胺、軟骨素、益生菌、混合維生素E、迷迭香萃取';
    });
    els.sample2Btn.addEventListener('click', () => {
        els.textArea.value = '玉米、家禽副產品、小麥麩、動物脂肪、大豆粉、玉米麩質、BHA、BHT、焦糖色素、鹽、食用紅色40號、糖';
    });

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        els.previewImg.src = url;
        els.previewWrap.classList.remove('hidden');
        runOCR(file);
    }

    // ============== OCR ==============
    async function runOCR(file) {
        if (typeof Tesseract === 'undefined') {
            alert('OCR 引擎尚未載入完成,請稍候再試一次。');
            return;
        }
        els.ocrProgressWrap.classList.remove('hidden');
        els.ocrProgressBar.style.width = '0%';
        els.ocrProgressLabel.textContent = '初始化 OCR...';
        els.textArea.value = '';

        try {
            const { data } = await Tesseract.recognize(file, 'chi_tra+eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const pct = Math.round(m.progress * 100);
                        els.ocrProgressBar.style.width = pct + '%';
                        els.ocrProgressLabel.textContent = `辨識中... ${pct}%`;
                    } else if (m.status === 'loading language traineddata') {
                        els.ocrProgressLabel.textContent = '下載中文辨識模型(首次需 1~2 分鐘)...';
                    } else if (m.status === 'initializing api') {
                        els.ocrProgressLabel.textContent = '準備辨識引擎...';
                    }
                }
            });
            const text = (data.text || '').trim();
            els.textArea.value = text;
            els.ocrProgressLabel.textContent = `✅ 辨識完成,共 ${text.length} 字。請檢查並修正錯誤後按下「分析」。`;
            els.ocrProgressBar.style.width = '100%';
        } catch (err) {
            console.error(err);
            els.ocrProgressLabel.textContent = '⚠️ 辨識失敗,請手動輸入或重新上傳。';
        }
    }

    // ============== 成分匹配 ==============
    function analyze(rawText) {
        const text = (rawText || '').trim();
        if (!text) {
            els.results.innerHTML = '<div class="empty-result">請先上傳照片或輸入成分文字。</div>';
            els.results.classList.remove('hidden');
            return;
        }

        // 將所有 alias 攤平,長度由長到短(避免「米」吃掉「玉米」)
        const allAliases = [];
        INGREDIENTS_DB.forEach(ing => {
            ing.aliases.forEach(a => allAliases.push({ alias: a, ing }));
        });
        allAliases.sort((a, b) => b.alias.length - a.alias.length);

        const lower = text.toLowerCase();
        let work = lower;
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

        renderResults(matched, text);
    }

    function renderResults(matched, originalText) {
        els.results.classList.remove('hidden');

        if (matched.length === 0) {
            els.results.innerHTML = `
                <div class="empty-result">
                    😿 沒有辨識到資料庫裡的成分。<br>
                    <small>可能 OCR 結果有誤,或是這款飼料的成分超出目前資料庫範圍。請手動修正文字後再試一次。</small>
                </div>`;
            return;
        }

        const buckets = { good: [], neutral: [], warn: [], bad: [] };
        matched.forEach(m => buckets[m.level].push(m));

        const sectionMeta = {
            good:    { label: '✅ 推薦',     desc: '對貓咪有益的好成分',           color: 'good' },
            neutral: { label: '⚪ 中性',     desc: '無害但營養價值較有限',         color: 'neutral' },
            warn:    { label: '⚠️ 需注意',  desc: '可能引起過敏或品質模糊',       color: 'warn' },
            bad:     { label: '🚫 建議避免', desc: '對貓咪有疑慮的成分',           color: 'bad' }
        };

        const order = ['bad', 'warn', 'good', 'neutral']; // 重要的先看
        let html = `
            <div class="result-summary">
                <h3>📊 分析結果</h3>
                <div class="summary-pills">
                    <span class="pill pill-good">推薦 ${buckets.good.length}</span>
                    <span class="pill pill-neutral">中性 ${buckets.neutral.length}</span>
                    <span class="pill pill-warn">注意 ${buckets.warn.length}</span>
                    <span class="pill pill-bad">避免 ${buckets.bad.length}</span>
                </div>
                <p class="summary-note">共辨識出 <strong>${matched.length}</strong> 項已知成分。資料庫持續擴充中,未列出的成分不代表沒問題。</p>
            </div>`;

        order.forEach(key => {
            const items = buckets[key];
            if (items.length === 0) return;
            const meta = sectionMeta[key];
            html += `
                <div class="result-section section-${meta.color}">
                    <div class="result-section-head">
                        <h4>${meta.label} <span class="count-badge">${items.length}</span></h4>
                        <p>${meta.desc}</p>
                    </div>
                    <div class="ingredient-list">
                        ${items.map(renderIngredientCard).join('')}
                    </div>
                </div>`;
        });

        // 整體建議
        html += renderOverallAdvice(buckets);

        els.results.innerHTML = html;
        els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderIngredientCard(ing) {
        return `
            <div class="ing-card ing-${ing.level}">
                <div class="ing-head">
                    <div class="ing-name">${ing.name}</div>
                    <div class="ing-cat">${ing.category}</div>
                </div>
                ${ing.pros ? `<div class="ing-line"><span class="ing-label good">✓ 優點</span><span>${ing.pros}</span></div>` : ''}
                ${ing.cons ? `<div class="ing-line"><span class="ing-label bad">! 注意</span><span>${ing.cons}</span></div>` : ''}
            </div>`;
    }

    function renderOverallAdvice(buckets) {
        const bad = buckets.bad.length;
        const warn = buckets.warn.length;
        const good = buckets.good.length;

        let verdict, emoji, cls;
        if (bad >= 2) {
            verdict = '這款配方含有多項<strong>建議避免</strong>的成分,香菇爸不太推薦長期當主食。';
            emoji = '🚫'; cls = 'verdict-bad';
        } else if (bad === 1) {
            verdict = '出現了 1 個建議避免的成分,可以拿這個給獸醫或店家確認來源,有更好的選擇就換吧。';
            emoji = '⚠️'; cls = 'verdict-warn';
        } else if (warn >= 3) {
            verdict = '有不少需要注意的成分(常見過敏原或品質模糊),不一定不好,但有更乾淨的選擇可以考慮。';
            emoji = '🤔'; cls = 'verdict-warn';
        } else if (good >= 3) {
            verdict = '看起來是不錯的配方!有多項對貓咪有益的成分,搭配輪換食用更佳。';
            emoji = '🎉'; cls = 'verdict-good';
        } else {
            verdict = '配方還行,但亮點不算多。建議多看品牌的營養比例(蛋白質/脂肪/灰分)再決定。';
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
})();
