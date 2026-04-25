document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const weightSlider = document.getElementById('weight');
    const weightOutput = document.getElementById('weight-output');
    const ageSlider = document.getElementById('age');
    const ageOutput = document.getElementById('age-output');

    const breedSelect = document.getElementById('breed');
    const conditionSelect = document.getElementById('condition');
    const dietSelect = document.getElementById('diet');

    const calcBtn = document.getElementById('calculate-btn');
    const resultsPanel = document.getElementById('results-panel');

    // Result Elements
    const resCalories = document.getElementById('res-calories');
    const resFoodRatio = document.getElementById('res-food-ratio');
    const resWater = document.getElementById('res-water');
    const resWaterTip = document.getElementById('res-water-tip');
    const resBreedNotes = document.getElementById('res-breed-notes');
    const resParentNote = document.getElementById('res-parent-note');

    // --- Initialize Sliders ---
    function syncSlider(slider, output) {
        output.textContent = parseFloat(slider.value).toFixed(1);
        slider.addEventListener('input', (e) => {
            output.textContent = parseFloat(e.target.value).toFixed(1);
        });
    }
    syncSlider(weightSlider, weightOutput);
    syncSlider(ageSlider, ageOutput);

    // --- Breed Database ---
    const breedData = {
        'none': {
            notes: '米克斯 (一般家貓) 基因庫豐富通常較為健康，但仍需注意隨著年齡增長的老化照護。',
            waterTip: '家貓對水源乾淨度很敏感，建議家中設置多處流動飲水機。'
        },
        'american_shorthair': {
            notes: '美國短毛貓體格強健、性格溫和。由於天生活潑好動但也容易發胖，需控制飲食熱量，並提供足夠的運動空間與優質蛋白質。',
            waterTip: '多數美短不會排斥水，可以使用寬口徑陶瓷碗或水質新鮮的活水機。'
        },
        'british_shorthair': {
            notes: '英國短毛貓骨架大且易胖，心血管與關節負擔較大。強烈建議嚴格控制碳水化合物攝取，並維持標準體態。',
            waterTip: '如果英短不愛喝水，可以在主食罐中添加溫水（1:0.5 比例）來騙水。'
        },
        'exotic_shorthair': {
            notes: '異國短毛貓(加菲貓)因扁臉短鼻，進食與呼吸比較費力，也容易有淚腺問題與多囊性腎病(PKD)風險，必須嚴格控管體重與水分攝取。',
            waterTip: '為避免扁臉吃喝弄髒下巴或增加鬍鬚壓力，建議使用較平淺的專屬水盤。'
        },
        'persian': {
            notes: '波斯貓由於短鼻扁臉，進食與喝水相對費力。且有多囊性腎病 (PKD) 的好發風險，預防腎衰竭及維持每日水分攝取是終生首要任務。',
            waterTip: '建議使用較淺且廣口的陶瓷水碗，避免弄濕下巴與鬍鬚壓力。'
        },
        'ragdoll': {
            notes: '布偶貓屬於大型貓種，發育期較長（可達3-4年）。腸胃相對較弱，建議挑選低敏、好消化的蛋白質來源，並適時補充腸道益生菌。',
            waterTip: '大型長毛貓容易有泌尿道隱患，確保每日水分達標非常重要。'
        },
        'maine_coon': {
            notes: '緬因貓為巨型貓，心肺肥大症 (HCM) 與髖關節發育不良風險較高。需要高比例的優質動物蛋白來支撐龐大骨架與肌肉，絕對要避免過重。',
            waterTip: '牠們通常喜歡玩水！可以使用較大容量或有瀑布水流的飲水機吸引牠們。'
        },
        'russian_blue': {
            notes: '俄羅斯藍貓肌肉發達且體態優雅，但結紮後代謝較慢，需嚴格控管熱量避免過度肥胖。高品質肉類能維持其標誌性的銀藍毛色。',
            waterTip: '俄藍生性極度敏感，建議於家中不受打擾的安靜角落放置飲水機。'
        },
        'siamese': {
            notes: '暹羅貓活動量大、代謝快，個性非常聰明且多話。對環境與飲食改變較為敏感，部分容易有腸胃敏感問題，需注重飲食成分單純。',
            waterTip: '暹羅貓喜歡新鮮流動的水，建議每1-2天更換活水機並定期清洗馬達。'
        },
        'scottish_fold': {
            notes: '蘇格蘭摺耳貓有遺傳性骨骼軟骨發育不良(SFOCD)的風險，關節容易疼痛。除了絕對控制體重減輕關節負擔，可適度考慮補充關節保養品。',
            waterTip: '注意水碗的高度，若關節不舒服可能會減少牠們低頭喝水的意願。'
        },
        'sphynx': {
            notes: '斯芬克斯無毛貓因沒有被毛保溫，新陳代謝極快，比一般貓咪需要更多的熱量來維持體溫（高出約1.5倍）。並容易有心室肥大(HCM)與皮膚油脂問題。',
            waterTip: '對溫度敏感，冬天的時候可以提供「微溫」的飲水，能大幅增加喝水量。'
        },
        'munchkin': {
            notes: '曼赤肯(短腿貓)因為腿短脊椎受力大，嚴禁肥胖以免引發椎間盤與關節病變。請選擇優質蛋白質來維持足夠的背部肌肉量支撐骨骼。',
            waterTip: '請務必留意水碗高度，選擇較低或有斜角的飲水器，讓牠們能輕鬆喝水。'
        },
        'bengal': {
            notes: '孟加拉豹貓充滿野性與活力，運動量極大！需要非常高比例的優質動物性蛋白質來維持牠們的肌肉爆發力與狂野的豹紋毛皮。',
            waterTip: '許多豹貓極度愛水甚至會在水盆裡玩！建議準備穩固、不易被打翻的重型水盆。'
        },
        'norwegian_forest': {
            notes: '挪威森林貓體型巨大且發育期較長，披毛濃密，需注意毛球問題。同時這類大型貓種也容易有心肌肥大(HCM)等心血管隱患。',
            waterTip: '大型貓需要大量水分，建議在家中不同房間配置多個大容量飲水機。'
        },
        'abyssinian': {
            notes: '阿比西尼亞貓極度好動聰明，宛如貓界小狗。遺傳上易有丙酮酸激酶缺乏症（PK Def）導致貧血，需提供高營養價值的原生食物。',
            waterTip: '好奇心重！可以使用設計具趣味性或像是水龍頭滴水的湧泉式飲水機。'
        },
        'somali': {
            notes: '索馬利貓為阿比西尼亞的長毛版，同樣極具活力。要注意牙周預防與腸胃敏感，定期梳毛並補充排毛措施減少腸道阻塞。',
            waterTip: '跟阿比一樣聰明，常喜歡用手撈水喝，水碗周遭可鋪設矽膠防水墊。'
        },
        'siberian': {
            notes: '西伯利亞貓是來自寒冷地帶的大型自然貓種，唾液中致敏蛋白(Fel d 1)普遍較低。成長緩慢且活動量大，需要非常充足的蛋白質。',
            waterTip: '喜歡喝活水，有時候也喜歡玩冰塊！夏天可在水碗丟入一兩顆冰塊吸引注意力。'
        },
        'burmese': {
            notes: '緬甸貓肌肉扎實且體重意外地「沉重」，喜歡與人緊密互動。較容易有低血鉀與後天糖尿病傾向，建議控制精緻碳水化合物的攝取。',
            waterTip: '高度黏人，飲水碗可以放置在主人常待的客廳或書房區域。'
        },
        'birman': {
            notes: '伯曼貓(神聖貓)性格溫文儒雅，體態結實。遺傳上可能有較高的慢性腎病風險，從年輕時就要養成多喝水的好習慣。',
            waterTip: '個性從容不迫，喜歡安靜、潔淨無異味的飲水角落。'
        },
        'oriental_shorthair': {
            notes: '東方短毛貓體態纖細修長，與暹羅貓血緣近。容易有牙齒與視網膜問題(PRA)。因為體脂肪極低，冬天要注意保暖並給予易吸收之蛋白。',
            waterTip: '對水質挑剔，稍微有一點口水味或灰塵可能就不願再喝，需勤換水。'
        },
        'british_longhair': {
            notes: '英國長毛貓同時繼承了英短的易胖體質與波斯的長毛好靜。除了嚴防肥胖造成的心血管問題，強烈建議定期補充排毛粉或種植貓草。',
            waterTip: '長毛在喝水時容易沾濕胸前，推薦使用浮力水碗或開口適中的專用飲水器。'
        }
    };

    // --- Calculation Logic ---
    calcBtn.addEventListener('click', () => {
        const weight = parseFloat(weightSlider.value);
        const age = parseFloat(ageSlider.value);
        const factor = parseFloat(conditionSelect.value);
        const breedKey = breedSelect.value;
        const diet = dietSelect.value;

        // 1. Calculate Calories (RER & DER)
        // RER (Resting Energy Requirement) = 70 * (Weight in kg)^0.75
        const rer = 70 * Math.pow(weight, 0.75);
        // DER (Daily Energy Requirement) = RER * Factor
        const der = Math.round(rer * factor);

        // 2. Calculate Water Suggestion
        // roughly 50ml-60ml per kg, or simply 1ml per kcal of DER
        const waterNeed = Math.round(weight * 50); // Using 50ml per kg as a baseline

        // 3. Process Diet Ratios
        let foodRatioText = '';
        if (diet === 'wet') {
            foodRatioText = '建議以濕食(罐裝或生食)為主，約佔 90%，乾糧 10% 作為零食或磨牙。水分主要已由食物提供。';
        } else if (diet === 'dry') {
            foodRatioText = '建議將每日乾糧分為 3-4 餐。因乾糧水分極低(<10%)，強烈建議誘使貓咪多喝水以免增加腎臟負擔。';
        } else {
            foodRatioText = '建議早晚提供高蛋白濕食，睡前提供高品質乾糧，熱量比例約為 濕食 60% : 乾糧 40%。';
        }

        // 4. Update UI Elements
        resCalories.textContent = der;
        resWater.textContent = waterNeed;
        resFoodRatio.textContent = foodRatioText;

        const breedInfo = breedData[breedKey] || breedData['none'];
        resBreedNotes.innerHTML = `${breedInfo.notes}<br><br><span style="color: var(--accent-red); font-weight: 600;">🍄 香菇爸特別推薦：</span>針對${breedInfo.name}的體質與腸胃狀況，建議可以搭配我們的藍藻益生菌，讓腸道保持好菌平衡，不僅幫助吸收營養，也能提升保護力喔！`;

        // Water tip processing
        let wTip = `目標每日水分攝取約 ${waterNeed} ml。`;
        if (diet === 'wet') {
            wTip += `由於以濕食為主，已能從食物獲取約 ${Math.round(waterNeed * 0.7)} ml 水分。剩餘缺口建議在濕食中額外加水，或者佈置飲水點。`;
        } else if (diet === 'dry') {
            wTip += `由於以乾飼料為主，貓咪必須"主動"喝足 ${Math.round(waterNeed * 0.9)} ml 才能達標！極度建議轉為半濕食，或是嘗試肉湯誘水。`;
        }
        wTip += ` ${breedInfo.waterTip}`;
        resWaterTip.textContent = wTip;

        // Parent Note
        let parentText = `${age} 歲的貓咪正處於`;
        if (age < 1) parentText += `黃金發育期，充足的營養與蛋白質是健康長大的基石！`;
        else if (age >= 1 && age < 7) parentText += `最迷人的壯年期，透過精確的營養規劃與濕食為主的飲食習慣，能有效預防中老年常見的泌尿與腎臟問題。`;
        else parentText += `熟齡階段，器官逐漸老化，定期健檢並給予易吸收、低負擔的飲食，是你對牠最溫暖的守護！`;
        resParentNote.textContent = parentText;

        // Reveal the results panel
        resultsPanel.classList.remove('hidden');

        // Smooth scroll to results
        setTimeout(() => {
            resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

});
