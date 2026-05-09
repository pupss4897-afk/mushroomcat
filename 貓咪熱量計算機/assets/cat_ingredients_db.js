// 貓咪飼料/罐頭常見成分資料庫
// level: good(推薦) / neutral(中性) / warn(注意) / bad(避免)
// 注意:aliases 包含中英文常見寫法,匹配時不分大小寫
const INGREDIENTS_DB = [
    // ===== 動物性蛋白(優質) =====
    {
        name: '雞肉',
        aliases: ['去骨雞肉', '雞胸肉', '雞腿肉', '雞肉粉', '雞肉乾', '鮮雞肉', '雞肉', 'chicken'],
        level: 'good',
        category: '動物性蛋白',
        pros: '優質動物性蛋白,氨基酸完整、適口性佳,是貓咪最常見也最易吸收的肉類來源。',
        cons: '若標示為「雞肉粉(meal)」品質視來源而定;部分貓咪可能對雞肉過敏。'
    },
    {
        name: '火雞肉',
        aliases: ['火雞肉', '火雞', 'turkey'],
        level: 'good',
        category: '動物性蛋白',
        pros: '低脂高蛋白,過敏率比雞肉低,適合敏感腸胃或過敏體質貓咪。',
        cons: '價格較高,適口性因貓而異。'
    },
    {
        name: '鴨肉',
        aliases: ['鴨肉', 'duck'],
        level: 'good',
        category: '動物性蛋白',
        pros: '新型蛋白來源,適合對雞肉過敏的貓。富含鐵質與B群。',
        cons: '脂肪含量略高,減重貓需注意比例。'
    },
    {
        name: '牛肉',
        aliases: ['牛肉', 'beef'],
        level: 'good',
        category: '動物性蛋白',
        pros: '高蛋白、富含鐵質與維生素B12,有助紅血球生成。',
        cons: '較易引起過敏,部分貓咪不愛這個味道。'
    },
    {
        name: '羊肉',
        aliases: ['羊肉', 'lamb', 'mutton'],
        level: 'good',
        category: '動物性蛋白',
        pros: '低敏蛋白選擇,過敏體質貓的良好替代肉源。',
        cons: '脂肪含量偏高,體重控制需留意。'
    },
    {
        name: '兔肉',
        aliases: ['兔肉', 'rabbit'],
        level: 'good',
        category: '動物性蛋白',
        pros: '極低過敏原,瘦肉比例高,適合過敏貓或處方飲食。',
        cons: '價位高,可能不易取得。'
    },
    {
        name: '鹿肉',
        aliases: ['鹿肉', 'venison'],
        level: 'good',
        category: '動物性蛋白',
        pros: '極稀有蛋白源,適合做為食物排除測試的選項。',
        cons: '價格昂貴。'
    },
    {
        name: '鮭魚',
        aliases: ['鮭魚', 'salmon'],
        level: 'good',
        category: '動物性蛋白 / Omega-3',
        pros: '富含 Omega-3 脂肪酸 EPA/DHA,有助皮膚毛髮、關節與心血管健康。',
        cons: '長期單一餵食可能維生素E不足、汞含量累積,建議輪換蛋白源。'
    },
    {
        name: '鮪魚',
        aliases: ['鮪魚', 'tuna'],
        level: 'warn',
        category: '動物性蛋白',
        pros: '適口性極佳,貓咪超愛,蛋白質高。',
        cons: '汞含量較高,長期主食會累積重金屬;且容易導致挑食,建議偶爾當零食。'
    },
    {
        name: '鯡魚',
        aliases: ['鯡魚', 'herring'],
        level: 'good',
        category: '動物性蛋白 / Omega-3',
        pros: '小型魚汞累積低,Omega-3 含量高,優質低敏選擇。',
        cons: '少見於主食配方,通常作為輔助。'
    },
    {
        name: '鯖魚',
        aliases: ['鯖魚', 'mackerel'],
        level: 'good',
        category: '動物性蛋白 / Omega-3',
        pros: '小型魚 Omega-3 來源,氨基酸豐富。',
        cons: '部分敏感貓咪可能不適應魚腥味。'
    },
    {
        name: '鱈魚',
        aliases: ['鱈魚', 'cod'],
        level: 'good',
        category: '動物性蛋白',
        pros: '低脂高蛋白,適合腸胃敏感、過敏或減重貓咪。'
    },
    {
        name: '雞蛋',
        aliases: ['雞蛋', '蛋黃', '蛋白', '全蛋', 'egg'],
        level: 'good',
        category: '動物性蛋白',
        pros: '完整氨基酸譜,生物利用率極高,被視為蛋白質的黃金標準。',
        cons: '少數貓咪會對蛋過敏。'
    },

    // ===== 動物性蛋白(品質模糊) =====
    {
        name: '動物副產品',
        aliases: ['動物副產品', '動物副產物', '肉類副產品', '家禽副產品', 'by-product', 'by product'],
        level: 'warn',
        category: '動物性蛋白(來源不明)',
        pros: '若來自高品質工廠可包含內臟(肝、心)等營養豐富部位。',
        cons: '台灣未強制揭露具體來源,可能含羽毛、爪喙、血粉等低營養部分,品質參差,建議優先選擇明確標示的肉類。'
    },
    {
        name: '肉粉',
        aliases: ['肉粉', '家禽粉', 'meat meal', 'poultry meal'],
        level: 'neutral',
        category: '動物性蛋白(濃縮)',
        pros: '經乾燥的肉,蛋白質含量比鮮肉更濃縮(去水後)。',
        cons: '若沒指明動物種類(如「家禽粉」未標雞或鴨),代表來源較雜,品質難判斷。'
    },

    // ===== 油脂類 =====
    {
        name: '魚油',
        aliases: ['魚油', '鮭魚油', 'fish oil', 'salmon oil'],
        level: 'good',
        category: '油脂 / Omega-3',
        pros: '提供 EPA、DHA,改善皮膚、毛髮亮度與抗發炎。',
        cons: '需注意保存(易氧化),產品應添加維生素E穩定。'
    },
    {
        name: '雞油',
        aliases: ['雞油', 'chicken fat'],
        level: 'good',
        category: '油脂',
        pros: '高適口性,提供必需脂肪酸與能量。',
        cons: '高熱量,過量易胖。'
    },
    {
        name: '亞麻仁油',
        aliases: ['亞麻仁油', '亞麻籽油', 'flaxseed oil', 'flax oil'],
        level: 'neutral',
        category: '油脂 / 植物性 Omega-3',
        pros: '提供 ALA(植物性 Omega-3)。',
        cons: '貓咪轉換 ALA 為 EPA/DHA 效率低,植物性 Omega-3 對貓效益有限,建議搭配魚油。'
    },

    // ===== 碳水化合物 =====
    {
        name: '糙米',
        aliases: ['糙米', 'brown rice'],
        level: 'neutral',
        category: '碳水化合物',
        pros: '低敏碳水,提供緩釋能量與纖維,比白米營養完整。',
        cons: '貓咪是肉食動物,過高比例反而負擔肝腎。'
    },
    {
        name: '白米',
        aliases: ['白米', 'rice', '米飯'],
        level: 'neutral',
        category: '碳水化合物',
        pros: '易消化、低過敏,常作為腸胃處方主食。',
        cons: '營養價值低,屬於填充料。'
    },
    {
        name: '玉米',
        aliases: ['玉米', '玉米粉', '玉米麩質', '玉米澱粉', 'corn', 'maize'],
        level: 'warn',
        category: '碳水化合物(常見過敏原)',
        pros: '便宜的能量與植物蛋白來源。',
        cons: '常見過敏原之一,貓咪消化效率不佳;有些品牌用玉米麩質充蛋白質含量,並非優質蛋白。'
    },
    {
        name: '小麥',
        aliases: ['小麥', '小麥麩', '麩質', 'wheat', 'gluten'],
        level: 'warn',
        category: '碳水化合物(常見過敏原)',
        pros: '提供能量與纖維。',
        cons: '常見過敏原,可能引發皮膚癢、嘔吐、軟便。麩質敏感貓建議避免。'
    },
    {
        name: '大豆',
        aliases: ['大豆', '黃豆', '豆粕', 'soy', 'soybean'],
        level: 'warn',
        category: '植物蛋白(常見過敏原)',
        pros: '便宜的植物蛋白來源,蛋白質含量高。',
        cons: '貓咪消化植物蛋白效率差,常見過敏原,且含植酸會影響礦物質吸收。'
    },
    {
        name: '馬鈴薯',
        aliases: ['馬鈴薯', '洋芋', 'potato'],
        level: 'neutral',
        category: '碳水化合物(無穀替代)',
        pros: '無穀配方常見替代物,低敏。',
        cons: '升糖指數高,糖尿病或肥胖貓不建議過多。'
    },
    {
        name: '地瓜',
        aliases: ['地瓜', '甘藷', '番薯', 'sweet potato'],
        level: 'good',
        category: '碳水化合物 / 纖維',
        pros: '富含 β-胡蘿蔔素、膳食纖維,GI值較馬鈴薯低,有助腸道健康。'
    },
    {
        name: '豌豆',
        aliases: ['豌豆', '豌豆粉', '豌豆蛋白', 'pea', 'peas'],
        level: 'warn',
        category: '植物蛋白 / 碳水',
        pros: '無穀配方常見成分,提供纖維與植物蛋白。',
        cons: 'FDA 已調查豆類過量可能與貓犬擴張型心肌病(DCM)相關,過量豌豆蛋白也常被當蛋白質含量灌水手段。'
    },
    {
        name: '木薯',
        aliases: ['木薯', '樹薯', 'tapioca', 'cassava'],
        level: 'neutral',
        category: '碳水化合物',
        pros: '低敏無穀替代澱粉。',
        cons: '幾乎無營養價值,純屬黏合劑/填充料。'
    },

    // ===== 必需營養素 =====
    {
        name: '牛磺酸',
        aliases: ['牛磺酸', 'taurine'],
        level: 'good',
        category: '必需氨基酸',
        pros: '貓咪自身無法合成,是必需添加!缺乏會導致中央視網膜退化、心肌病。所有合格貓食必加。'
    },
    {
        name: '葡萄糖胺',
        aliases: ['葡萄糖胺', 'glucosamine'],
        level: 'good',
        category: '關節保健',
        pros: '保護關節軟骨,預防老貓關節炎。'
    },
    {
        name: '軟骨素',
        aliases: ['軟骨素', 'chondroitin'],
        level: 'good',
        category: '關節保健',
        pros: '與葡萄糖胺搭配可維持關節彈性。'
    },
    {
        name: '蔓越莓',
        aliases: ['蔓越莓', 'cranberry'],
        level: 'good',
        category: '泌尿保健',
        pros: '幫助酸化尿液、抑制細菌附著膀胱壁,對泌尿道健康有益。'
    },
    {
        name: '益生菌',
        aliases: ['益生菌', '乳酸菌', 'probiotic', 'lactobacillus', 'enterococcus'],
        level: 'good',
        category: '腸道保健',
        pros: '改善腸道菌叢、增強免疫力,對軟便、消化不良貓有幫助。'
    },
    {
        name: '益生元',
        aliases: ['益生元', '果寡糖', 'FOS', 'MOS', 'prebiotic', 'inulin', '菊苣纖維'],
        level: 'good',
        category: '腸道保健',
        pros: '滋養腸道好菌,提升益生菌功效。'
    },
    {
        name: '南瓜',
        aliases: ['南瓜', 'pumpkin'],
        level: 'good',
        category: '膳食纖維',
        pros: '溫和纖維來源,對軟便、便秘、毛球都有幫助。'
    },
    {
        name: '海帶',
        aliases: ['海帶', '昆布', '海藻', 'kelp', 'seaweed'],
        level: 'good',
        category: '礦物質',
        pros: '天然碘來源,支持甲狀腺健康。'
    },
    {
        name: '啤酒酵母',
        aliases: ['啤酒酵母', 'brewer\'s yeast', 'brewers yeast'],
        level: 'good',
        category: 'B群來源',
        pros: '富含B群與微量元素,提升毛髮光澤與適口性。'
    },
    {
        name: '卵磷脂',
        aliases: ['卵磷脂', 'lecithin'],
        level: 'good',
        category: '營養補充',
        pros: '支持神經系統與肝臟代謝,有助毛髮亮麗。'
    },

    // ===== 防腐劑/抗氧化劑 =====
    {
        name: '維生素E',
        aliases: ['維生素E', '生育醇', 'mixed tocopherols', 'tocopherol', 'vitamin e'],
        level: 'good',
        category: '天然抗氧化劑',
        pros: '天然防腐方式,同時是必需維生素。優質飼料的指標之一。'
    },
    {
        name: 'BHA',
        aliases: ['BHA', '丁基羥基甲氧苯', '丁基羥基茴香醚'],
        level: 'bad',
        category: '人工防腐劑',
        pros: '便宜有效的抗氧化劑。',
        cons: '美國國家毒理學計畫列為「可能致癌物」,歐盟限制使用。建議優先選擇用維生素E抗氧化的飼料。'
    },
    {
        name: 'BHT',
        aliases: ['BHT', '二丁基羥基甲苯'],
        level: 'bad',
        category: '人工防腐劑',
        cons: '人工抗氧化劑,長期攝取對肝腎有負擔,部分國家已限用於人類食品。'
    },
    {
        name: '乙氧基喹',
        aliases: ['乙氧基喹', '乙氧基喹啉', 'ethoxyquin'],
        level: 'bad',
        category: '人工防腐劑',
        cons: '工業用抗氧化劑,曾用於橡膠製造。對肝臟毒性疑慮高,歐盟已禁用於寵物食品。'
    },
    {
        name: '沒食子酸丙酯',
        aliases: ['沒食子酸丙酯', 'propyl gallate', 'PG'],
        level: 'bad',
        category: '人工防腐劑',
        cons: '人工抗氧化劑,長期攝取可能影響肝腎。'
    },

    // ===== 其他應避免 =====
    {
        name: '焦糖色素',
        aliases: ['焦糖色素', '人工色素', '食用紅色', '食用黃色', '色素', 'caramel color', 'red 40', 'yellow 5'],
        level: 'bad',
        category: '人工色素',
        cons: '貓不在意食物顏色,色素純粹做給人看。部分色素已被研究與過敏、過動行為相關。'
    },
    {
        name: '糖',
        aliases: ['蔗糖', '果糖', '糖漿', '玉米糖漿', 'sugar', 'syrup', 'fructose'],
        level: 'bad',
        category: '糖類',
        cons: '貓咪沒有甜味受體,完全不需要糖。長期攝取增加糖尿病、肥胖、蛀牙風險。'
    },
    {
        name: '丙二醇',
        aliases: ['丙二醇', 'propylene glycol'],
        level: 'bad',
        category: '保濕劑',
        cons: 'FDA 早已禁止用於貓食!會破壞貓紅血球導致貧血(海因氏小體形成)。看到請立刻換糧。'
    },
    {
        name: '亞硝酸鈉',
        aliases: ['亞硝酸鈉', '亞硝酸鹽', 'sodium nitrite', 'nitrite'],
        level: 'bad',
        category: '人工防腐劑',
        cons: '多用於肉類發色,可能在體內形成致癌的亞硝胺。'
    },

    // ===== 中性/灌水嫌疑 =====
    {
        name: '甜菜渣',
        aliases: ['甜菜渣', '甜菜纖維', 'beet pulp'],
        level: 'neutral',
        category: '纖維',
        pros: '溫和纖維來源,有助腸道蠕動。',
        cons: '部分人疑慮是製糖業副產品,但目前研究顯示對貓無害。'
    },
    {
        name: '纖維素',
        aliases: ['纖維素', 'cellulose', 'powdered cellulose'],
        level: 'neutral',
        category: '纖維(填充)',
        cons: '常從木屑提取的非營養性填充纖維,純粹增加飽足感與糞便成形度,無實質營養。'
    },
    {
        name: '鹽',
        aliases: ['食鹽', '鹽', 'salt', 'sodium chloride'],
        level: 'warn',
        category: '礦物質',
        pros: '適量是必要礦物質,提供鈉與氯。',
        cons: '貓咪需求量極低,過量增加腎臟負擔,腎貓尤其要避免。'
    }
];
