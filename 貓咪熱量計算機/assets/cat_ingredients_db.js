// 貓咪飼料/罐頭常見成分資料庫
// level: good(推薦) / neutral(中性) / warn(注意) / bad(避免)
// function: 成分功能分類,用於「保健整合」分析
//   protein-meat   動物性蛋白(肉)
//   protein-absorb 高吸收蛋白(乳清、酪蛋白)
//   fat-omega      Omega-3 油脂
//   fat            一般油脂
//   carb           碳水
//   fiber          纖維
//   gut            腸胃保健
//   skin           皮膚毛髮
//   joint          關節保健
//   urinary        泌尿保健
//   neural         神經/代謝
//   amino          必需氨基酸
//   vit-min        維生素礦物質
//   preservative-bad 不良防腐劑
//   additive-bad     不良添加物
// isPremium: 是否為「高端配方訊號」成分(整合保健的代表)
const INGREDIENTS_DB = [
    // ===== 動物性蛋白(優質) =====
    {
        name: '雞肉',
        aliases: ['去骨雞肉', '凍乾雞肉粉', '凍乾雞肉', '雞胸肉', '雞腿肉', '雞肉粉', '雞肉乾', '鮮雞肉', '澳洲雞肉', '台灣雞肉', '雞肉', 'chicken'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '優質動物性蛋白,氨基酸完整、適口性佳。「凍乾雞肉粉」保留原始營養是高品質配方訊號。',
        cons: '若標示為「雞肉粉(meal)」未指明來源時品質視來源而定。'
    },
    {
        name: '火雞肉',
        aliases: ['火雞肉粉', '脫水火雞肉', '火雞肉', '火雞', 'turkey'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '低脂高蛋白,過敏率比雞肉低,適合敏感腸胃或過敏體質貓。「火雞肉粉」是濃縮蛋白形式,蛋白質含量更高。'
    },
    {
        name: '鴨肉',
        aliases: ['台灣鴨肉', '鴨肉', 'duck'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '新型蛋白來源,適合對雞肉過敏的貓。富含鐵質與B群。',
        cons: '脂肪含量略高,減重貓需注意比例。'
    },
    {
        name: '牛肉',
        aliases: ['澳洲牛肉', '牛肉', 'beef'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '高蛋白、富含鐵質與維生素B12,有助紅血球生成。',
        cons: '較易引起過敏。'
    },
    {
        name: '羊肉',
        aliases: ['羊肉', 'lamb', 'mutton'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '低敏蛋白選擇,過敏體質貓的良好替代肉源。'
    },
    {
        name: '兔肉',
        aliases: ['兔肉', 'rabbit'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '極低過敏原,瘦肉比例高,適合過敏貓或處方飲食。'
    },
    {
        name: '鹿肉',
        aliases: ['鹿肉', 'venison'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '極稀有蛋白源,適合做為食物排除測試的選項。'
    },
    {
        name: '鮭魚',
        aliases: ['鮭魚', 'salmon'],
        level: 'good', function: 'fat-omega', category: 'Omega-3 蛋白源',
        pros: '富含 Omega-3 脂肪酸 EPA/DHA,有助皮膚毛髮、關節與心血管健康。'
    },
    {
        name: '鰹魚',
        aliases: ['台灣鰹魚', '鰹魚', 'skipjack', 'bonito'],
        level: 'good', function: 'protein-meat', category: '小型魚蛋白',
        pros: '小型魚種、汞含量遠低於大型鮪魚,適口性極佳。台灣近海資源豐富。'
    },
    {
        name: '鮪魚',
        aliases: ['巴布亞紐幾內亞鮪魚', '鮪魚', 'tuna'],
        level: 'warn', function: 'protein-meat', category: '動物性蛋白',
        pros: '適口性極佳,蛋白質高。',
        cons: '若是大型鮪魚汞累積較高;但若品牌有指定小型/環保來源(如野生捕撈、巴布亞紐幾內亞)風險較低。建議與其他蛋白輪換。'
    },
    {
        name: '鯡魚',
        aliases: ['鯡魚', 'herring'],
        level: 'good', function: 'fat-omega', category: '小型魚 / Omega-3',
        pros: '小型魚汞累積低,Omega-3 含量高,優質低敏選擇。'
    },
    {
        name: '鯖魚',
        aliases: ['鯖魚', 'mackerel'],
        level: 'good', function: 'fat-omega', category: '小型魚 / Omega-3',
        pros: '小型魚 Omega-3 來源,氨基酸豐富。'
    },
    {
        name: '鱈魚',
        aliases: ['鱈魚', 'cod'],
        level: 'good', function: 'protein-meat', category: '低脂蛋白',
        pros: '低脂高蛋白,適合腸胃敏感、過敏或減重貓咪。'
    },
    {
        name: '雞蛋',
        aliases: ['雞蛋', '蛋黃', '蛋白', '全蛋', 'egg'],
        level: 'good', function: 'protein-meat', category: '動物性蛋白',
        pros: '完整氨基酸譜,生物利用率極高,被視為蛋白質的黃金標準。'
    },

    // ===== 高吸收蛋白(營養吸收類)=====
    {
        name: '乳清蛋白',
        aliases: ['乳清蛋白', 'whey protein', 'whey'],
        level: 'good', function: 'protein-absorb', category: '高吸收蛋白', isPremium: true,
        pros: '生物利用率最高的蛋白形式,氨基酸吸收快,適合高齡貓、瘦弱貓、術後恢復或運動量大的貓。<strong>市面通常另外賣保健粉</strong>,直接整合進主食是高端訊號。'
    },
    {
        name: '酪蛋白',
        aliases: ['酪蛋白', 'casein'],
        level: 'good', function: 'protein-absorb', category: '緩釋蛋白', isPremium: true,
        pros: '緩慢釋放型蛋白,維持血液氨基酸濃度穩定,常見於高階保健配方。與乳清蛋白搭配可達到「快+慢」雙重蛋白補給。'
    },

    // ===== 動物性蛋白(品質模糊 / 灌水) =====
    {
        name: '動物副產品',
        aliases: ['動物副產品', '動物副產物', '肉類副產品', '家禽副產品', 'by-product'],
        level: 'warn', function: 'protein-meat', category: '動物性蛋白(來源不明)', isVague: true,
        pros: '若來自高品質工廠可包含內臟(肝、心)等營養豐富部位。',
        cons: '台灣未強制揭露具體來源,可能含羽毛、爪喙、血粉等低營養部分,品質參差。建議優先選擇明確標示的肉類。'
    },
    {
        name: '肉粉(未指明)',
        aliases: ['家禽粉', 'meat meal', 'poultry meal'],
        level: 'neutral', function: 'protein-meat', category: '動物性蛋白(濃縮)', isVague: true,
        cons: '未指明動物種類(如「家禽粉」未標雞或鴨),代表來源較雜,品質難判斷。'
    },
    {
        name: '脫水家禽蛋白(未指明)',
        aliases: ['脫水家禽蛋白', '脫水家禽肉', '家禽蛋白', '禽肉蛋白', '家禽肉粉'],
        level: 'warn', function: 'protein-meat', category: '動物性蛋白(模糊)', isVague: true,
        cons: '只標「家禽」未指明雞、鴨或火雞,品質難判斷,可能來自混合家禽副產物。優質飼料會明確標示「脫水雞肉」「脫水鴨肉」等。'
    },
    {
        name: '動物性蛋白(未指明)',
        aliases: ['動物性蛋白'],
        level: 'warn', function: 'protein-meat', category: '動物蛋白(來源不明)', isVague: true,
        cons: '完全沒揭露動物來源,可能是各種動物副產物的混合粉。優質飼料會明確標示物種(如「雞肉」「火雞肉」)。'
    },
    {
        name: '魚粉',
        aliases: ['魚粉', 'fish meal'],
        level: 'neutral', function: 'protein-meat', category: '濃縮魚蛋白',
        pros: '若品牌品質佳、指明魚種,是濃縮蛋白與 Omega-3 來源。',
        cons: '未指明魚種時可能來自各種低價雜魚混合粉,且海洋污染物風險難評估。'
    },
    {
        name: '水解動物蛋白',
        aliases: ['水解動物蛋白', '水解家禽蛋白', '水解蛋白', 'hydrolyzed protein'],
        level: 'warn', function: 'protein-meat', category: '動物性蛋白(處理過)', isVague: true,
        pros: '處方低敏配方有時用於把蛋白切小、避免免疫反應。',
        cons: '一般飼料用「水解」常代表加工過度的低品質蛋白,主要拿來當風味劑/灑粉,並非真正的肉源。'
    },
    {
        name: '動物脂肪(未指明)',
        aliases: ['動物脂肪', 'animal fat'],
        level: 'warn', function: 'fat', category: '油脂(來源不明)', isVague: true,
        cons: '未指明來自哪種動物,品質難以判斷。優質飼料會明確標示「雞油」「鴨油」「鴨脂」等。'
    },
    {
        name: '植物分離蛋白',
        aliases: ['植物分離蛋白', '分離植物蛋白', '濃縮植物蛋白', 'plant protein isolate'],
        level: 'warn', function: 'protein-meat', category: '植物蛋白(灌水嫌疑)', isVague: true,
        cons: '貓咪是肉食動物,難以消化植物蛋白。常被用來提高蛋白質含量數字、降低成本。'
    },
    {
        name: '水解酵母',
        aliases: ['水解酵母', 'hydrolyzed yeast'],
        level: 'good', function: 'gut', category: '益生元 / 風味',
        pros: '提供 MOS(甘露寡糖)促進腸道好菌、增加適口性。'
    },
    {
        name: '大豆油',
        aliases: ['大豆油', 'soybean oil', 'soy oil'],
        level: 'neutral', function: 'fat', category: '植物油',
        pros: '含 Omega-6 必需脂肪酸。',
        cons: '純粹油脂(不算大豆蛋白)。但 Omega-6/3 比例失衡會增加發炎反應。'
    },
    {
        name: '洋車前子',
        aliases: ['洋車前子殼', '洋車前子及殼', '洋車前子', 'psyllium'],
        level: 'good', function: 'fiber', category: '可溶性纖維',
        pros: '可溶性纖維,吸水後形成凝膠,改善便秘與腹瀉(雙向調節),對糖尿病貓也有益。'
    },
    {
        name: '金盞花',
        aliases: ['金盞花', 'calendula', 'marigold'],
        level: 'neutral', function: 'vit-min', category: '天然植物萃取',
        pros: '輕微抗發炎、抗氧化,部分配方用作天然色素。'
    },
    {
        name: '蔬菜纖維',
        aliases: ['蔬菜纖維', 'vegetable fiber'],
        level: 'neutral', function: 'fiber', category: '纖維(未指明)', isVague: true,
        cons: '未指明來自什麼蔬菜,可能是製糖/榨汁副產物。'
    },
    {
        name: '甜菜漿',
        aliases: ['甜菜漿'],
        level: 'neutral', function: 'fiber', category: '纖維',
        pros: '與甜菜渣相同範疇,溫和纖維來源。'
    },

    // ===== 油脂類 =====
    {
        name: '魚油',
        aliases: ['阿拉斯加鱈魚油', '阿拉斯加魚油', '鮭魚油', '魚油', 'fish oil', 'salmon oil'],
        level: 'good', function: 'fat-omega', category: 'Omega-3 油脂', isPremium: true,
        pros: '提供 EPA、DHA,改善皮膚、毛髮亮度與抗發炎。<strong>阿拉斯加鱈魚油</strong>是高品質、低污染的頂級來源。<strong>市面常見另外補魚油</strong>,主食有加是高分項。'
    },
    {
        name: '雞油',
        aliases: ['雞油', '雞脂', 'chicken fat'],
        level: 'good', function: 'fat', category: '油脂',
        pros: '高適口性,提供必需脂肪酸與能量。'
    },
    {
        name: '鴨脂',
        aliases: ['鴨脂', '鴨油', 'duck fat'],
        level: 'good', function: 'fat', category: '油脂',
        pros: '指明物種的優質動物油脂,適口性佳。'
    },
    {
        name: '家禽脂肪',
        aliases: ['家禽脂肪', 'poultry fat'],
        level: 'warn', function: 'fat', category: '油脂(模糊)', isVague: true,
        cons: '只標「家禽」沒指明雞或鴨,品質難以追溯。優質飼料會明確標示「雞油」「鴨脂」等。'
    },
    {
        name: '亞麻仁油',
        aliases: ['亞麻仁油', '亞麻籽油', 'flaxseed oil'],
        level: 'neutral', function: 'fat-omega', category: '植物性 Omega-3',
        cons: '貓咪轉換 ALA 為 EPA/DHA 效率低,植物性 Omega-3 對貓效益有限,建議搭配魚油。'
    },

    // ===== 腸胃吸收類:益生菌 / 酵素 =====
    {
        name: '羅伊氏乳桿菌',
        aliases: ['羅伊氏乳桿菌', '羅伊氏菌', 'L. reuteri', 'Lactobacillus reuteri'],
        level: 'good', function: 'gut', category: '專利益生菌', isPremium: true,
        pros: '研究最多的益生菌之一,對腸道屏障、免疫調節、口腔健康有實證。是高階配方才會用的菌株級成分。'
    },
    {
        name: '芽孢乳酸菌',
        aliases: ['芽孢乳酸菌', '芽孢桿菌', 'Bacillus coagulans'],
        level: 'good', function: 'gut', category: '專利益生菌', isPremium: true,
        pros: '具孢子保護,耐高溫高酸,能活著抵達腸道,存活率遠高於一般乳酸菌。穩定性極佳。'
    },
    {
        name: 'EC80酪酸菌',
        aliases: ['EC80酪酸菌', '酪酸菌', '丁酸菌', 'Clostridium butyricum'],
        level: 'good', function: 'gut', category: '專利益生菌', isPremium: true,
        pros: '產生丁酸滋養腸道上皮細胞,改善腸黏膜健康,對軟便、腸炎特別有效。日本廣泛應用於人類處方。'
    },
    {
        name: '專利益菌配方',
        aliases: ['專利益菌配方', '專利益生菌', '益生菌(LAB2PRO)', 'LAB2PRO'],
        level: 'good', function: 'gut', category: '專利益生菌', isPremium: true,
        pros: '品牌專利菌株配方,通常經過多年研發測試,菌數與活性有保障。'
    },
    {
        name: '益生菌',
        aliases: ['益生菌', '乳酸菌', 'probiotic', 'lactobacillus', 'enterococcus'],
        level: 'good', function: 'gut', category: '腸道保健',
        pros: '改善腸道菌叢、增強免疫力,對軟便、消化不良貓有幫助。'
    },
    {
        name: '枯草芽孢桿菌',
        aliases: ['枯草芽孢桿菌', 'Bacillus subtilis'],
        level: 'good', function: 'gut', category: '專利益生菌', isPremium: true,
        pros: '具孢子保護耐高溫、耐胃酸,腸道存活率高。能分泌酵素輔助消化。'
    },
    {
        name: '嗜酸乳桿菌',
        aliases: ['嗜酸乳桿菌', 'Lactobacillus acidophilus', 'L. acidophilus'],
        level: 'good', function: 'gut', category: '經典益生菌',
        pros: '經典腸道益生菌,改善菌叢平衡、輔助免疫,對軟便、過敏體質貓有幫助。'
    },
    {
        name: '益生元',
        aliases: ['益生元', '果寡糖', 'FOS', 'MOS', 'prebiotic', 'inulin', '菊糖', '菊苣纖維'],
        level: 'good', function: 'gut', category: '腸道保健',
        pros: '滋養腸道好菌,提升益生菌功效。菊糖是天然優質的益生元來源。'
    },
    {
        name: '鳳梨酵素',
        aliases: ['鳳梨酵素', 'bromelain'],
        level: 'good', function: 'gut', category: '消化酵素', isPremium: true,
        pros: '幫助蛋白質分解、減少消化負擔,並具抗發炎效果。<strong>市面通常另外賣酵素粉</strong>,主食內建是加分項。'
    },
    {
        name: '青木瓜酵素',
        aliases: ['青木瓜酵素', '木瓜酵素', 'papain'],
        level: 'good', function: 'gut', category: '消化酵素', isPremium: true,
        pros: '強力蛋白質分解酵素,提升肉類吸收率,對腸胃功能弱的貓特別有幫助。'
    },
    {
        name: '紅麴',
        aliases: ['紅麴', 'red yeast rice', 'monascus'],
        level: 'neutral', function: 'gut', category: '發酵食材',
        pros: '天然發酵成分,部分研究指出可能有助循環。',
        cons: '高劑量含有 monacolin K(類他汀成分),寵物食品內為調味/色素級用量,一般安全。'
    },
    {
        name: '南瓜',
        aliases: ['南瓜', 'pumpkin'],
        level: 'good', function: 'fiber', category: '膳食纖維',
        pros: '溫和纖維來源,對軟便、便秘、毛球都有幫助。'
    },
    {
        name: '甜菜渣',
        aliases: ['甜菜渣', '甜菜纖維', 'beet pulp'],
        level: 'neutral', function: 'fiber', category: '纖維',
        pros: '溫和纖維來源,有助腸道蠕動。'
    },
    {
        name: '鳳梨纖維',
        aliases: ['鳳梨纖維'],
        level: 'good', function: 'fiber', category: '天然纖維',
        pros: '天然水果纖維,溫和不刺激,且帶有微量酵素活性。'
    },
    {
        name: '木質纖維',
        aliases: ['木質纖維', 'lignocellulose'],
        level: 'neutral', function: 'fiber', category: '纖維',
        cons: '純粹的纖維補充,有助糞便成形,但無營養。'
    },
    {
        name: '苜蓿',
        aliases: ['苜蓿', '苜蓿草', 'alfalfa'],
        level: 'good', function: 'fiber', category: '植物纖維 / 微量元素',
        pros: '富含葉綠素、維生素K與礦物質,有助消化與肝腎排毒。'
    },
    {
        name: '絲蘭',
        aliases: ['絲蘭', '絲蘭萃取', 'yucca'],
        level: 'good', function: 'fiber', category: '除臭/腸道保健',
        pros: '天然減少糞便、尿液氣味,並有助腸道健康。'
    },
    {
        name: '纖維素',
        aliases: ['纖維素', 'cellulose', 'powdered cellulose'],
        level: 'neutral', function: 'fiber', category: '纖維(填充)',
        cons: '常從木屑提取的非營養性填充纖維,純粹增加飽足感與糞便成形度。'
    },
    {
        name: '果寡糖類',
        aliases: ['果寡糖', '寡糖'],
        level: 'good', function: 'gut', category: '益生元',
        pros: '滋養腸道好菌,協同益生菌作用。'
    },

    // ===== 皮膚/毛髮類 =====
    {
        name: '膠原蛋白',
        aliases: ['膠原蛋白', 'collagen'],
        level: 'good', function: 'skin', category: '美毛/關節', isPremium: true,
        pros: '支持毛髮亮澤、皮膚彈性與關節軟骨。<strong>市面常見「美毛粉」另外賣</strong>,直接放進主食是高度整合。'
    },

    // ===== 免疫保健類 =====
    {
        name: 'β-葡聚醣',
        aliases: ['β-葡聚醣', 'β葡聚醣', 'beta-glucan', 'β-glucan', 'beta glucan'],
        level: 'good', function: 'immune', category: '免疫多醣體', isPremium: true,
        pros: '酵母/菇類來源的免疫多醣體,刺激先天免疫反應、增強抗病力。<strong>市面常見免疫保健另外賣</strong>,主食內建是高端訊號。'
    },
    {
        name: '黑酵母',
        aliases: ['黑酵母', '出芽短梗黴', 'aureobasidium pullulans'],
        level: 'good', function: 'immune', category: '免疫保健', isPremium: true,
        pros: '黑酵母發酵物產生 β-葡聚醣等成分,日本研究顯示對先天免疫力有支持作用,屬高階保健成分。'
    },
    {
        name: '螺旋藻',
        aliases: ['螺旋藻', 'spirulina'],
        level: 'good', function: 'immune', category: '超級食物', isPremium: true,
        pros: '富含完整氨基酸、Omega、葉綠素、藻青素,被列為「超級食物」。支持免疫、毛髮亮澤。'
    },

    // ===== 神經/代謝類 =====
    {
        name: '卵磷脂',
        aliases: ['大豆卵磷脂', '卵磷脂', 'lecithin', 'soy lecithin'],
        level: 'good', function: 'neural', category: '神經/代謝', isPremium: true,
        pros: '支持神經系統、肝臟脂質代謝,有助毛髮亮麗。<strong>市面常見另外賣卵磷脂保健</strong>,直接內建很加分。注意:這裡的「大豆」只是卵磷脂的來源,並非單獨大豆蛋白。'
    },
    {
        name: 'L-肉鹼',
        aliases: ['L-肉鹼', '左旋肉鹼', 'L-carnitine'],
        level: 'good', function: 'neural', category: '脂肪代謝',
        pros: '幫助脂肪轉換為能量,對減重、心臟功能有助益。'
    },
    {
        name: '色胺酸',
        aliases: ['色胺酸', 'tryptophan', 'L-tryptophan'],
        level: 'good', function: 'neural', category: '必需氨基酸 / 情緒', isPremium: true,
        pros: '血清素的前驅物,有助情緒穩定、減少焦慮、改善睡眠。對神經敏感、容易緊張的貓有幫助。'
    },
    {
        name: 'DHA',
        aliases: ['DHA', '二十二碳六烯酸', 'docosahexaenoic acid'],
        level: 'good', function: 'neural', category: 'Omega-3 / 神經', isPremium: true,
        pros: '腦部與視網膜發育的必需脂肪酸,對幼貓發育、老貓認知都重要。通常隨魚油一起補充。'
    },
    {
        name: 'EPA',
        aliases: ['EPA', '二十碳五烯酸', 'eicosapentaenoic acid'],
        level: 'good', function: 'fat-omega', category: 'Omega-3',
        pros: '抗發炎效果強的 Omega-3,改善皮膚、關節炎症,對心血管也好。'
    },
    {
        name: '酵母 / 酵母粉',
        aliases: ['啤酒酵母', '酵母提取物', '酵母萃取物', '酵母及酵母提取物', '酵母粉', '酵母', 'brewer\'s yeast', 'yeast extract', 'yeast'],
        level: 'good', function: 'vit-min', category: 'B群 / 風味來源',
        pros: '富含B群與微量元素,提升毛髮光澤與適口性。酵母提取物常作為天然風味劑,讓貓更愛吃。'
    },

    // ===== 必需氨基酸 / 關節 =====
    {
        name: '牛磺酸',
        aliases: ['牛磺酸', 'taurine'],
        level: 'good', function: 'amino', category: '必需氨基酸', isPremium: false,
        pros: '貓咪自身無法合成,是必需添加!缺乏會導致中央視網膜退化、心肌病。所有合格貓食必加。'
    },
    {
        name: '葡萄糖胺',
        aliases: ['葡萄糖胺', 'glucosamine'],
        level: 'good', function: 'joint', category: '關節保健', isPremium: true,
        pros: '保護關節軟骨,預防老貓關節炎。'
    },
    {
        name: '軟骨素',
        aliases: ['軟骨素', 'chondroitin'],
        level: 'good', function: 'joint', category: '關節保健', isPremium: true,
        pros: '與葡萄糖胺搭配可維持關節彈性。'
    },
    {
        name: '蔓越莓',
        aliases: ['蔓越莓', 'cranberry'],
        level: 'good', function: 'urinary', category: '泌尿保健', isPremium: true,
        pros: '幫助酸化尿液、抑制細菌附著膀胱壁,對泌尿道健康有益。'
    },
    {
        name: '海帶',
        aliases: ['海帶', '昆布', '海藻', 'kelp', 'seaweed'],
        level: 'good', function: 'vit-min', category: '天然碘',
        pros: '天然碘來源,支持甲狀腺健康。'
    },

    // ===== 維生素礦物質 =====
    {
        name: '維生素E',
        aliases: ['維生素E', '生育醇', 'mixed tocopherols', 'tocopherol', 'vitamin e'],
        level: 'good', function: 'vit-min', category: '天然抗氧化劑',
        pros: '天然防腐方式,同時是必需維生素。優質飼料的指標之一。'
    },
    {
        name: '維生素A',
        aliases: ['維生素A', '視黃醇', 'vitamin a', 'retinol'],
        level: 'good', function: 'vit-min', category: '脂溶性維生素',
        pros: '視力、皮膚、免疫必需。貓無法自行從 β-胡蘿蔔素轉換,必須直接補充。'
    },
    {
        name: '維生素D',
        aliases: ['維生素D', '維生素D3', 'vitamin d', 'vitamin d3', 'cholecalciferol'],
        level: 'good', function: 'vit-min', category: '脂溶性維生素',
        pros: '幫助鈣磷吸收、骨骼健康。貓無法靠日曬合成,必須由飲食補充。'
    },
    {
        name: '微量礦物質群',
        aliases: ['硫酸鋅', '蛋白鋅', '硫酸亞鐵', '甘氨酸鐵', '硫酸銅', '蛋白銅', '亞硒酸鈉', 'zinc', 'iron', 'copper', 'selenium'],
        level: 'good', function: 'vit-min', category: '微量元素',
        pros: '鋅(皮膚毛髮)、鐵(紅血球)、銅(毛色)、硒(抗氧化)等微量元素。完整主食都應該有。'
    },
    {
        name: '綜合維生素',
        aliases: ['綜合維生素', '多種維生素', 'multivitamin'],
        level: 'good', function: 'vit-min', category: '基礎營養',
        pros: '完整補足貓咪所需的水溶性與脂溶性維生素。'
    },
    {
        name: '綜合礦物質',
        aliases: ['綜合礦物質', '微量礦物質', '礦物質'],
        level: 'good', function: 'vit-min', category: '基礎營養',
        pros: '補充鈣、磷、鉀、鎂、鋅、銅、硒、鐵等必需礦物質。'
    },
    {
        name: 'β胡蘿蔔素',
        aliases: ['β胡蘿蔔素', 'β-胡蘿蔔素', '胡蘿蔔素', 'beta-carotene'],
        level: 'good', function: 'vit-min', category: '抗氧化 / 維生素A前體',
        pros: '天然抗氧化劑,支持免疫與視力。'
    },
    {
        name: '葉酸',
        aliases: ['葉酸', 'folic acid', 'folate'],
        level: 'good', function: 'vit-min', category: '維生素B9',
        pros: '紅血球生成、DNA合成必需,對懷孕母貓特別重要。'
    },
    {
        name: '碳酸鈣',
        aliases: ['碳酸鈣', 'calcium carbonate'],
        level: 'good', function: 'vit-min', category: '鈣質來源',
        pros: '常見鈣源,支持骨骼與牙齒健康。'
    },

    // ===== 碳水化合物 =====
    {
        name: '糙米',
        aliases: ['糙米', 'brown rice'],
        level: 'neutral', function: 'carb', category: '碳水化合物',
        pros: '低敏碳水,提供緩釋能量與纖維。'
    },
    {
        name: '白米',
        aliases: ['白米', '米飯', '米', 'rice'],
        level: 'neutral', function: 'carb', category: '碳水化合物',
        pros: '易消化、低過敏,常作為腸胃處方主食。',
        cons: '貓是肉食動物,本身沒有專門消化大量碳水的酵素,前位出現代表蛋白比例可能偏低。'
    },
    {
        name: '玉米',
        aliases: ['玉米麩質', '玉米粉', '玉米澱粉', '玉米', 'corn', 'maize'],
        level: 'warn', function: 'carb', category: '碳水(常見過敏原)',
        cons: '常見過敏原,貓咪消化效率不佳;玉米麩質常被用來灌水蛋白質含量,並非優質蛋白。'
    },
    {
        name: '小麥',
        aliases: ['小麥麩', '小麥', '麩質', 'wheat', 'gluten'],
        level: 'warn', function: 'carb', category: '碳水(常見過敏原)',
        cons: '常見過敏原,可能引發皮膚癢、嘔吐、軟便。'
    },
    {
        name: '大豆',
        aliases: ['大豆蛋白', '大豆粉', '黃豆', '豆粕', '大豆', 'soybean'],
        level: 'warn', function: 'protein-meat', category: '植物蛋白(常見過敏原)', isVague: true,
        cons: '貓咪消化植物蛋白效率差,常見過敏原,且含植酸會影響礦物質吸收。注意:若標示為「大豆卵磷脂」「大豆油」則為其他成分,並非大豆蛋白本身。'
    },
    {
        name: '馬鈴薯',
        aliases: ['馬鈴薯', '洋芋', 'potato'],
        level: 'neutral', function: 'carb', category: '碳水(無穀替代)',
        cons: '升糖指數高,糖尿病或肥胖貓不建議過多。'
    },
    {
        name: '番薯/地瓜',
        aliases: ['番薯', '地瓜', '甘藷', 'sweet potato'],
        level: 'good', function: 'carb', category: '優質碳水/纖維',
        pros: '富含 β-胡蘿蔔素、膳食纖維,GI值較馬鈴薯低,有助腸道健康。'
    },
    {
        name: '豌豆',
        aliases: ['豌豆蛋白', '豌豆纖維', '豌豆澱粉', '豌豆粉', '豌豆', 'pea', 'peas', 'pea protein', 'pea fiber'],
        level: 'warn', function: 'carb', category: '無穀澱粉/植物蛋白',
        pros: '無穀配方常見成分,提供纖維與植物蛋白。',
        cons: 'FDA 已調查豆類過量可能與心肌病(DCM)相關;豌豆蛋白也常被當蛋白質含量灌水。<br>⚠️ <strong>「拆名字」陷阱</strong>:標籤上常見「豌豆蛋白、豌豆纖維、豌豆澱粉」分開列在不同位置,讓肉看起來排前面,但其實全部加起來都是豌豆。'
    },
    {
        name: '木薯',
        aliases: ['木薯', '樹薯', 'tapioca', 'cassava'],
        level: 'neutral', function: 'carb', category: '無穀澱粉',
        pros: '低敏無穀澱粉,適合過敏體質。',
        cons: '幾乎無營養價值,屬黏合劑/填充料。'
    },

    // ===== 應避免成分 =====
    {
        name: 'BHA',
        aliases: ['BHA', '丁基羥基甲氧苯', '丁基羥基茴香醚'],
        level: 'bad', function: 'preservative-bad', category: '人工防腐劑',
        cons: '美國國家毒理學計畫列為「可能致癌物」,歐盟限制使用。'
    },
    {
        name: 'BHT',
        aliases: ['BHT', '二丁基羥基甲苯'],
        level: 'bad', function: 'preservative-bad', category: '人工防腐劑',
        cons: '人工抗氧化劑,長期攝取對肝腎有負擔。'
    },
    {
        name: '乙氧基喹',
        aliases: ['乙氧基喹', '乙氧基喹啉', 'ethoxyquin'],
        level: 'bad', function: 'preservative-bad', category: '人工防腐劑',
        cons: '工業用抗氧化劑,曾用於橡膠製造。歐盟已禁用於寵物食品。'
    },
    {
        name: '沒食子酸丙酯',
        aliases: ['沒食子酸丙酯', 'propyl gallate'],
        level: 'bad', function: 'preservative-bad', category: '人工防腐劑',
        cons: '人工抗氧化劑,長期攝取可能影響肝腎。'
    },
    {
        name: '亞硝酸鈉',
        aliases: ['亞硝酸鈉', '亞硝酸鹽', 'sodium nitrite'],
        level: 'bad', function: 'preservative-bad', category: '人工防腐劑',
        cons: '可能在體內形成致癌的亞硝胺。'
    },
    {
        name: '焦糖色素',
        aliases: ['焦糖色素', '人工色素', '食用紅色', '食用黃色', '色素', 'caramel color'],
        level: 'bad', function: 'additive-bad', category: '人工色素',
        cons: '貓不在意食物顏色,色素純粹做給人看。部分色素已被研究與過敏、過動行為相關。'
    },
    {
        name: '人工香料',
        aliases: ['人工香料', '人工增味劑', '合成香料', 'artificial flavor', 'artificial flavour'],
        level: 'bad', function: 'additive-bad', category: '人工添加',
        cons: '貓咪靠嗅覺判斷食物是否新鮮、是否能吃。品質好的飼料用真實肉/魚自然就有香氣,需要靠人工香料代表原料品質可能不佳。'
    },
    {
        name: '糖',
        aliases: ['蔗糖', '果糖', '糖漿', '玉米糖漿', 'sugar', 'syrup', 'fructose'],
        level: 'bad', function: 'additive-bad', category: '糖類',
        cons: '貓咪沒有甜味受體,完全不需要糖。長期攝取增加糖尿病、肥胖、蛀牙風險。'
    },
    {
        name: '丙二醇',
        aliases: ['丙二醇', 'propylene glycol'],
        level: 'bad', function: 'additive-bad', category: '保濕劑',
        cons: 'FDA 早已禁止用於貓食!會破壞貓紅血球導致貧血。看到請立刻換糧。'
    },
    {
        name: '鹽',
        aliases: ['食鹽', '鹽', 'salt'],
        level: 'warn', function: 'vit-min', category: '礦物質',
        cons: '貓咪需求量極低,過量增加腎臟負擔,腎貓尤其要避免。'
    }
];

// 功能分類顯示元資料
const FUNCTION_META = {
    gut:             { emoji: '🟣', label: '腸胃吸收類',     retail: '市面常見:益生菌粉、消化酵素另外買',     premium: true  },
    skin:            { emoji: '🟡', label: '毛髮皮膚類',     retail: '市面常見:美毛粉、膠原保健另外賣',       premium: true  },
    'fat-omega':     { emoji: '🟡', label: '毛髮皮膚 / Omega-3', retail: '市面常見:魚油保健另外補',              premium: true  },
    'protein-absorb':{ emoji: '🔵', label: '高吸收蛋白(營養吸收類)', retail: '市面常見:乳清/酪蛋白保健另外賣',  premium: true  },
    immune:          { emoji: '🛡️', label: '免疫保健類',     retail: '市面常見:免疫保健另外賣(β-葡聚醣等)',  premium: true  },
    neural:          { emoji: '🟢', label: '神經 / 代謝類',  retail: '市面常見:卵磷脂保健另外補',             premium: true  },
    joint:           { emoji: '🦴', label: '關節保健類',     retail: '市面常見:關節保健粉另外賣',             premium: true  },
    urinary:         { emoji: '💧', label: '泌尿保健類',     retail: '市面常見:泌尿粉另外補',                 premium: true  },
    amino:           { emoji: '⭐', label: '必需氨基酸',      retail: '貓咪必需,合格主食皆有',                 premium: false },
    'protein-meat':  { emoji: '🍗', label: '基礎肉類蛋白',   retail: '主食的核心',                            premium: false },
    fat:             { emoji: '🍳', label: '基礎油脂',       retail: '能量來源',                              premium: false },
    carb:            { emoji: '🌾', label: '碳水 / 澱粉',    retail: '能量填充',                              premium: false },
    fiber:           { emoji: '🥬', label: '膳食纖維',       retail: '腸道蠕動輔助',                          premium: false },
    'vit-min':       { emoji: '💊', label: '維生素礦物質',   retail: '基礎營養',                              premium: false },
    'preservative-bad':{ emoji: '🚫', label: '應避免防腐劑', retail: '建議改用維生素E天然抗氧化的飼料',       premium: false },
    'additive-bad':  { emoji: '🚫', label: '應避免添加物',   retail: '貓咪不需要,純為視覺/口感',              premium: false }
};

// 觸發「整合保健」hero 的功能類別(高端訊號)
const PREMIUM_FUNCTIONS = ['gut', 'skin', 'fat-omega', 'protein-absorb', 'immune', 'neural', 'joint', 'urinary'];
