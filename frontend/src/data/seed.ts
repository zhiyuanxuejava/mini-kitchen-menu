import type { Dish, DishCategory, Ingredient } from './types'

export const categoryLabels: Record<DishCategory | 'all', string> = {
  all: '全部',
  meat: '荤菜',
  vegetable: '素菜',
  soup: '汤类',
  staple: '主食'
}

export const groupLabels: Record<Ingredient['groupType'], string> = {
  main: '主料',
  side: '辅料',
  seasoning: '调料'
}

export const seedDishes: Dish[] = [
  {
    "id": "hongshaorou",
    "name": "红烧肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/hongshaorou.jpg",
    "squareImage": "/static/assets/dishes/real/hongshaorou.jpg",
    "detailImage": "/static/assets/dishes/real/hongshaorou.jpg",
    "description": "这道家常美味色泽红润油亮，口感软糯，肥而不腻，酱香浓郁，搭配米饭特别过瘾。五花肉提供优质蛋白质和必需脂肪酸，加上鹌鹑蛋或豆皮，营养更全面。做法对新手相当友好，从备料到出锅大约需要 1.5 小时。",
    "difficulty": "中等",
    "estimatedMinutes": 54,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "hongshaorou-ing-1",
        "groupType": "main",
        "name": "猪五花肉",
        "amount": "约 3~4 斤",
        "sortOrder": 0
      },
      {
        "id": "hongshaorou-ing-2",
        "groupType": "main",
        "name": "姜",
        "amount": "6 片",
        "sortOrder": 1
      },
      {
        "id": "hongshaorou-ing-3",
        "groupType": "seasoning",
        "name": "冰糖",
        "amount": "15 克（约 7 块）",
        "sortOrder": 2
      },
      {
        "id": "hongshaorou-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "10ml",
        "sortOrder": 3
      },
      {
        "id": "hongshaorou-ing-5",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "15ml",
        "sortOrder": 4
      },
      {
        "id": "hongshaorou-ing-6",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "5ml",
        "sortOrder": 5
      },
      {
        "id": "hongshaorou-ing-7",
        "groupType": "side",
        "name": "开水",
        "amount": "没过食材的量",
        "sortOrder": 6
      },
      {
        "id": "hongshaorou-ing-8",
        "groupType": "seasoning",
        "name": "香叶",
        "amount": "3 片",
        "sortOrder": 7
      },
      {
        "id": "hongshaorou-ing-9",
        "groupType": "seasoning",
        "name": "八角",
        "amount": "2 个",
        "sortOrder": 8
      },
      {
        "id": "hongshaorou-ing-10",
        "groupType": "side",
        "name": "鹌鹑蛋（可选，没有鹌鹑蛋，可以用同等重量的鸡蛋代替）",
        "amount": "0-2 个",
        "sortOrder": 9
      },
      {
        "id": "hongshaorou-ing-11",
        "groupType": "side",
        "name": "豆皮（可选）",
        "amount": "0-80g",
        "sortOrder": 10
      },
      {
        "id": "hongshaorou-ing-12",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "2-3g",
        "sortOrder": 11
      }
    ],
    "steps": [
      {
        "id": "hongshaorou-step-1",
        "stepNo": 1,
        "title": "猪五花肉切大块（约 ",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "猪五花肉切大块（约 4.5cm ，冷冻半小时至一小时更好切）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-2",
        "stepNo": 2,
        "title": "豆皮切 2cm 的宽",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "豆皮切 2cm 的宽度",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-3",
        "stepNo": 3,
        "title": "生姜切片（每片厚度约",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "生姜切片（每片厚度约 3mm ）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-4",
        "stepNo": 4,
        "title": "水烧开",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "水烧开",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-5",
        "stepNo": 5,
        "title": "鹌鹑蛋煮熟并用叉子/",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "鹌鹑蛋煮熟并用叉子/牙签扎孔（尽量多些好入味）",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-6",
        "stepNo": 6,
        "title": "大葱大葱白色的部分葱",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "大葱大葱白色的部分葱白",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-7",
        "stepNo": 7,
        "title": "冷水锅中放入切好的猪",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "冷水锅中放入切好的猪五花肉，加入料酒与葱姜，煮 15 分钟去掉血腥",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-8",
        "stepNo": 8,
        "title": "放入两片生姜提味",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "锅中放入两片生姜提味",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-9",
        "stepNo": 9,
        "title": "开中小火后直接加入五",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "开中小火后直接加入五花肉，不需要放入食用油，每块五花肉六个面都煎一下，煎至出油即可",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-10",
        "stepNo": 10,
        "title": "煎出的油倒出备用",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "将煎出的油倒出备用，并将五花肉推至一边，加入 15g 冰糖，翻炒至冰糖融化；",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "hongshaorou-step-11",
        "stepNo": 11,
        "title": "融化后将五花肉与冰糖",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "融化后将五花肉与冰糖炒至融合上色，加入 注意：生抽 10ml；老抽 15ml",
        "heat": "中火",
        "minutes": 4,
        "tips": "生抽 10ml"
      },
      {
        "id": "hongshaorou-step-12",
        "stepNo": 12,
        "title": "加入烧好的开水炖煮 ",
        "image": "/static/assets/dishes/real/hongshaorou.jpg",
        "description": "加入烧好的开水炖煮 40 分钟（刀工差的同学切的过大请自觉延长炖煮时间），并放入 注意：生姜 2 片；香叶 3 片",
        "heat": "无",
        "minutes": 12,
        "tips": "生姜 2 片"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "生抽 10ml",
      "生姜 2 片"
    ]
  },
  {
    "id": "tomato-egg",
    "name": "西红柿炒鸡蛋",
    "emoji": "🍗",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/tomato-egg.jpg",
    "squareImage": "/static/assets/dishes/real/tomato-egg.jpg",
    "detailImage": "/static/assets/dishes/real/tomato-egg.jpg",
    "description": "一道酸甜开胃的家常菜肴，嫩滑的鸡蛋裹着软烂多汁的西红柿，是中国家庭餐桌上的经典味道。鸡蛋提供优质蛋白质，西红柿富含维生素 C 和番茄红素，营养均衡好吸收。步骤简单，原材料易得，特别适合厨房新手入门，从头备菜到盛盘出锅大约只需 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "tomato-egg-ing-1",
        "groupType": "main",
        "name": "西红柿",
        "amount": "1 个（约 180g） 份数",
        "sortOrder": 0
      },
      {
        "id": "tomato-egg-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "1.5 个 份数",
        "sortOrder": 1
      },
      {
        "id": "tomato-egg-ing-3",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "4ml 鸡蛋/个",
        "sortOrder": 2
      },
      {
        "id": "tomato-egg-ing-4",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "1.5-2g 份数",
        "sortOrder": 3
      },
      {
        "id": "tomato-egg-ing-5",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "0-2g 份数",
        "sortOrder": 4
      },
      {
        "id": "tomato-egg-ing-6",
        "groupType": "side",
        "name": "葱花",
        "amount": "0-10g 份数",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "tomato-egg-step-1",
        "stepNo": 1,
        "title": "西红柿洗净",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "西红柿洗净",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-2",
        "stepNo": 2,
        "title": "可选：去掉西红柿的外",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "可选：去掉西红柿的外表皮 注意：开水烫表皮，然后将西红柿放入冷水，剥去外皮",
        "heat": "中火",
        "minutes": 3,
        "tips": "开水烫表皮，然后将西红柿放入冷水，剥去外皮"
      },
      {
        "id": "tomato-egg-step-3",
        "stepNo": 3,
        "title": "西红柿去蒂",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "西红柿去蒂，切成边长不超过 4cm 的小块，即为 西红柿块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-4",
        "stepNo": 4,
        "title": "鸡蛋打入碗中",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "将鸡蛋打入碗中，加入 1g 份数 的盐，搅匀，即为 鸡蛋液 注意：可以考虑向鸡蛋中加入 1ml 醋，这可以去除腥味，令鸡蛋更蓬松",
        "heat": "中火",
        "minutes": 3,
        "tips": "可以考虑向鸡蛋中加入 1ml 醋，这可以去除腥味，令鸡蛋更蓬松"
      },
      {
        "id": "tomato-egg-step-5",
        "stepNo": 5,
        "title": "热锅",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "热锅，加入食用油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-6",
        "stepNo": 6,
        "title": "油热后",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "油热后，倒入 鸡蛋液。翻炒至鸡蛋结为固体且颜色微微发黄，即为 半熟鸡蛋",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-7",
        "stepNo": 7,
        "title": "关火",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "关火。将 半熟鸡蛋 盛盘，重新开火 注意：注意：不要洗锅",
        "heat": "无",
        "minutes": 3,
        "tips": "注意：不要洗锅"
      },
      {
        "id": "tomato-egg-step-8",
        "stepNo": 8,
        "title": "加入 西红柿块",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "加入 西红柿块，锅铲拍打并翻炒 20 秒，或至西红柿软烂",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-9",
        "stepNo": 9,
        "title": "加入 半熟鸡蛋",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "向锅中加入 半熟鸡蛋，翻炒均匀 注意：可以考虑加入 10ml 番茄酱和 50ml 清水，增加汤汁；可以额外加入一些其它熟肉和材料",
        "heat": "中火",
        "minutes": 4,
        "tips": "可以考虑加入 10ml 番茄酱和 50ml 清水，增加汤汁"
      },
      {
        "id": "tomato-egg-step-10",
        "stepNo": 10,
        "title": "加入剩余的盐、糖（可",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "加入剩余的盐、糖（可选，如果倾向于甜味版本）、葱花（可选），翻炒均匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "tomato-egg-step-11",
        "stepNo": 11,
        "title": "关火",
        "image": "/static/assets/dishes/real/tomato-egg.jpg",
        "description": "关火，盛盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "开水烫表皮，然后将西红柿放入冷水，剥去外皮",
      "可以考虑向鸡蛋中加入 1ml 醋，这可以去除腥味，令鸡蛋更蓬松"
    ]
  },
  {
    "id": "seaweed-egg-soup",
    "name": "紫菜蛋花汤",
    "emoji": "🍳",
    "category": "soup",
    "coverImage": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
    "squareImage": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
    "detailImage": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
    "description": "紫菜蛋花汤是一道清淡鲜美的家常汤品，属于中式简易汤菜。紫菜富含碘、钙和膳食纤维，鸡蛋提供优质蛋白质，二者搭配营养均衡。做法非常简单，对新手友好，从准备到出锅仅需约 20 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "汤类",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "seaweed-egg-soup-ing-1",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "seaweed-egg-soup-ing-2",
        "groupType": "main",
        "name": "紫菜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "seaweed-egg-soup-ing-3",
        "groupType": "side",
        "name": "葱花",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "seaweed-egg-soup-ing-4",
        "groupType": "side",
        "name": "水",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "seaweed-egg-soup-ing-5",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "seaweed-egg-soup-ing-6",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "seaweed-egg-soup-ing-7",
        "groupType": "side",
        "name": "虾仁",
        "amount": "适量",
        "sortOrder": 6
      }
    ],
    "steps": [
      {
        "id": "seaweed-egg-soup-step-1",
        "stepNo": 1,
        "title": "干紫菜用清水泡 15",
        "image": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
        "description": "干紫菜用清水泡 15 分钟，捞起沥干水份备用。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "seaweed-egg-soup-step-2",
        "stepNo": 2,
        "title": "热锅",
        "image": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
        "description": "热锅，倒入 1.5 升清水、5ml 油、2g 盐。待水开后放入紫菜。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "seaweed-egg-soup-step-3",
        "stepNo": 3,
        "title": "紫菜烧开后 3 分钟",
        "image": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
        "description": "紫菜烧开后 3 分钟，将打好的蛋液徐徐倒入锅内，30 秒既可起锅。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "seaweed-egg-soup-step-4",
        "stepNo": 4,
        "title": "撒上葱花",
        "image": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
        "description": "撒上葱花，转小火 20 秒。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "seaweed-egg-soup-step-5",
        "stepNo": 5,
        "title": "关火",
        "image": "/static/assets/dishes/real/seaweed-egg-soup.jpg",
        "description": "关火，出锅前放入几滴香油，也有的会放入一点虾皮，味道也不错。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "shredded-potato",
    "name": "酸辣土豆丝",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/shredded-potato.jpg",
    "squareImage": "/static/assets/dishes/real/shredded-potato.jpg",
    "detailImage": "/static/assets/dishes/real/shredded-potato.jpg",
    "description": "酸辣开胃的经典家常菜，口感脆爽，色泽鲜亮，属于大众喜爱的快手小炒。土豆提供碳水化合物和钾元素，辣椒富含维生素 C，有助于增进食欲。操作步骤简单明了，对新手十分友好，从备料到出锅大约只需 20 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "shredded-potato-ing-1",
        "groupType": "main",
        "name": "土豆",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "shredded-potato-ing-2",
        "groupType": "main",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "shredded-potato-ing-3",
        "groupType": "side",
        "name": "青椒",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "shredded-potato-ing-4",
        "groupType": "side",
        "name": "红椒",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "shredded-potato-ing-5",
        "groupType": "side",
        "name": "干辣椒",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "shredded-potato-ing-6",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "shredded-potato-ing-7",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "shredded-potato-ing-8",
        "groupType": "seasoning",
        "name": "陈醋",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "shredded-potato-ing-9",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 8
      }
    ],
    "steps": [
      {
        "id": "shredded-potato-step-1",
        "stepNo": 1,
        "title": "土豆去皮、切丝（或用",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "土豆去皮、切丝（或用刨丝器）。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-2",
        "stepNo": 2,
        "title": "切好的土豆丝用清水清",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "切好的土豆丝用清水清洗，去除多余的淀粉，然后对土豆丝焯水 10 秒。沥干，备用。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-3",
        "stepNo": 3,
        "title": "葱切成葱花",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "葱切成葱花；大蒜拍碎切成蒜末（分为两等份备用）；干辣椒切小段；青红椒切丝。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-4",
        "stepNo": 4,
        "title": "热锅",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "热锅，小火热油，下入一半的葱花（葱白部分）、一半的蒜末和干辣椒爆香。",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-5",
        "stepNo": 5,
        "title": "加入青红椒翻炒几下",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "加入青红椒翻炒几下，加入土豆丝翻炒至变色。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-6",
        "stepNo": 6,
        "title": "加 5ml 生抽",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "加 5ml 生抽，10ml 陈醋，倒入剩下的一半蒜末和 2g 盐快速翻炒均匀。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "shredded-potato-step-7",
        "stepNo": 7,
        "title": "出锅前撒上剩余的葱花",
        "image": "/static/assets/dishes/real/shredded-potato.jpg",
        "description": "出锅前撒上剩余的葱花，翻匀即可装盘。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "mapo-tofu",
    "name": "麻婆豆腐",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/mapo-tofu.jpg",
    "squareImage": "/static/assets/dishes/real/mapo-tofu.jpg",
    "detailImage": "/static/assets/dishes/real/mapo-tofu.jpg",
    "description": "这道香辣滑嫩的豆腐菜以咸鸭蛋替代传统豆瓣酱，咸鲜中带着微麻微辣，格外开胃下饭。富含优质蛋白和钙、铁等多种微量元素。制作难度适中，对新手友好，全程约需 40 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "mapo-tofu-ing-1",
        "groupType": "main",
        "name": "内脂豆腐",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "mapo-tofu-ing-2",
        "groupType": "main",
        "name": "咸鸭蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "mapo-tofu-ing-3",
        "groupType": "side",
        "name": "五花肉",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "mapo-tofu-ing-4",
        "groupType": "side",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "mapo-tofu-ing-5",
        "groupType": "side",
        "name": "生姜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "mapo-tofu-ing-6",
        "groupType": "side",
        "name": "小米椒",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "mapo-tofu-ing-7",
        "groupType": "seasoning",
        "name": "香辣酱",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "mapo-tofu-ing-8",
        "groupType": "seasoning",
        "name": "花椒",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "mapo-tofu-ing-9",
        "groupType": "seasoning",
        "name": "食盐",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "mapo-tofu-ing-10",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "mapo-tofu-step-1",
        "stepNo": 1,
        "title": "大蒜和生姜切碎",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "大蒜和生姜切碎，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-2",
        "stepNo": 2,
        "title": "小米辣切成辣椒圈",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "小米辣切成辣椒圈，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-3",
        "stepNo": 3,
        "title": "五花肉切成肉糜（本来",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "五花肉切成肉糜（本来就是买的肉糜的跳过）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-4",
        "stepNo": 4,
        "title": "肉糜中加入一半的食盐",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "肉糜中加入一半的食盐和味极鲜酱油，搅拌均匀，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-5",
        "stepNo": 5,
        "title": "鸭蛋用菜刀竖着对半切",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "鸭蛋用菜刀竖着对半切开（注意安全），去除蛋黄（一定要去除，不然会腥），剩下的蛋白捣碎成大约 2 mm 2 mm 大小，不用太碎，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-6",
        "stepNo": 6,
        "title": "打开豆腐包装",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "打开豆腐包装，用水果刀将在盒子中的豆腐划成大约 2.5 cm 3 cm 大小，备用",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-7",
        "stepNo": 7,
        "title": "热锅",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "热锅，锅内放入 10ml - 15ml 食用油。等待 10 秒让油温升高",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-8",
        "stepNo": 8,
        "title": "调成小火",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "调成小火，放入大蒜、生姜、辣椒圈、花椒、咸鸭蛋、蒜蓉辣酱翻炒 20 秒，炒出香味",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-9",
        "stepNo": 9,
        "title": "调成中火",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "调成中火，放入肉糜，翻炒大约 1 分钟，肉炒变色",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-10",
        "stepNo": 10,
        "title": "调成小火",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "调成小火，放入豆腐，将剩下的食盐、味极鲜酱油酱油均匀的洒在豆腐上",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-11",
        "stepNo": 11,
        "title": "从锅边倒入开水（不然",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "从锅边倒入开水（不然豆腐容易破），没过豆腐即可",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "mapo-tofu-step-12",
        "stepNo": 12,
        "title": "开大火",
        "image": "/static/assets/dishes/real/mapo-tofu.jpg",
        "description": "开大火，水沸腾后立马转入中火，等待大约 10 分钟",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-06",
    "name": "可乐鸡翅",
    "emoji": "🍗",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-06.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-06.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-06.jpg",
    "description": "可乐鸡翅色泽红亮、口感嫩滑，味道咸甜适口，是一道流行于家庭餐桌的创意菜肴。鸡翅富含优质蛋白质与脂肪，搭配可乐烹煮后肉质更为软烂。制作过程需要掌握煎制与收汁的火候，对新手有一定挑战，但跟随步骤仍可成功。从备料到完成大约耗时 40 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": true,
    "ingredients": [
      {
        "id": "home-dish-06-ing-1",
        "groupType": "main",
        "name": "鸡翅中",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-06-ing-2",
        "groupType": "main",
        "name": "可乐",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-06-ing-3",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-06-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-06-ing-5",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-06-ing-6",
        "groupType": "side",
        "name": "生姜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-06-ing-7",
        "groupType": "seasoning",
        "name": "料酒或啤酒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-06-ing-8",
        "groupType": "side",
        "name": "小葱",
        "amount": "适量",
        "sortOrder": 7
      }
    ],
    "steps": [
      {
        "id": "home-dish-06-step-1",
        "stepNo": 1,
        "title": "鸡翅入锅",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "鸡翅入锅，倒入冷水淹没。放生姜 1 片和料酒 10 ～ 20 毫升。大火煮开（ 大约 2 分钟 ）后，撇去浮沫，沥出水分 注意：这一步针对冰鲜鸡翅，刚买来的鸡翅直接改刀用生抽进行腌制即可。",
        "heat": "无",
        "minutes": 6,
        "tips": "这一步针对冰鲜鸡翅，刚买来的鸡翅直接改刀用生抽进行腌制即可。"
      },
      {
        "id": "home-dish-06-step-2",
        "stepNo": 2,
        "title": "捞出鸡翅",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "捞出鸡翅，可用刀将两边各划上两口改刀。生抽约 10 克腌制鸡翅 10 分钟（生抽能完全包裹鸡翅表面入味就行）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-06-step-3",
        "stepNo": 3,
        "title": "锅重新小火起油",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "锅重新小火起油，先将剩余姜片爆香，然后下入腌好的鸡翅。将鸡翅煎至金黄翻面（直到两面金黄），用炒菜勺子翻动一下鸡翅，与姜片一起翻炒 4～5 下（目的是防止鸡翅和姜片粘黏）。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-06-step-4",
        "stepNo": 4,
        "title": "鸡翅金黄",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "鸡翅金黄，倒入可乐没过鸡翅，开大火将锅中可乐煮沸，然后撇去漂浮的黑色浮沫（包含血水）。此时加入葱结。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-06-step-5",
        "stepNo": 5,
        "title": "调味：加入食用盐 2",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "调味：加入食用盐 2 克，白糖 10 克，生抽 3 克调味（可以适当用老抽调底色，3 克）。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-06-step-6",
        "stepNo": 6,
        "title": "等到葱结变黄",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "等到葱结变黄，和姜片一起捞出，转中火继续慢煮可乐鸡翅。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-06-step-7",
        "stepNo": 7,
        "title": "等到可乐呈现挂丝状态",
        "image": "/static/assets/dishes/real/home-dish-06.jpg",
        "description": "等到可乐呈现挂丝状态，关小火让汁牢牢挂在鸡翅上。出锅，装盘。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "这一步针对冰鲜鸡翅，刚买来的鸡翅直接改刀用生抽进行腌制即可。",
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-07",
    "name": "宫保鸡丁",
    "emoji": "🍗",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-07.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-07.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-07.jpg",
    "description": "这道川味名菜以糊辣荔枝味见长，小酸甜中透着干辣椒与花椒的香气，鸡丁嫩滑、花生酥脆，口感层次丰富。富含优质蛋白和不饱和脂肪酸，开胃下饭。做法分成简易和进阶两版，对新手比较友好，提前规划好腌制时间即可。从备料到出锅大约需要 1.5 小时。",
    "difficulty": "较难",
    "estimatedMinutes": 1,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-07-ing-1",
        "groupType": "main",
        "name": "手枪腿（或者鸡胸脯肉）",
        "amount": "1 支（约 350g）",
        "sortOrder": 0
      },
      {
        "id": "home-dish-07-ing-2",
        "groupType": "main",
        "name": "大葱",
        "amount": "1 根（约 180g）",
        "sortOrder": 1
      },
      {
        "id": "home-dish-07-ing-3",
        "groupType": "side",
        "name": "熟花生",
        "amount": "150g",
        "sortOrder": 2
      },
      {
        "id": "home-dish-07-ing-4",
        "groupType": "side",
        "name": "姜片",
        "amount": "10g",
        "sortOrder": 3
      },
      {
        "id": "home-dish-07-ing-5",
        "groupType": "side",
        "name": "干辣椒（或者二荆条）",
        "amount": "10g（若选择二荆条",
        "sortOrder": 4
      },
      {
        "id": "home-dish-07-ing-6",
        "groupType": "seasoning",
        "name": "生抽酱油",
        "amount": "10g",
        "sortOrder": 5
      },
      {
        "id": "home-dish-07-ing-7",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "2g",
        "sortOrder": 6
      },
      {
        "id": "home-dish-07-ing-8",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "2g",
        "sortOrder": 7
      },
      {
        "id": "home-dish-07-ing-9",
        "groupType": "seasoning",
        "name": "植物油",
        "amount": "20g",
        "sortOrder": 8
      },
      {
        "id": "home-dish-07-ing-10",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "15g",
        "sortOrder": 9
      },
      {
        "id": "home-dish-07-ing-11",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "15g",
        "sortOrder": 10
      },
      {
        "id": "home-dish-07-ing-12",
        "groupType": "seasoning",
        "name": "老抽酱油",
        "amount": "5g",
        "sortOrder": 11
      },
      {
        "id": "home-dish-07-ing-13",
        "groupType": "seasoning",
        "name": "花椒",
        "amount": "5g",
        "sortOrder": 12
      },
      {
        "id": "home-dish-07-ing-14",
        "groupType": "seasoning",
        "name": "香醋",
        "amount": "5g",
        "sortOrder": 13
      },
      {
        "id": "home-dish-07-ing-15",
        "groupType": "seasoning",
        "name": "鸡精",
        "amount": "2g",
        "sortOrder": 14
      },
      {
        "id": "home-dish-07-ing-16",
        "groupType": "seasoning",
        "name": "芝麻油",
        "amount": "10g",
        "sortOrder": 15
      }
    ],
    "steps": [
      {
        "id": "home-dish-07-step-1",
        "stepNo": 1,
        "title": "手枪腿用剪刀去骨",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "手枪腿用剪刀去骨，鸡肉面用刀背拍打一遍，切条后切至 1.5cm 见方肉丁；泡于清水 10 分钟，捞出控干备用（若是鸡胸脯肉，则可以直接进行切丁以及之后的动作）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-2",
        "stepNo": 2,
        "title": "取大葱葱绿与姜片 5",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "取大葱葱绿与姜片 5g 于碗中，倒入 50g 开水备用；葱白切 1.5cm 圆粒备用；取花生放入微波炉高火 5 分钟焙干备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-3",
        "stepNo": 3,
        "title": "鸡丁中加入盐 2g",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "鸡丁中加入盐 2g，老抽酱油 5g，料酒 15g，淀粉 15g 搅拌均匀，至微微发干；缓慢加入部分葱姜水，搅拌鸡丁至粘手；保鲜膜密封，放入冰箱腌制 1 小时",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-4",
        "stepNo": 4,
        "title": "干辣椒切段",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "干辣椒切段；起锅，大火烧热转小火；放入干辣椒焙干至微微发糊，捞起备用；花椒焙干至有香味，捞起备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-5",
        "stepNo": 5,
        "title": "转大火",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "转大火，倒入 20g 植物油，7 成热（竹筷子起泡）下入鸡丁，煎至上面开始发白，用锅铲翻面，煎 30s 后翻炒均匀",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-6",
        "stepNo": 6,
        "title": "下入葱粒翻炒",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "下入葱粒翻炒，加入余下葱姜水不够 100g 再加一点清水（务必是热水）；盖上锅盖，转中小火焖 2 分钟；",
        "heat": "小火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-7",
        "stepNo": 7,
        "title": "转大火",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "转大火，下入熟花生，干辣椒和花椒；加入鸡精 2g，香醋 5g，白糖 2g，翻炒均匀；",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-8",
        "stepNo": 8,
        "title": "淀粉 10g 加 5",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "淀粉 10g 加 50g 清水调成水淀粉，加入锅中，翻炒均匀，收汁到自己想要的浓度",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-9",
        "stepNo": 9,
        "title": "关火",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "关火，淋入芝麻油 10g，即可出锅",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-10",
        "stepNo": 10,
        "title": "莴笋去皮切至 1cm",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "莴笋去皮切至 1cm 见方的小块，备用；",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-11",
        "stepNo": 11,
        "title": "二荆条切成 1cm ",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "二荆条切成 1cm 长段；",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-07-step-12",
        "stepNo": 12,
        "title": "手枪腿用剪刀去骨",
        "image": "/static/assets/dishes/real/home-dish-07.jpg",
        "description": "手枪腿用剪刀去骨，鸡肉面用刀背拍打一遍，切条后切至 1.5cm 见方肉丁；泡于清水 10 分钟，捞出控干备用（若是鸡胸脯肉，则可以直接进行切丁以及之后的动作）；",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-08",
    "name": "鱼香肉丝",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-08.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-08.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-08.jpg",
    "description": "鱼香肉丝是一道经典川菜，口味酸甜微辣，肉丝滑嫩，配以胡萝卜、青椒和木耳，口感丰富。富含蛋白质和多种维生素，荤素搭配，营养均衡。制作有一定难度，需要调好鱼香汁并掌握翻炒火候，新手建议严格按步骤操作。预计制作时长约 40 分钟（不含木耳泡发时间",
    "difficulty": "较难",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-08-ing-1",
        "groupType": "main",
        "name": "里脊肉 200g",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-08-ing-2",
        "groupType": "main",
        "name": "胡萝卜 100g",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-08-ing-3",
        "groupType": "side",
        "name": "青椒 100g",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-08-ing-4",
        "groupType": "side",
        "name": "木耳",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-08-ing-5",
        "groupType": "seasoning",
        "name": "生抽 10ml",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-08-ing-6",
        "groupType": "seasoning",
        "name": "料酒 5ml",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-08-ing-7",
        "groupType": "side",
        "name": "蛋清 1 个",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-08-ing-8",
        "groupType": "seasoning",
        "name": "淀粉 10g",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-08-ing-9",
        "groupType": "seasoning",
        "name": "醋 15ml",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-08-ing-10",
        "groupType": "seasoning",
        "name": "白糖 10g",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-08-ing-11",
        "groupType": "seasoning",
        "name": "盐 5g",
        "amount": "适量",
        "sortOrder": 10
      },
      {
        "id": "home-dish-08-ing-12",
        "groupType": "side",
        "name": "姜 20g",
        "amount": "适量",
        "sortOrder": 11
      },
      {
        "id": "home-dish-08-ing-13",
        "groupType": "side",
        "name": "葱 20g",
        "amount": "适量",
        "sortOrder": 12
      },
      {
        "id": "home-dish-08-ing-14",
        "groupType": "side",
        "name": "蒜 2 瓣",
        "amount": "适量",
        "sortOrder": 13
      },
      {
        "id": "home-dish-08-ing-15",
        "groupType": "seasoning",
        "name": "豆瓣酱 15g",
        "amount": "适量",
        "sortOrder": 14
      }
    ],
    "steps": [
      {
        "id": "home-dish-08-step-1",
        "stepNo": 1,
        "title": "制作腌料：将下列原料",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "制作腌料：将下列原料混合： 注意：生抽 5ml；料酒 5ml",
        "heat": "无",
        "minutes": 3,
        "tips": "生抽 5ml"
      },
      {
        "id": "home-dish-08-step-2",
        "stepNo": 2,
        "title": "制作香汁：将下列原料",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "制作香汁：将下列原料混合： 注意：生抽 5ml；醋 15ml",
        "heat": "中火",
        "minutes": 3,
        "tips": "生抽 5ml"
      },
      {
        "id": "home-dish-08-step-3",
        "stepNo": 3,
        "title": "用腌料腌制里脊肉 1",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "用腌料腌制里脊肉 15-30 分钟。注意将肉抓匀。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-4",
        "stepNo": 4,
        "title": "干木耳泡 4 个小时",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "干木耳泡 4 个小时，洗净，切成小块。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-5",
        "stepNo": 5,
        "title": "青椒洗净",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "青椒洗净，去蒂，切成丝。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-6",
        "stepNo": 6,
        "title": "胡萝卜洗净",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "胡萝卜洗净，切成丝，将胡萝卜丝焯水。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-7",
        "stepNo": 7,
        "title": "姜、蒜切沫",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "姜、蒜切沫。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-8",
        "stepNo": 8,
        "title": "葱切成 5mm 的小",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "葱切成 5mm 的小段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-9",
        "stepNo": 9,
        "title": "锅烧热",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "将锅烧热，加入 15ml 油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-10",
        "stepNo": 10,
        "title": "向锅内倒入准备好的腌",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "向锅内倒入准备好的腌肉，快速滑散至变白，盛出备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-11",
        "stepNo": 11,
        "title": "锅烧热",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "将锅烧热，加入 5ml 油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-08-step-12",
        "stepNo": 12,
        "title": "倒入全部葱、姜、蒜、",
        "image": "/static/assets/dishes/real/home-dish-08.jpg",
        "description": "倒入全部葱、姜、蒜、豆瓣酱。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "生抽 5ml",
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-09",
    "name": "回锅肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-09.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-09.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-09.jpg",
    "description": "回锅肉是四川传统名菜，以二刀肉或五花肉为主料，成菜色泽红亮，肥肉透明微卷、瘦肉干香不柴，口感肥而不腻，咸鲜微辣，带有蒜苗与豆瓣酱的复合香气。猪肉富含优质蛋白和必需脂肪酸，搭配青红椒、蒜苗可补充维生素。这道菜步骤稍多，包含煮、切、煸炒，对火候",
    "difficulty": "较难",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-09-ing-1",
        "groupType": "main",
        "name": "五花肉的用量为 0.5 斤/男人 0.3 斤/女人 （正宗回锅肉使用二刀肉[俗称",
        "amount": "臀尖]制作",
        "sortOrder": 0
      },
      {
        "id": "home-dish-09-ing-2",
        "groupType": "main",
        "name": "青红椒（根据受辣程度选择, 0-30g）注",
        "amount": "不建议使用肉厚的菜椒",
        "sortOrder": 1
      }
    ],
    "steps": [
      {
        "id": "home-dish-09-step-1",
        "stepNo": 1,
        "title": "锅烧热",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "锅烧热，用手将五花肉紧紧压在锅上炙皮 注意：这一步是为了处理猪皮上的汗腺（或者买肉的时候让师傅烧一下皮，喜欢汗腺的可以无视）",
        "heat": "中火",
        "minutes": 3,
        "tips": "这一步是为了处理猪皮上的汗腺（或者买肉的时候让师傅烧一下皮，喜欢汗腺的可以无视）"
      },
      {
        "id": "home-dish-09-step-2",
        "stepNo": 2,
        "title": "用钢丝球把皮刷干净",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "用钢丝球把皮刷干净，至黑色部分碳化部分被完全去除，不刷干净会有苦味",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-3",
        "stepNo": 3,
        "title": "五花肉放入锅中",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "将五花肉放入锅中，放入能淹没五花肉的冷水，放入生姜片、料酒和小葱（取 2 棵小葱打结）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-4",
        "stepNo": 4,
        "title": "开大火煮",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "开大火煮，水开后撇去浮沫，继续煮 15 分钟，煮至瘦肉部分可以用筷子轻松刺穿",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-5",
        "stepNo": 5,
        "title": "青红椒切圈",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "青红椒切圈",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-6",
        "stepNo": 6,
        "title": "蒜苗切段",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "蒜苗切段",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-7",
        "stepNo": 7,
        "title": "生姜切小薄片",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "生姜切小薄片",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-8",
        "stepNo": 8,
        "title": " 5ml 豆瓣酱和 ",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "将 5ml 豆瓣酱和 5ml 生抽提前混合",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-9",
        "stepNo": 9,
        "title": "煮熟的五花肉捞出放入",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "将煮熟的五花肉捞出放入冷水晾凉",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-10",
        "stepNo": 10,
        "title": "擦干五花肉的水",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "擦干五花肉的水，切成上肥下瘦的 2mm 的薄片（切厚了口感不好，而且很油）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-11",
        "stepNo": 11,
        "title": "锅烧热",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "锅烧热，放入一层底油滑锅",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-09-step-12",
        "stepNo": 12,
        "title": "放入五花肉煸炒至肥肉",
        "image": "/static/assets/dishes/real/home-dish-09.jpg",
        "description": "放入五花肉煸炒至肥肉透明，肉片微卷（欲称起灯盏窝），二刀肉效果最佳。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "这一步是为了处理猪皮上的汗腺（或者买肉的时候让师傅烧一下皮，喜欢汗腺的可以无视）",
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-10",
    "name": "糖醋排骨",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-10.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-10.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-10.jpg",
    "description": "糖醋排骨是一道酸甜可口、外酥里嫩的传统名菜，广受欢迎。排骨富含优质蛋白和钙质，有较好的滋补效果。这道菜涉及焯水、油炸、炒糖色和收汁等多个步骤，对火候和调味有一定要求，不算特别适合新手，但按照优化后的流程操作成功率较高。预计制作时长为 大约 ",
    "difficulty": "较难",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-10-ing-1",
        "groupType": "main",
        "name": "排骨",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-10-ing-2",
        "groupType": "seasoning",
        "name": "白砂糖",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-10-ing-3",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-10-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-10-ing-5",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-10-ing-6",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-10-ing-7",
        "groupType": "seasoning",
        "name": "鸡精",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-10-ing-8",
        "groupType": "side",
        "name": "姜片",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-10-ing-9",
        "groupType": "side",
        "name": "芝麻",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-10-ing-10",
        "groupType": "seasoning",
        "name": "番茄酱",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-10-ing-11",
        "groupType": "seasoning",
        "name": "香醋",
        "amount": "适量",
        "sortOrder": 10
      },
      {
        "id": "home-dish-10-ing-12",
        "groupType": "side",
        "name": "五香粉",
        "amount": "适量",
        "sortOrder": 11
      }
    ],
    "steps": [
      {
        "id": "home-dish-10-step-1",
        "stepNo": 1,
        "title": "排骨与姜片放入冷水中",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "排骨与姜片放入冷水中，大火加热至水沸腾、出现大量泡沫后转中火，待水持续沸腾时再转小火焯水 2–3 分钟，捞出备用。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-2",
        "stepNo": 2,
        "title": "用开水反复清洗排骨 ",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "用开水反复清洗排骨 2–3 遍，确保彻底去除血沫。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-3",
        "stepNo": 3,
        "title": "在锅中倒入足够量的食",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "在锅中倒入足够量的食用油进行深炸（油量依据锅具大小而定，建议约 300 ml 供一般家庭使用），待油温升至约 170°C 后，下排骨炸制 3–5 分钟，直至表面略呈金黄色，捞出控油。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-4",
        "stepNo": 4,
        "title": "另取干净锅",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "另取干净锅，置于小火上加热 50 ml 热水，加入白砂糖 30 g，轻轻搅拌直至糖完全溶解，并略呈淡黄色。此步骤的重点在于观察糖溶解情况，无需过分依赖颜色变化。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-5",
        "stepNo": 5,
        "title": "炸好的排骨倒入炒制糖",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "将炸好的排骨倒入炒制糖水的锅中，迅速翻炒 30 秒后，依次加入香醋 5 ml、生抽 5 ml、蚝油 5 ml、鸡精 2 g、番茄酱 10 g、五香粉 0.5 g，再次翻炒 30 秒，使调料均匀裹覆排骨，然后加入开水至刚好没过排骨。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-6",
        "stepNo": 6,
        "title": "用大火将锅中液体煮沸",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "用大火将锅中液体煮沸后，加入老抽 5 ml 进行上色，并快速收汁；若排骨块较大，可转小火焖煮 5–10 分钟以便更好地入味，切勿采用中火长时间炖煮 20 分钟，以免损伤口感。",
        "heat": "无",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-10-step-7",
        "stepNo": 7,
        "title": "起锅装盘",
        "image": "/static/assets/dishes/real/home-dish-10.jpg",
        "description": "起锅装盘，撒上芝麻 2 g，即可享用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-11",
    "name": "糖醋里脊",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-11.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-11.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-11.jpg",
    "description": "糖醋里脊酸甜浓郁、外酥里嫩，是广受欢迎的家常风味，在多地域菜系中都很常见。猪里脊提供优质蛋白，但裹粉油炸和糖醋汁使整体热量偏高。制作时需要掌握腌制、复炸和调汁火候，对新手稍有挑战，建议提前备好料并一气呵成。从备料到出锅大约需要 45 分钟到",
    "difficulty": "较难",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-11-ing-1",
        "groupType": "main",
        "name": "里脊肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-11-ing-2",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-11-ing-3",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-11-ing-4",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-11-ing-5",
        "groupType": "side",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-11-ing-6",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-11-ing-7",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-11-ing-8",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-11-ing-9",
        "groupType": "seasoning",
        "name": "番茄酱",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-11-ing-10",
        "groupType": "seasoning",
        "name": "白胡椒粉",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-11-ing-11",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "home-dish-11-step-1",
        "stepNo": 1,
        "title": "腌肉：将猪里脊肉先切",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "腌肉：将猪里脊肉先切厚片，用刀背拍一拍，把肉拍松一点。切成一个手指头粗的条，加料酒，生抽，蚝油，食盐，白胡椒粉，一个鸡蛋，将肉用手抓匀，腌制 20 分钟以上。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-2",
        "stepNo": 2,
        "title": "调酱：番茄酱+10g",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "调酱：番茄酱+10g 醋+30g 白糖+150ml 清水，搅拌至糖融化，备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-3",
        "stepNo": 3,
        "title": "裹粉：先把粉全部裹好",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "裹粉：先把粉全部裹好再来炸，这样在炸的时候就不会手忙脚乱。准备一个大碗，里面放淀粉，把每一根肉条都满满裹上淀粉。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-4",
        "stepNo": 4,
        "title": "炸制：油温 160 ",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "炸制：油温 160 摄氏度下里脊，可以拿一个干筷子放在油里面试一下，周围冒小泡就可以下锅。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-5",
        "stepNo": 5,
        "title": "炸到表面微黄可以捞出",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "炸到表面微黄可以捞出，全程中火。然后等油温升高到 200 摄氏度，把里脊倒进去重新炸一次，只需 40 秒，表皮就会很脆，马上捞出。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-6",
        "stepNo": 6,
        "title": "裹酱：另外拿一个锅",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "裹酱：另外拿一个锅，锅里放底油，把调好的酱汁倒进去，煮到冒泡，把炸好的里脊放进去，翻炒，让每一根都裹上酱汁。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-11-step-7",
        "stepNo": 7,
        "title": "下炸好的里脊肉翻炒",
        "image": "/static/assets/dishes/real/home-dish-11.jpg",
        "description": "下炸好的里脊肉翻炒，关火盛出。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-12",
    "name": "黄焖鸡",
    "emoji": "🍗",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-12.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-12.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-12.jpg",
    "description": "黄焖鸡是一道以鸡腿、香菇、青椒为主料的家常菜，汤汁浓郁，鸡肉滑嫩，咸鲜微甜，十分下饭。富含优质蛋白质和菌菇多糖等营养。炒糖色环节稍有挑战，但可用老抽替代，整体难度不高，新手也能顺利掌握。从备菜到出锅，大约需要 40 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-12-ing-1",
        "groupType": "main",
        "name": "鸡腿",
        "amount": "两只",
        "sortOrder": 0
      },
      {
        "id": "home-dish-12-ing-2",
        "groupType": "main",
        "name": "香菇（干香菇最佳）",
        "amount": "5 朵",
        "sortOrder": 1
      },
      {
        "id": "home-dish-12-ing-3",
        "groupType": "side",
        "name": "青椒",
        "amount": "两个",
        "sortOrder": 2
      },
      {
        "id": "home-dish-12-ing-4",
        "groupType": "side",
        "name": "生姜片",
        "amount": "两片",
        "sortOrder": 3
      },
      {
        "id": "home-dish-12-ing-5",
        "groupType": "side",
        "name": "干辣椒",
        "amount": "5",
        "sortOrder": 4
      },
      {
        "id": "home-dish-12-ing-6",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "10g",
        "sortOrder": 5
      },
      {
        "id": "home-dish-12-ing-7",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "10ml",
        "sortOrder": 6
      },
      {
        "id": "home-dish-12-ing-8",
        "groupType": "seasoning",
        "name": "白胡椒粉",
        "amount": "5g",
        "sortOrder": 7
      },
      {
        "id": "home-dish-12-ing-9",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "5g",
        "sortOrder": 8
      },
      {
        "id": "home-dish-12-ing-10",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "5ml",
        "sortOrder": 9
      },
      {
        "id": "home-dish-12-ing-11",
        "groupType": "side",
        "name": "土豆",
        "amount": "一个（可选",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "home-dish-12-step-1",
        "stepNo": 1,
        "title": "鸡腿洗净",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "鸡腿洗净，剁成4cm大小的块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-2",
        "stepNo": 2,
        "title": "生姜切片、干辣椒切成",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "生姜切片、干辣椒切成小圈",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-3",
        "stepNo": 3,
        "title": "香菇切片",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "香菇切片，青椒切成细长的马蹄状，若为干香菇，洗净灰尘后泡一晚上并留香菇水备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-4",
        "stepNo": 4,
        "title": "若有土豆",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "若有土豆，切为与鸡肉大小类似的滚刀块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-5",
        "stepNo": 5,
        "title": "炒糖色：锅里倒入底油",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "炒糖色：锅里倒入底油，冷油时放入白糖（有一定难度，新手可跳至鸡肉炒制并使用老抽替代）",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-6",
        "stepNo": 6,
        "title": "小火慢慢加热",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "小火慢慢加热，待油温逐渐升高，白糖开始融化并变成较深的棕色（期间要不断搅拌，防止糊锅）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-7",
        "stepNo": 7,
        "title": "迅速倒入鸡块",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "迅速倒入鸡块，转大火，快速翻炒！烹入料酒，继续翻炒片刻",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-8",
        "stepNo": 8,
        "title": "生姜片和干辣椒倒入",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "将生姜片和干辣椒倒入",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-9",
        "stepNo": 9,
        "title": "放入酱油",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "放入酱油，炒匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-10",
        "stepNo": 10,
        "title": "倒入香菇水或清水",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "倒入香菇水或清水，以能淹住鸡肉为准",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-11",
        "stepNo": 11,
        "title": "倒入香菇片",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "倒入香菇片，白胡椒粉，盐，土豆",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-12-step-12",
        "stepNo": 12,
        "title": "翻炒均匀后",
        "image": "/static/assets/dishes/real/home-dish-12.jpg",
        "description": "翻炒均匀后，盖上锅盖焖煮，转中小火15——20分钟，有条件可以转至砂锅",
        "heat": "小火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-13",
    "name": "水煮肉片",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-13.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-13.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-13.jpg",
    "description": "水煮肉片是一道麻辣鲜香、肉片滑嫩、配菜爽脆的经典川菜，极其适合下饭。猪里脊提供优质蛋白质，搭配豆芽等蔬菜，营养均衡。做法稍显繁琐，尤其需要耐心腌制肉片和制作刀口辣椒，新手大约需要 1 至 2 小时完成。",
    "difficulty": "较难",
    "estimatedMinutes": 39,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-13-ing-1",
        "groupType": "main",
        "name": "猪里脊肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-13-ing-2",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-13-ing-3",
        "groupType": "seasoning",
        "name": "胡椒粉",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-13-ing-4",
        "groupType": "seasoning",
        "name": "生抽酱油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-13-ing-5",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-13-ing-6",
        "groupType": "side",
        "name": "鸡蛋清",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-13-ing-7",
        "groupType": "seasoning",
        "name": "土豆淀粉",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-13-ing-8",
        "groupType": "seasoning",
        "name": "植物油",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-13-ing-9",
        "groupType": "side",
        "name": "豆芽",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-13-ing-10",
        "groupType": "side",
        "name": "凤尾",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-13-ing-11",
        "groupType": "side",
        "name": "芹菜",
        "amount": "适量",
        "sortOrder": 10
      },
      {
        "id": "home-dish-13-ing-12",
        "groupType": "side",
        "name": "蒜苗",
        "amount": "适量",
        "sortOrder": 11
      },
      {
        "id": "home-dish-13-ing-13",
        "groupType": "side",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 12
      },
      {
        "id": "home-dish-13-ing-14",
        "groupType": "side",
        "name": "生姜",
        "amount": "适量",
        "sortOrder": 13
      },
      {
        "id": "home-dish-13-ing-15",
        "groupType": "side",
        "name": "红泡椒",
        "amount": "适量",
        "sortOrder": 14
      },
      {
        "id": "home-dish-13-ing-16",
        "groupType": "seasoning",
        "name": "青花椒",
        "amount": "适量",
        "sortOrder": 15
      }
    ],
    "steps": [
      {
        "id": "home-dish-13-step-1",
        "stepNo": 1,
        "title": "里脊肉改刀成小块",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "里脊肉改刀成小块，再切成 2 毫米薄片（可根据自己的口感改进），放入碗中，加入清水清洗两遍来去除血水和杂质，捞出挤干水分备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-2",
        "stepNo": 2,
        "title": "碗中加入食用盐 1",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "碗中加入食用盐 1.5g，胡椒粉 1g，生抽酱油 5g，料酒 3g，然后朝着一个方向搅拌 2 分钟，使其入味。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-3",
        "stepNo": 3,
        "title": "另外准备一个碗",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "另外准备一个碗，加入一个鸡蛋清，加入 7g 土豆淀粉，一个方向搅拌均匀，倒入肉中 注意：再次一个方向搅拌均匀（肉表面就形成了润滑膜，这样会使肉更加鲜嫩）；最后再加入 30g 植物油轻轻搅拌（防止肉片粘连）。",
        "heat": "无",
        "minutes": 3,
        "tips": "再次一个方向搅拌均匀（肉表面就形成了润滑膜，这样会使肉更加鲜嫩）"
      },
      {
        "id": "home-dish-13-step-4",
        "stepNo": 4,
        "title": "绿豆芽 100g",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "绿豆芽 100g，凤尾 1 根（改刀成小条），芹菜 3 根切成小段，蒜苗 2 根拍散切成小段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-5",
        "stepNo": 5,
        "title": "大蒜 20g 剁碎",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "大蒜 20g 剁碎，生姜小块剁碎，红泡椒 20g 剁碎。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-6",
        "stepNo": 6,
        "title": "小米辣干辣椒 15g",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "小米辣干辣椒 15g，青花椒 3g，锅内加入油滑锅，油稍许热了将多余的倒出备用留 50g 底油，下入干辣椒、花椒，开小火炒香，切记不要炒糊（颜色要变黑即可），倒出在菜板上剁细。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-7",
        "stepNo": 7,
        "title": "锅烧热",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "锅烧热，放入 100g 植物油烧至 6 成热，加入 2g 青花椒、干辣椒爆香，配菜下锅，加入 1g 食用盐，炒至断生，盛入碗中垫底备用。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-8",
        "stepNo": 8,
        "title": "锅洗干净",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "锅洗干净，加入 150g 植物油烧至 6 成热，加入制作好的姜蒜红泡椒，爆香后加入豆瓣 10g，开小火把豆瓣爆香炒出红油即可。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-9",
        "stepNo": 9,
        "title": "加入 800 毫升清",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "加入 800 毫升清水（根据实际情况选择），大火烧开，转小火调味，加入食用盐 2.5g，鸡精 1.5g，1g 白砂糖提鲜，1g 胡椒粉，5g 水淀粉（根据实际情况选择）将汤汁收浓稠一点。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-10",
        "stepNo": 10,
        "title": "汤汁开后",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "汤汁开后，开小火将腌制好的肉片分开依次下锅，然后开中火将肉片烫熟，用锅铲轻轻推动一下避免粘连，待汤汁烧开，肉片熟后捞出放入碗中配菜上，再将原汤倒入（不超过菜品）。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-11",
        "stepNo": 11,
        "title": "碗中均匀撒上刀口辣椒",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "碗中均匀撒上刀口辣椒、蒜蓉和葱花。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-13-step-12",
        "stepNo": 12,
        "title": "锅洗干净",
        "image": "/static/assets/dishes/real/home-dish-13.jpg",
        "description": "锅洗干净，加入 200g 菜籽油，烧至 7 成热，然后一次性均匀泼在碗中肉片上（注意安全），美味完成。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "再次一个方向搅拌均匀（肉表面就形成了润滑膜，这样会使肉更加鲜嫩）"
    ]
  },
  {
    "id": "home-dish-14",
    "name": "小炒肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-14.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-14.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-14.jpg",
    "description": "小炒肉是一道香辣下饭的经典湘式家常菜，五花肉片焦香不腻，搭配鲜辣椒与豆豉、豆瓣酱炒出浓郁酱香。富含优质蛋白质和脂肪，辣椒能提供丰富的维生素 C，有助开胃暖身。制作难度中等，适合有一定基础的新手尝试，需注意肉片腌制和火候把控。从备料到出锅大约",
    "difficulty": "中等",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-14-ing-1",
        "groupType": "main",
        "name": "五花肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-14-ing-2",
        "groupType": "main",
        "name": "朝天椒",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-14-ing-3",
        "groupType": "side",
        "name": "小米椒",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-14-ing-4",
        "groupType": "side",
        "name": "豆豉",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-14-ing-5",
        "groupType": "seasoning",
        "name": "豆瓣酱",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-14-ing-6",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-14-ing-7",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-14-ing-8",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-14-ing-9",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-14-ing-10",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-14-step-1",
        "stepNo": 1,
        "title": "五花肉切片",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "五花肉切片",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-2",
        "stepNo": 2,
        "title": "肉放入器皿内",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "把肉放入器皿内，加入淀粉、老抽、盐搅拌腌制半小时",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-3",
        "stepNo": 3,
        "title": "葱切段",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "葱切段",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-4",
        "stepNo": 4,
        "title": "小米椒、朝天椒斜刀切",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "小米椒、朝天椒斜刀切好",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-5",
        "stepNo": 5,
        "title": "热锅、倒油",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "热锅、倒油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-6",
        "stepNo": 6,
        "title": "油热后加入五花肉煸炒",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "油热后加入五花肉煸炒。炒至变色后盛出来",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-7",
        "stepNo": 7,
        "title": "加蒜",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "向锅中加蒜，煸出香味，加入豆豉，翻炒均匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-8",
        "stepNo": 8,
        "title": "加入豆瓣酱翻炒均匀",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "加入豆瓣酱翻炒均匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-9",
        "stepNo": 9,
        "title": "加入炒好的五花肉继续",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "加入炒好的五花肉继续的翻炒均匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-10",
        "stepNo": 10,
        "title": "加入小米椒、朝天椒、",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "加入小米椒、朝天椒、葱段翻炒 40 秒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-14-step-11",
        "stepNo": 11,
        "title": "出锅",
        "image": "/static/assets/dishes/real/home-dish-14.jpg",
        "description": "出锅。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-15",
    "name": "孜然牛肉",
    "emoji": "🥩",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-15.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-15.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-15.jpg",
    "description": "孜然牛肉是一道香辣鲜嫩的家常小炒，浓郁的孜然风味与牛肉的软滑、青椒的清脆融合得恰到好处。牛肉富含优质蛋白和铁，搭配青椒还能补充维生素，营养均衡。制作需要一些刀工和火候把控，适合有一定下厨基础的爱好者尝试。算上腌肉和备菜，全程大约 45 分钟",
    "difficulty": "中等",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-15-ing-1",
        "groupType": "main",
        "name": "牛柳或牛肩肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-15-ing-2",
        "groupType": "main",
        "name": "青椒",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-15-ing-3",
        "groupType": "seasoning",
        "name": "孜然",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-15-ing-4",
        "groupType": "side",
        "name": "小米椒",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-15-ing-5",
        "groupType": "seasoning",
        "name": "生抽酱油",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-15-ing-6",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-15-ing-7",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-15-ing-8",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-15-ing-9",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-15-ing-10",
        "groupType": "side",
        "name": "捣药罐",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-15-step-1",
        "stepNo": 1,
        "title": "首先将小米椒切碎",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "首先将小米椒切碎，和孜然粒一起放入捣药罐捣碎成颗粒，这样更入味。如果时间紧张可跳过捣碎步骤",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-2",
        "stepNo": 2,
        "title": "青椒切头去籽（喜欢辣",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "青椒切头去籽（喜欢辣的可不去），切成丝。葱切段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-3",
        "stepNo": 3,
        "title": "牛肉提前解冻",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "牛肉提前解冻，过一边水洗干净，晾干或用厨用纸吸干，将牛肉顺着纹理切成片",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-4",
        "stepNo": 4,
        "title": "然后进行腌肉",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "然后进行腌肉，加入生抽，淀粉，油，均匀搅拌，静止 30 分钟。腌肉方法也可参考学习腌",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-5",
        "stepNo": 5,
        "title": "热锅下油",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "热锅下油，放入葱，爆出香味后放入腌好的牛肉煸炒",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-6",
        "stepNo": 6,
        "title": "牛肉变色后均匀放入孜",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "牛肉变色后均匀放入孜然辣椒颗粒并炒熟",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-7",
        "stepNo": 7,
        "title": "然后下入青椒丝",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "然后下入青椒丝，断生后放盐",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-15-step-8",
        "stepNo": 8,
        "title": "大🔥炒 1 分钟后",
        "image": "/static/assets/dishes/real/home-dish-15.jpg",
        "description": "大🔥炒 1 分钟后关火再翻炒 30 秒保证受热均匀即可出锅",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-16",
    "name": "尖椒炒牛肉",
    "emoji": "🥩",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-16.png",
    "squareImage": "/static/assets/dishes/real/home-dish-16.png",
    "detailImage": "/static/assets/dishes/real/home-dish-16.png",
    "description": "一道家常小炒，咸香微辣，牛肉滑嫩入味，尖椒清脆爽口。牛肉提供优质蛋白和铁，尖椒富含维生素 C，搭配起来营养均衡。虽然腌制需要一些耐心，但操作步骤明确，新手也能上手，难度适中。从备料到出锅大约需要 1 小时。",
    "difficulty": "中等",
    "estimatedMinutes": 38,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-16-ing-1",
        "groupType": "main",
        "name": "牛肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-16-ing-2",
        "groupType": "main",
        "name": "葱、姜、蒜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-16-ing-3",
        "groupType": "side",
        "name": "尖椒",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-16-ing-4",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-16-ing-5",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-16-ing-6",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "适量",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "home-dish-16-step-1",
        "stepNo": 1,
        "title": "蒜剁成蒜泥",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "蒜剁成蒜泥",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-2",
        "stepNo": 2,
        "title": "葱切段",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "葱切段",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-3",
        "stepNo": 3,
        "title": "姜切成姜片",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "姜切成姜片",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-4",
        "stepNo": 4,
        "title": "尖椒切成段",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "尖椒切成段",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-5",
        "stepNo": 5,
        "title": "牛肉放入碗中",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "牛肉放入碗中",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-6",
        "stepNo": 6,
        "title": "加姜、盐、酱油、糖进",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "加姜、盐、酱油、糖进行腌制 30-40 分钟",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-7",
        "stepNo": 7,
        "title": "腌制完姜可以去掉",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "腌制完姜可以去掉",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-8",
        "stepNo": 8,
        "title": "冷油下锅",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "冷油下锅，待油变热至偶有气泡",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-9",
        "stepNo": 9,
        "title": "加入蒜泥",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "加入蒜泥",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-10",
        "stepNo": 10,
        "title": "蒜泥变金黄后加入尖椒",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "蒜泥变金黄后加入尖椒",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-11",
        "stepNo": 11,
        "title": "待尖椒表皮微皱",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "待尖椒表皮微皱，加入腌制好的牛肉翻炒",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-16-step-12",
        "stepNo": 12,
        "title": "翻炒变熟之前加入葱",
        "image": "/static/assets/dishes/real/home-dish-16.png",
        "description": "翻炒变熟之前加入葱，继续翻炒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-17",
    "name": "蒜苔炒肉末",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-17.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-17.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-17.jpg",
    "description": "蒜苔炒肉末是北方家常菜，咸鲜脆嫩，蒜香浓郁。蒜苔富含膳食纤维和维生素，五花肉提供蛋白质，荤素搭配均衡。做法简单，备料轻松，新手也能快速上手。从切配到出锅大约只需 10 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 10,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-17-ing-1",
        "groupType": "main",
        "name": "五花肉薄片",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-17-ing-2",
        "groupType": "main",
        "name": "蒜苔",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-17-ing-3",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-17-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-17-ing-5",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-17-ing-6",
        "groupType": "side",
        "name": "蒜瓣",
        "amount": "适量",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "home-dish-17-step-1",
        "stepNo": 1,
        "title": "蒜苔切成 5cm 小",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "蒜苔切成 5cm 小段，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-2",
        "stepNo": 2,
        "title": "五花肉切成 5mm ",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "五花肉切成 5mm 5cm 丝状，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-3",
        "stepNo": 3,
        "title": "蒜瓣拍碎切成末",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "蒜瓣拍碎切成末，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-4",
        "stepNo": 4,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "热锅，锅内放入 10ml 食用油。等待 10 秒让油温升高",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-5",
        "stepNo": 5,
        "title": "放入蒜末",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "放入蒜末，中火翻炒 10 秒 将蒜末炒出香味",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-6",
        "stepNo": 6,
        "title": "放入五花肉和 5ml",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "放入五花肉和 5ml 生抽，中火翻炒 30 秒 将肉炒熟并上色",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-7",
        "stepNo": 7,
        "title": "蒜苔放入锅内并加入 ",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "将蒜苔放入锅内并加入 10ml 生抽，翻炒 30 秒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-8",
        "stepNo": 8,
        "title": "锅内加入 20g 水",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "锅内加入 20g 水，中火翻炒 5 分钟 将蒜苔炒至稍稍变软",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-17-step-9",
        "stepNo": 9,
        "title": "最后加入 2g 食盐",
        "image": "/static/assets/dishes/real/home-dish-17.jpg",
        "description": "最后加入 2g 食盐，中火翻炒 30 秒，即可出锅装盘",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-18",
    "name": "鱼香茄子",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-18.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-18.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-18.jpg",
    "description": "鱼香茄子是一道经典的川味家常菜，酸甜微辣，茄子软糯吸汁，非常下饭。茄子富含膳食纤维和多种维生素，搭配肉末能补充蛋白质。制作难度中等，需要掌握炸茄子和调味技巧，新手稍加练习也能成功。从备料到出锅大约需要 30 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 30,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-18-ing-1",
        "groupType": "main",
        "name": "茄子",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-18-ing-2",
        "groupType": "main",
        "name": "肉末",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-18-ing-3",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-18-ing-4",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-18-ing-5",
        "groupType": "seasoning",
        "name": "味精",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-18-ing-6",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-18-ing-7",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-18-ing-8",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-18-ing-9",
        "groupType": "seasoning",
        "name": "水淀粉",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-18-ing-10",
        "groupType": "seasoning",
        "name": "豆瓣酱",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-18-step-1",
        "stepNo": 1,
        "title": "茄子切成条",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "将茄子切成条。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-2",
        "stepNo": 2,
        "title": "肉切成肉沫",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "将肉切成肉沫，葱姜蒜切碎、小米椒切丁。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-3",
        "stepNo": 3,
        "title": "调鱼香汁：碗中放入盐",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "调鱼香汁：碗中放入盐、味精、糖、生抽、老抽、醋、水淀粉搅拌均匀。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-4",
        "stepNo": 4,
        "title": "倒入 300ml 油",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "锅中倒入 300ml 油，开小火（小火容易掌控），等油温七成热（小火大约 40 秒，有烟冒出）放入茄子炸两分钟，当茄子边缘微黄就捞出。多出的油可以盛出以后炒菜用。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-5",
        "stepNo": 5,
        "title": "留 15-30ml ",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "锅中留 15-30ml 油，倒入肉沫炒至颜色变白就盛出来。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-6",
        "stepNo": 6,
        "title": "倒入 15-30ml",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "锅中倒入 15-30ml 油，放入豆瓣酱、葱白、姜、蒜炒香，然后倒入肉沫翻炒均匀。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-18-step-7",
        "stepNo": 7,
        "title": "加入 80-150m",
        "image": "/static/assets/dishes/real/home-dish-18.jpg",
        "description": "加入 80-150ml 清水（水面预计茄子八成高度为准），倒入茄子、倒入料汁，爆炒入味收汁。最后放入葱翻炒均匀，就可以起锅了。",
        "heat": "小火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-19",
    "name": "辣椒炒肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-19.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-19.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-19.jpg",
    "description": "辣椒炒肉是一道湘味浓郁的家常菜，辣椒干香微焦，肉片滑嫩入味，咸鲜微辣十分下饭。猪肉富含优质蛋白质和 B 族维生素，青椒则提供丰富的维生素 C。这道菜需要掌握干煸和快炒的火候，适合有一定烹饪基础的朋友尝试。从备料到出锅，大约需要 30 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 30,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-19-ing-1",
        "groupType": "main",
        "name": "青椒的数量",
        "amount": "份数 3 个。",
        "sortOrder": 0
      },
      {
        "id": "home-dish-19-ing-2",
        "groupType": "main",
        "name": "肉量",
        "amount": "份数 200g。",
        "sortOrder": 1
      },
      {
        "id": "home-dish-19-ing-3",
        "groupType": "seasoning",
        "name": "盐量",
        "amount": "份数 3g。",
        "sortOrder": 2
      },
      {
        "id": "home-dish-19-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "份数 3ml。",
        "sortOrder": 3
      },
      {
        "id": "home-dish-19-ing-5",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "份数 3ml。",
        "sortOrder": 4
      },
      {
        "id": "home-dish-19-ing-6",
        "groupType": "side",
        "name": "大蒜",
        "amount": "份数 5g。",
        "sortOrder": 5
      },
      {
        "id": "home-dish-19-ing-7",
        "groupType": "side",
        "name": "生姜",
        "amount": "份数 5g。",
        "sortOrder": 6
      },
      {
        "id": "home-dish-19-ing-8",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "份数 2ml。",
        "sortOrder": 7
      },
      {
        "id": "home-dish-19-ing-9",
        "groupType": "side",
        "name": "豆豉",
        "amount": "份数 3g。",
        "sortOrder": 8
      }
    ],
    "steps": [
      {
        "id": "home-dish-19-step-1",
        "stepNo": 1,
        "title": "青椒洗净",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "将青椒洗净，去除青椒把以及青椒籽，再用滚刀手法切好备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-2",
        "stepNo": 2,
        "title": "大蒜用刀拍一下",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "大蒜用刀拍一下，再横切成蒜瓣，生姜切碎成姜末。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-3",
        "stepNo": 3,
        "title": "猪瘦肉切成肉片（顺着",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "将猪瘦肉切成肉片（顺着猪肉的纹理切，即刀和肉的纹理呈水平线，出来的肉片，纹路呈“川”字）。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-4",
        "stepNo": 4,
        "title": "切好的猪肉洗净",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "将切好的猪肉洗净，放入空碗，再加入计算好的生抽、蚝油、盐搅拌均匀，腌制 10 分钟。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-5",
        "stepNo": 5,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "热锅，不用倒油，把切好的青椒放入锅中，大火干煸至虎皮状后，再加 2g盐继续翻炒 1 分钟 后捞起。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-6",
        "stepNo": 6,
        "title": "不用洗锅",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "不用洗锅，大火热锅，加入份数 8ml油，等待 30s，加入蒜瓣、姜末翻炒 15s。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-7",
        "stepNo": 7,
        "title": "加入腌制好的猪肉倒入",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "加入腌制好的猪肉倒入锅内翻炒 2 分钟，再加入干煸过的青椒翻炒 1 分钟。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-8",
        "stepNo": 8,
        "title": "根据个人口味喜好加入",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "根据个人口味喜好加入豆豉，最后加入酱油，继续翻炒 30s。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-19-step-9",
        "stepNo": 9,
        "title": "出锅",
        "image": "/static/assets/dishes/real/home-dish-19.jpg",
        "description": "出锅，盛盘。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-20",
    "name": "香菇滑鸡",
    "emoji": "🍗",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-20.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-20.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-20.jpg",
    "description": "香菇滑鸡是一道以鸡腿肉和香菇为主料的家常菜，鸡腿肉经过煸炒和焖煮后口感滑嫩，搭配香菇独特的菌香，汤汁浓郁鲜美，属于老少皆宜的粤式风味。鸡肉富含优质蛋白质和多种氨基酸，香菇含有香菇多糖和膳食纤维，有助于增强免疫力和促进消化。这道菜需要一些刀工",
    "difficulty": "中等",
    "estimatedMinutes": 36,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-20-ing-1",
        "groupType": "main",
        "name": "大鸡腿",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-20-ing-2",
        "groupType": "main",
        "name": "干香菇",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-20-ing-3",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-20-ing-4",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-20-ing-5",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "home-dish-20-step-1",
        "stepNo": 1,
        "title": "温水泡发干香菇",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "温水泡发干香菇",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-2",
        "stepNo": 2,
        "title": "姜切小块",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "姜切小块，葱切段，蒜对半切小粒",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-3",
        "stepNo": 3,
        "title": "鸡腿去骨（不去骨也可",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "鸡腿去骨（不去骨也可，只是略影响程序员吃饭的效率而已），切成小块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-4",
        "stepNo": 4,
        "title": "泡发的香菇一分为四",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "泡发的香菇一分为四，香菇水留着备用",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-5",
        "stepNo": 5,
        "title": "鸡腿肉焯水 1 分钟",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "鸡腿肉焯水 1 分钟，去除血沫和杂质",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-6",
        "stepNo": 6,
        "title": "鸡腿肉中加料酒 15",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "鸡腿肉中加料酒 15ml、生抽 15ml、盐 1.5g、老抽 15ml，抓匀",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-7",
        "stepNo": 7,
        "title": "油温 3 成",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "油温 3 成，下入鸡腿肉煸炒，等鸡腿肉金黄后盛出备用",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-8",
        "stepNo": 8,
        "title": "锅留底油",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "锅留底油，下入葱、姜、蒜炒香，香菇入锅，大火翻匀",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-9",
        "stepNo": 9,
        "title": "等待 20 秒会有香",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "等待 20 秒会有香菇香味从锅中飘出，此时下入煸炒过的鸡腿肉，下入香菇水（全部，本程序员认为的灵魂操作）、糖 15ml、生抽 30ml",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-20-step-10",
        "stepNo": 10,
        "title": "转中火不盖盖",
        "image": "/static/assets/dishes/real/home-dish-20.jpg",
        "description": "转中火不盖盖，咕嘟 2 分钟收浓汤汁，淋入香油 5ml，撒上葱花后即可关火、装盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-21",
    "name": "土豆炖排骨",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-21.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-21.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-21.jpg",
    "description": "排骨软烂脱骨，土豆绵软入味，酱香浓郁微甜微辣，是一道典型的北方家常炖菜。富含蛋白质、钙质和碳水化合物，营养均衡。制作略有难度，需掌握炒糖色与火候，但步骤清晰，新手也能尝试，全程大约 1.5 小时。",
    "difficulty": "中等",
    "estimatedMinutes": 47,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-21-ing-1",
        "groupType": "main",
        "name": "肋排",
        "amount": "750g",
        "sortOrder": 0
      },
      {
        "id": "home-dish-21-ing-2",
        "groupType": "main",
        "name": "土豆",
        "amount": "300g",
        "sortOrder": 1
      },
      {
        "id": "home-dish-21-ing-3",
        "groupType": "side",
        "name": "姜",
        "amount": "30g （分为两份：15g 焯水用",
        "sortOrder": 2
      },
      {
        "id": "home-dish-21-ing-4",
        "groupType": "side",
        "name": "小葱",
        "amount": "25g （分为两份：15g 打成葱结",
        "sortOrder": 3
      },
      {
        "id": "home-dish-21-ing-5",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "25ml （分为两份：15ml 焯水用",
        "sortOrder": 4
      },
      {
        "id": "home-dish-21-ing-6",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "10g",
        "sortOrder": 5
      },
      {
        "id": "home-dish-21-ing-7",
        "groupType": "side",
        "name": "干辣椒",
        "amount": "5g",
        "sortOrder": 6
      },
      {
        "id": "home-dish-21-ing-8",
        "groupType": "seasoning",
        "name": "八角",
        "amount": "1g （约 1-2 颗）",
        "sortOrder": 7
      },
      {
        "id": "home-dish-21-ing-9",
        "groupType": "seasoning",
        "name": "花椒",
        "amount": "1g （约 10 粒）",
        "sortOrder": 8
      },
      {
        "id": "home-dish-21-ing-10",
        "groupType": "seasoning",
        "name": "桂皮",
        "amount": "1g （一小块）",
        "sortOrder": 9
      },
      {
        "id": "home-dish-21-ing-11",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "10ml",
        "sortOrder": 10
      },
      {
        "id": "home-dish-21-ing-12",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "5ml",
        "sortOrder": 11
      },
      {
        "id": "home-dish-21-ing-13",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "5ml",
        "sortOrder": 12
      },
      {
        "id": "home-dish-21-ing-14",
        "groupType": "seasoning",
        "name": "黄豆酱",
        "amount": "5g",
        "sortOrder": 13
      },
      {
        "id": "home-dish-21-ing-15",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "3g （最后收汁调味用）",
        "sortOrder": 14
      },
      {
        "id": "home-dish-21-ing-16",
        "groupType": "side",
        "name": "开水",
        "amount": "700ml",
        "sortOrder": 15
      }
    ],
    "steps": [
      {
        "id": "home-dish-21-step-1",
        "stepNo": 1,
        "title": "处理土豆： 将 30",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "处理土豆： 将 300g 土豆去皮，切成不规则的滚刀块 。切好后立刻泡入一盆清水中，隔绝氧气防止表面氧化发黑，备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-2",
        "stepNo": 2,
        "title": "处理葱姜： 将 30",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "处理葱姜： 将 30g 姜全部切成薄片（分成两份 15g）。将 25g 小葱处理好：15g 挽成一个葱结，剩余 10g 切成细小葱花备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-3",
        "stepNo": 3,
        "title": "封装酱汁碗（一键调用",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "封装酱汁碗（一键调用）： 拿一个小碗，依次加入 10ml 生抽、5ml 老抽、5ml 蚝油、5ml 黄豆酱，彻底搅拌均匀，放在灶台触手可及处备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-4",
        "stepNo": 4,
        "title": "封装香料碟（一键调用",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "封装香料碟（一键调用）： 拿一个小碟，放入 5g 干辣椒、1g 八角（约 1-2 颗）、1g 花椒（约 10 粒）、1g 桂皮（一小块），以及刚才切好的 15g 姜片，备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-5",
        "stepNo": 5,
        "title": "开启异步水程： 按下",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "开启异步水程： 按下电热水壶开关，开始烧制 700ml 开水。（确保炒制完成时，开水刚好就绪）。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-6",
        "stepNo": 6,
        "title": "冷水焯水： 将 75",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "冷水焯水： 将 750g 肋排冷水下锅，加入 15g 葱结、15g 姜片、15ml 料酒。大火煮沸后，继续保持沸腾焯水 2 分钟，逼出内部血沫。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-7",
        "stepNo": 7,
        "title": "热洗冷防： 捞出排骨",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "热洗冷防： 捞出排骨，必须用热水将排骨表面残留的浮沫清洗干净（遇冷水肉质会剧烈收缩变硬）。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-8",
        "stepNo": 8,
        "title": "绝对脱水（防爆防溅）",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "绝对脱水（防爆防溅）： 洗净的排骨必须用厨房纸彻底吸干表面水分，装盘放在炒锅旁边备用（防止后续下入高温糖色时发生剧烈炸锅）。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-9",
        "stepNo": 9,
        "title": "炒制糖色： 热锅凉油",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "炒制糖色： 热锅凉油，加入 20ml 食用油。将 10g 白糖倒入锅中，中小火不停搅拌。翻炒至白糖完全融化冒泡，并呈现红棕色的焦糖色 。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-10",
        "stepNo": 10,
        "title": "上色煎制： 迅速加入",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "上色煎制： 迅速加入彻底脱水的 750g 排骨，转中大火翻炒。煎制约 2-3 分钟，至排骨两面微微金黄，且均匀裹满焦糖色。",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-11",
        "stepNo": 11,
        "title": "一键爆香： 在锅中拨",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "一键爆香： 在锅中拨出一小块空地，直接倒入【香料碟】。利用锅底的热油爆香约 10 秒，激发出香料的脂溶性香气。",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-21-step-12",
        "stepNo": 12,
        "title": "一键调味： 顺着热锅",
        "image": "/static/assets/dishes/real/home-dish-21.jpg",
        "description": "一键调味： 顺着热锅边缘淋入剩余的 10ml 料酒激发出锅气。紧接着直接倒入【酱汁碗】，翻炒约 30 秒，让酱料完全包裹排骨并炒出浓郁酱香。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-22",
    "name": "梅菜扣肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-22.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-22.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-22.jpg",
    "description": "这是一道客家传统名菜，成菜酱红油亮、汤汁黏稠，扣肉肥而不腻、软烂醇香。五花肉富含优质蛋白和脂肪酸，搭配梅干菜能提供膳食纤维。整体工序稍多，需要掌握煮、炸、蒸的火候，对新手有一定挑战。从备料到出锅，连同浸泡梅菜的时间在内，大约需要 2.5 小",
    "difficulty": "较难",
    "estimatedMinutes": 43,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-22-ing-1",
        "groupType": "main",
        "name": "五花肉",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-22-ing-2",
        "groupType": "main",
        "name": "梅菜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-22-ing-3",
        "groupType": "side",
        "name": "五香粉",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-22-ing-4",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-22-ing-5",
        "groupType": "seasoning",
        "name": "白砂糖",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-22-ing-6",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-22-ing-7",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-22-ing-8",
        "groupType": "side",
        "name": "小米椒",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-22-ing-9",
        "groupType": "side",
        "name": "蒜末",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-22-ing-10",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-22-ing-11",
        "groupType": "seasoning",
        "name": "鸡精",
        "amount": "适量",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "home-dish-22-step-1",
        "stepNo": 1,
        "title": "梅菜放到清水中",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "梅菜放到清水中，浸泡 1 小时",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-2",
        "stepNo": 2,
        "title": "倒入 50 ml 食",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "锅中倒入 50 ml 食用油，将整个五花肉猪皮朝下，放到锅中 1 分钟 ，取出挂掉猪皮 【可选】",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-3",
        "stepNo": 3,
        "title": "加入开水",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "锅中加入开水，放入五花肉，大火煮 20 分钟 （筷子可以插进五花肉），取出五花肉",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-4",
        "stepNo": 4,
        "title": "在五花肉表面涂抹均匀",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "在五花肉表面涂抹均匀老抽、五香粉、白砂糖，放置 15 分钟",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-5",
        "stepNo": 5,
        "title": "起锅烧油",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "起锅烧油，加入五花肉，中火油炸直至两面金黄色（3-5 分钟）",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-6",
        "stepNo": 6,
        "title": "起锅烧油",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "起锅烧油，倒入梅菜，加上小米椒、蒜蓉、鸡精、食用盐后翻炒，直至炒干梅干菜水分",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-7",
        "stepNo": 7,
        "title": "五花肉切片（后端 0",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "五花肉切片（后端 0.5-1 cm）,放在大碗中，散上梅干菜",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-8",
        "stepNo": 8,
        "title": "中火蒸 45 分钟",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "中火蒸 45 分钟",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-22-step-9",
        "stepNo": 9,
        "title": "拿个盘子倒盖在五花肉",
        "image": "/static/assets/dishes/real/home-dish-22.jpg",
        "description": "拿个盘子倒盖在五花肉大碗中，将五花肉倒在盘子中",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-23",
    "name": "红烧鸡翅",
    "emoji": "🍗",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-23.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-23.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-23.jpg",
    "description": "红烧鸡翅是一道家常下饭菜，咸鲜带甜、色泽红亮，肉质嫩滑易脱骨。鸡翅富含优质蛋白质与胶原蛋白，营养好吸收。制作难度适中，新手按步骤操作也能顺利掌握，从备料到出锅大约需要 40 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-23-ing-1",
        "groupType": "main",
        "name": "新鲜鸡翅",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-23-ing-2",
        "groupType": "main",
        "name": "姜片",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-23-ing-3",
        "groupType": "side",
        "name": "葱段",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-23-ing-4",
        "groupType": "side",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-23-ing-5",
        "groupType": "seasoning",
        "name": "香叶",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-23-ing-6",
        "groupType": "seasoning",
        "name": "八角",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-23-ing-7",
        "groupType": "side",
        "name": "干辣椒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-23-ing-8",
        "groupType": "seasoning",
        "name": "冰糖",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-23-ing-9",
        "groupType": "seasoning",
        "name": "黄酒或料酒",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-23-ing-10",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-23-ing-11",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 10
      },
      {
        "id": "home-dish-23-ing-12",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 11
      },
      {
        "id": "home-dish-23-ing-13",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 12
      },
      {
        "id": "home-dish-23-ing-14",
        "groupType": "seasoning",
        "name": "胡椒粉",
        "amount": "适量",
        "sortOrder": 13
      },
      {
        "id": "home-dish-23-ing-15",
        "groupType": "side",
        "name": "白芝麻",
        "amount": "适量",
        "sortOrder": 14
      },
      {
        "id": "home-dish-23-ing-16",
        "groupType": "side",
        "name": "小葱花",
        "amount": "适量",
        "sortOrder": 15
      }
    ],
    "steps": [
      {
        "id": "home-dish-23-step-1",
        "stepNo": 1,
        "title": "鸡翅洗净",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "将鸡翅洗净。用刀在鸡翅厚处划三刀，背面扎一刀，便于入味。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-2",
        "stepNo": 2,
        "title": "如果鸡翅不新鲜",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "如果鸡翅不新鲜，可在打完花刀之后用姜水泡 10-20 分钟。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-3",
        "stepNo": 3,
        "title": " 10g 姜片（3-",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "将 10g 姜片（3-4 片）、15g 葱段（2-3 段）备好；3-4 瓣大蒜（约 15g）用刀拍散（无需剁碎）；1 片香叶、1 个八角、2 个干辣椒（可选）整理好备用。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-4",
        "stepNo": 4,
        "title": "起锅开火",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "起锅开火，锅中加入清水没过所有鸡翅，冷水下锅放入处理好的鸡翅，加入 20ml 黄酒或料酒、2 片姜片（约 5g），开大火烧至沸腾，沸腾后保持大火继续煮 2-3 分钟，撇去浮沫。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-5",
        "stepNo": 5,
        "title": "煮好后将鸡翅捞出",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "煮好后将鸡翅捞出，用温水清洗 2 遍，彻底去除血沫，控干水分备用。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-6",
        "stepNo": 6,
        "title": "另起锅",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "另起锅，开火烧热后放入 10-15ml 食用油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-7",
        "stepNo": 7,
        "title": "待油温至 5 成热",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "待油温至 5 成热，加入 15g 冰糖，开大火将冰糖熬至完全融化，冰糖融化变色后转小火，继续炒至冰糖呈枣红色，立即放入控干水分的鸡翅，快速翻炒 1-2 分钟，使每只鸡翅均匀裹上糖色。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-8",
        "stepNo": 8,
        "title": "加入准备好的 1 片",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "加入准备好的 1 片香叶、1 个八角、2 个干辣椒（可选）、剩下的 2 片姜片（约 5g）、15g 葱段、拍散的大蒜，继续煸炒 30 秒至香料香味完全释放。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-9",
        "stepNo": 9,
        "title": "沿锅边淋入 15ml",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "沿锅边淋入 15ml 料酒或黄酒，15ml 生抽，快速翻炒 10 秒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-10",
        "stepNo": 10,
        "title": "加入温水（水温约 5",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "加入温水（水温约 50-60℃），水量以稍微没过所有鸡翅为准。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-11",
        "stepNo": 11,
        "title": "加入 5ml 老抽、",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "加入 5ml 老抽、3g 盐、2g 白糖、1g 胡椒粉，用炒勺轻轻搅拌均匀。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-23-step-12",
        "stepNo": 12,
        "title": "盖上锅盖",
        "image": "/static/assets/dishes/real/home-dish-23.jpg",
        "description": "盖上锅盖，开中火烧煮 7-8 分钟。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-24",
    "name": "西红柿牛腩",
    "emoji": "🥩",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-24.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-24.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-24.jpg",
    "description": "西红柿牛腩汤汁浓厚酸甜可口，牛肉软绵醇香，是道开胃下饭的家常菜。富含蛋白质、维生素和番茄红素，营养均衡。对新手有一定挑战，需要掌握炖肉火候和番茄炒汁的技巧。一般初学者大约需要 90 分钟完成。",
    "difficulty": "较难",
    "estimatedMinutes": 90,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-24-ing-1",
        "groupType": "main",
        "name": "西红柿",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-24-ing-2",
        "groupType": "main",
        "name": "牛腩",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-24-ing-3",
        "groupType": "side",
        "name": "燃气灶",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-24-ing-4",
        "groupType": "side",
        "name": "2cm 两段葱段、两片姜片，葱花、姜各 10g",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-24-ing-5",
        "groupType": "seasoning",
        "name": "生抽、白胡椒粉，白糖，料/黄酒，八角三小片",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "home-dish-24-step-1",
        "stepNo": 1,
        "title": "牛腩切条、切块成长宽",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "牛腩切条、切块成长宽高均 2cm ，冷水下锅，开锅煮制 2 分钟去除血水，捞出冲洗干净",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-24-step-2",
        "stepNo": 2,
        "title": "另起锅 2L 水烧开",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "另起锅 2L 水烧开，加入 2cm 两段葱段、两片姜片、八角、料/黄酒 5-10ml，放入焯好的牛肉，盖盖炖制（砂锅 1 小时，高压锅炖肉模式 45 分钟），筷子能轻松插透就证明炖好了",
        "heat": "小火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-24-step-3",
        "stepNo": 3,
        "title": "西红柿去皮：西红柿头",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "西红柿去皮：西红柿头部滑十字至腰线，筷子/刀叉从果蒂捅入，煤气灶小火，一边转动一边烤，及时拿下来查看，起皮后撕下来，切块。越小越好 注意：撕皮小心烫，去皮后的西红柿特别滑，慢切注意安全",
        "heat": "无",
        "minutes": 12,
        "tips": "撕皮小心烫，去皮后的西红柿特别滑，慢切注意安全"
      },
      {
        "id": "home-dish-24-step-4",
        "stepNo": 4,
        "title": "起锅烧油",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "起锅烧油，油温 7 成热，葱、姜各 10g，番茄下锅，炒透炒出番茄红色，加入煮好的牛腩和原汤，原汤刚刚没过牛肉即可",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-24-step-5",
        "stepNo": 5,
        "title": "根据个人口味放入盐、",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "根据个人口味放入盐、糖、生抽调味盖盖",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-24-step-6",
        "stepNo": 6,
        "title": "开锅后大火继续炒制 ",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "开锅后大火继续炒制 3-5 分钟",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-24-step-7",
        "stepNo": 7,
        "title": "待番茄汁呈中等粘稠程",
        "image": "/static/assets/dishes/real/home-dish-24.jpg",
        "description": "待番茄汁呈中等粘稠程度后关火，散入葱花，盛盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "撕皮小心烫，去皮后的西红柿特别滑，慢切注意安全"
    ]
  },
  {
    "id": "home-dish-25",
    "name": "青椒土豆炒肉",
    "emoji": "🍽️",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-25.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-25.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-25.jpg",
    "description": "青椒土豆炒肉是一道荤素搭配的家常小炒，口感鲜香脆嫩，酱香浓郁，特别下饭。土豆富含碳水化合物和维生素 C，青椒提供丰富的维生素 C 和膳食纤维，搭配猪肉的优质蛋白质，营养均衡。这道菜做法不复杂，对新手比较友好，从备料到出锅大约只需 1 小时。",
    "difficulty": "中等",
    "estimatedMinutes": 18,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-25-ing-1",
        "groupType": "main",
        "name": "青椒",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-25-ing-2",
        "groupType": "main",
        "name": "土豆",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-25-ing-3",
        "groupType": "side",
        "name": "猪肉",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-25-ing-4",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-25-ing-5",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-25-ing-6",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-25-ing-7",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-25-ing-8",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-25-ing-9",
        "groupType": "seasoning",
        "name": "土豆淀粉",
        "amount": "适量",
        "sortOrder": 8
      }
    ],
    "steps": [
      {
        "id": "home-dish-25-step-1",
        "stepNo": 1,
        "title": "青椒去除根蒂切小块",
        "image": "/static/assets/dishes/real/home-dish-25.jpg",
        "description": "青椒去除根蒂切小块，土豆去皮切 2mm 薄片，猪肉切 4mm 薄片，葱横纵切 3mm 小段，姜蒜去皮拍散剁碎末；土豆淀粉加入约 15g 水搅拌均匀至水淀粉。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-25-step-2",
        "stepNo": 2,
        "title": "起锅烧油",
        "image": "/static/assets/dishes/real/home-dish-25.jpg",
        "description": "起锅烧油，加热至 7 成热放入猪肉片，缓缓翻滚炒至去肉红色，加入约 3ml 酱油，翻炒肉片均匀上色，放入约 2g 盐。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-25-step-3",
        "stepNo": 3,
        "title": "转 5 成油温",
        "image": "/static/assets/dishes/real/home-dish-25.jpg",
        "description": "转 5 成油温，加入葱姜蒜炒 5 秒，然后加入土豆片，转 7 成油温均匀翻炒，加入加入约 5ml 酱油和 2g 盐，炒至土豆断生，表面轻微焦黄。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-25-step-4",
        "stepNo": 4,
        "title": "转 8 成油温加入青",
        "image": "/static/assets/dishes/real/home-dish-25.jpg",
        "description": "转 8 成油温加入青椒，大火煸炒出锅气（有白烟冒出），反复均匀翻炒 1 分钟上色，最后在锅周围倒入水淀粉转 4 成火勾芡。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-25-step-5",
        "stepNo": 5,
        "title": "在外观呈粘稠状态后关",
        "image": "/static/assets/dishes/real/home-dish-25.jpg",
        "description": "在外观呈粘稠状态后关火，盛盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-26",
    "name": "清蒸鲈鱼",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-26.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-26.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-26.jpg",
    "description": "清蒸鲈鱼是一道粤式经典蒸菜，鱼肉细嫩爽滑，味道清淡鲜美，能最大程度保留鲈鱼的原汁原味。鲈鱼富含优质蛋白和 DHA，营养丰富且易于消化。这道菜操作简单，对新手非常友好，从备料到出锅大约只需三十分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 72,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-26-ing-1",
        "groupType": "main",
        "name": "鲈鱼",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-26-ing-2",
        "groupType": "main",
        "name": "香葱",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-26-ing-3",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-26-ing-4",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-26-ing-5",
        "groupType": "seasoning",
        "name": "蒸鱼豉油",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-26-ing-6",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-26-ing-7",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 6
      }
    ],
    "steps": [
      {
        "id": "home-dish-26-step-1",
        "stepNo": 1,
        "title": "姜切片切丝、香葱的葱",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "姜切片切丝、香葱的葱白切段，葱绿切丝，切丝后放入冷水浸泡备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-2",
        "stepNo": 2,
        "title": "鲈鱼处理好后洗净",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "鲈鱼处理好后洗净，用厨房纸擦干，两面分别划几刀，用盐洗掉鱼身的粘液，并用 10g 盐抹遍鱼身的内外，腌制 10 分钟以上。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-3",
        "stepNo": 3,
        "title": "补充一个鲈鱼改刀和摆",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "补充一个鲈鱼改刀和摆盘的方法，改刀后可以让鲈鱼立起来蒸，均匀受热，同时吃起来更加方便，无需翻面。",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-4",
        "stepNo": 4,
        "title": "鱼肚内塞上姜和葱白",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "鱼肚内塞上姜和葱白，鱼身也撒上姜和葱白，量为备用的一半。蒸鱼的碟子用筷子将鱼跟碟子隔开蒸",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-5",
        "stepNo": 5,
        "title": "水烧热感觉到水温后放",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "水烧热感觉到水温后放进入鱼",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-6",
        "stepNo": 6,
        "title": "大火清蒸 10 分钟",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "大火清蒸 10 分钟。",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-7",
        "stepNo": 7,
        "title": "蒸好的鱼",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "蒸好的鱼，用干净的盘子装起来并去除身上姜蒜",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-8",
        "stepNo": 8,
        "title": "鱼身浇上 15ml ",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "鱼身浇上 15ml 蒸鱼豉油",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-26-step-9",
        "stepNo": 9,
        "title": "鱼身重新撒上姜和葱丝",
        "image": "/static/assets/dishes/real/home-dish-26.jpg",
        "description": "鱼身重新撒上姜和葱丝，锅内加上 10ml 食用油并烧热，将食用油淋至鱼身即可出菜",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-27",
    "name": "红烧鱼",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-27.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-27.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-27.jpg",
    "description": "红烧鱼是一道家常风味浓郁的经典菜，咸鲜微甜，鱼肉嫩滑入味，属于大众喜爱的中式烧菜。鱼肉富含优质蛋白和不饱和脂肪酸，营养易吸收。制作时需要处理生鱼和油煎，步骤稍多，对新手有一定挑战，但跟着菜谱操作也能成功。从备料到出锅，大约需要 40 分钟。",
    "difficulty": "较难",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-27-ing-1",
        "groupType": "main",
        "name": "姜、蒜瓣、干辣椒",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-27-ing-2",
        "groupType": "seasoning",
        "name": "油、盐、料酒、醋、酱油、白砂糖",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-27-ing-3",
        "groupType": "side",
        "name": "鱼",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-27-ing-4",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-27-ing-5",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-27-ing-6",
        "groupType": "side",
        "name": "香菜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-27-ing-7",
        "groupType": "side",
        "name": "小米椒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-27-ing-8",
        "groupType": "seasoning",
        "name": "味精",
        "amount": "适量",
        "sortOrder": 7
      }
    ],
    "steps": [
      {
        "id": "home-dish-27-step-1",
        "stepNo": 1,
        "title": "姜蒜准备好",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "姜蒜准备好，切碎",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-2",
        "stepNo": 2,
        "title": "干辣椒切碎",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "干辣椒切碎，和姜蒜一起",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-3",
        "stepNo": 3,
        "title": "加入 30-50ml",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "加入 30-50ml 油，等待锅热...",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-4",
        "stepNo": 4,
        "title": "放入擦干水分的鱼（不",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "放入擦干水分的鱼（不想被热油溅一身的话），然后晃动锅，用热油煎鱼，注意这过程一定要小火",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-5",
        "stepNo": 5,
        "title": "鱼翻面",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "将鱼翻面，重复上面油煎过程",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-6",
        "stepNo": 6,
        "title": "放入姜蒜辣椒",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "放入姜蒜辣椒，翻炒出香味",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-7",
        "stepNo": 7,
        "title": "倒入料酒",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "倒入料酒，稍微多一点，此过程注意安全，会起大量油烟",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-8",
        "stepNo": 8,
        "title": "倒入醋（喜欢醋可以多",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "倒入醋（喜欢醋可以多放一点）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-9",
        "stepNo": 9,
        "title": "然后放入白砂糖",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "然后放入白砂糖，酱油（老抽)",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-10",
        "stepNo": 10,
        "title": "加入冷水",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "加入冷水，以刚好淹没鱼身为宜，然后调成中火，盖上锅盖，大概 1 分钟后将鱼翻身，继续盖上锅盖",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-11",
        "stepNo": 11,
        "title": "3-4 分钟后",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "3-4 分钟后，加入盐、小米椒、蚝油（味精、鸡精等），然后继续盖上锅盖，后续继续要翻身",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-27-step-12",
        "stepNo": 12,
        "title": "当锅内汤汁收汁到鱼的",
        "image": "/static/assets/dishes/real/home-dish-27.jpg",
        "description": "当锅内汤汁收汁到鱼的脊背线上的鱼鳍下面一点点的时候（或者汤汁不多的时候），转小火，加入香菜，葱花，然后盖上锅盖 20 秒，关火",
        "heat": "小火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-28",
    "name": "水煮鱼",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-28.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-28.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-28.jpg",
    "description": "水煮鱼是一道麻辣鲜香、鱼肉嫩滑的经典川菜。巴沙鱼富含优质蛋白且脂肪含量低，搭配时令蔬菜营养均衡。做法中等难度，对新手有一定挑战，但按步骤操作也能成功。预计制作时长约 2 小时。",
    "difficulty": "较难",
    "estimatedMinutes": 37,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-28-ing-1",
        "groupType": "main",
        "name": "巴沙鱼",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-28-ing-2",
        "groupType": "main",
        "name": "蔬菜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-28-ing-3",
        "groupType": "seasoning",
        "name": "红油豆瓣酱",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-28-ing-4",
        "groupType": "seasoning",
        "name": "藤椒油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-28-ing-5",
        "groupType": "seasoning",
        "name": "菜籽油",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-28-ing-6",
        "groupType": "seasoning",
        "name": "白胡椒粉",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-28-ing-7",
        "groupType": "side",
        "name": "蒜瓣",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-28-ing-8",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-28-ing-9",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-28-ing-10",
        "groupType": "side",
        "name": "量杯",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-28-ing-11",
        "groupType": "side",
        "name": "厨房秤",
        "amount": "适量",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "home-dish-28-step-1",
        "stepNo": 1,
        "title": "准备：巴沙鱼若是从冷",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "准备：巴沙鱼若是从冷冻柜里取出，需要放室温自然解冻 5 小时再做切片处理。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-2",
        "stepNo": 2,
        "title": "切片：巴沙鱼撇成薄片",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "切片：巴沙鱼撇成薄片，约 5cm 长，3cm 宽。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-3",
        "stepNo": 3,
        "title": "腌制：将切好片的巴沙",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "腌制：将切好片的巴沙鱼放入大不锈钢碗中",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-4",
        "stepNo": 4,
        "title": "加入 30g 豆瓣酱",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "加入 30g 豆瓣酱，3g 盐，10ml 藤椒油，3g 白胡椒粉",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-5",
        "stepNo": 5,
        "title": "用手抓匀后加入 5m",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "用手抓匀后加入 5ml 菜籽油收尾封住口味",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-6",
        "stepNo": 6,
        "title": "常温静置至少 30 ",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "常温静置至少 30 分钟入味。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-7",
        "stepNo": 7,
        "title": "备菜：大蒜切成蒜末",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "备菜：大蒜切成蒜末。以 300g 花菜，200g 生菜为例，将花菜与生菜洗净。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-8",
        "stepNo": 8,
        "title": "焯水与炒菜：花菜开水",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "焯水与炒菜：花菜开水锅焯水备用；将生菜洗净晾干，炒熟备用（不用放油）。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-9",
        "stepNo": 9,
        "title": "炒豆瓣酱：热锅冷油（",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "炒豆瓣酱：热锅冷油（菜籽油 20ml），加入 10g 豆瓣酱，10g 豆豉（可选），加入蒜末，中火慢炒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-10",
        "stepNo": 10,
        "title": "汆鱼片：加入 150",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "汆鱼片：加入 150ml 热水，水很快开后加入腌制好的鱼片，轻轻翻动让鱼片在水中散开，加入 2g 盐和 2g 糖调味（此时可根据个人口味调整盐的用量）。水再次沸腾后即可盛盘。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-28-step-11",
        "stepNo": 11,
        "title": "盛盘：先将熟的蔬菜盛",
        "image": "/static/assets/dishes/real/home-dish-28.jpg",
        "description": "盛盘：先将熟的蔬菜盛至大碗中，然后将热的鱼片盛在蔬菜上面，浇上锅中剩余热汤即可！",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-29",
    "name": "油焖大虾",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-29.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-29.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-29.jpg",
    "description": "这道鲁菜经典以咸甜交融的酱汁包裹整虾，成菜红亮油润，虾肉紧实弹嫩。虾本身富含优质蛋白与虾青素，脂肪含量低，是补充营养又不易增加负担的食材。制作时需要炼葱油、剪虾、焖烧、收汁，对火候和调味把握有一定要求，更适合有基础的厨友尝试，全程大约需要 ",
    "difficulty": "较难",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-29-ing-1",
        "groupType": "main",
        "name": "黑虎虾 or 明虾、",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-29-ing-2",
        "groupType": "main",
        "name": "葱、姜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-29-ing-3",
        "groupType": "seasoning",
        "name": "料酒、盐、冰糖、植物油",
        "amount": "适量",
        "sortOrder": 2
      }
    ],
    "steps": [
      {
        "id": "home-dish-29-step-1",
        "stepNo": 1,
        "title": "剪虾枪到根上",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "剪虾枪到根上，虾须虾爪都剪掉，沙包挑掉，开背虾线挑出来，洗净备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-2",
        "stepNo": 2,
        "title": "炸料油",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "炸料油 注意：油温三成热放花椒，油热离火，放葱姜（不要让油变色最好）葱稍微变黄沥油 （葱油弄多了可以留着作为拌面使用）。",
        "heat": "无",
        "minutes": 6,
        "tips": "油温三成热放花椒，油热离火，放葱姜（不要让油变色最好）葱稍微变黄沥油 （葱油弄多了可以留着作为拌面使用）。"
      },
      {
        "id": "home-dish-29-step-3",
        "stepNo": 3,
        "title": "下油",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "下油，虾摆放整齐，两面变色后轻轻摁虾头 注意：放姜米（姜切成细颗粒）；黄酒 30g",
        "heat": "无",
        "minutes": 3,
        "tips": "放姜米（姜切成细颗粒）"
      },
      {
        "id": "home-dish-29-step-4",
        "stepNo": 4,
        "title": "大火烧开转小火盖盖子",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "大火烧开转小火盖盖子闷（中途不能再加汤水，不要开盖）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-5",
        "stepNo": 5,
        "title": "皮亮虾弯就可以起锅",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "皮亮虾弯就可以起锅，虾摆盘",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-6",
        "stepNo": 6,
        "title": "收汁（过滤后倒回锅里",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "收汁（过滤后倒回锅里收浓，放葱油 ） 汤汁剩余 1/4 时。",
        "heat": "小火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-7",
        "stepNo": 7,
        "title": "浇汁",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "浇汁",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-8",
        "stepNo": 8,
        "title": "完成",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "完成",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-29-step-9",
        "stepNo": 9,
        "title": "开吃✅",
        "image": "/static/assets/dishes/real/home-dish-29.jpg",
        "description": "开吃✅",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "油温三成热放花椒，油热离火，放葱姜（不要让油变色最好）葱稍微变黄沥油 （葱油弄多了可以留着作为拌面使用）。",
      "放姜米（姜切成细颗粒）"
    ]
  },
  {
    "id": "home-dish-30",
    "name": "白灼虾",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-30.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-30.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-30.jpg",
    "description": "白灼虾是一道粤式经典快手菜，虾肉鲜甜弹嫩，原汁原味。虾本身富含优质蛋白和多种矿物质，搭配蘸料开胃不油腻。做法简单容错率高，对新手非常友好，从备料到出锅大约只需 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-30-ing-1",
        "groupType": "main",
        "name": "活虾",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-30-ing-2",
        "groupType": "main",
        "name": "洋葱",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-30-ing-3",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-30-ing-4",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-30-ing-5",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-30-ing-6",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-30-ing-7",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-30-ing-8",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-30-ing-9",
        "groupType": "side",
        "name": "芝麻",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-30-ing-10",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-30-ing-11",
        "groupType": "seasoning",
        "name": "香醋",
        "amount": "适量",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "home-dish-30-step-1",
        "stepNo": 1,
        "title": "洋葱切小块",
        "image": "/static/assets/dishes/real/home-dish-30.jpg",
        "description": "洋葱切小块，姜切片，平铺平底锅。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-30-step-2",
        "stepNo": 2,
        "title": "活虾冲洗一下（去除虾",
        "image": "/static/assets/dishes/real/home-dish-30.jpg",
        "description": "活虾冲洗一下（去除虾线、剪刀减掉虾腿虾须子都是可选操作），控水，铺在平底锅的洋葱、姜片之上。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-30-step-3",
        "stepNo": 3,
        "title": "锅内倒入料酒",
        "image": "/static/assets/dishes/real/home-dish-30.jpg",
        "description": "锅内倒入料酒，盖上锅盖，中火 1 分钟，小火 5 分钟，关火 5 分钟。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-30-step-4",
        "stepNo": 4,
        "title": "和上一步并行操作",
        "image": "/static/assets/dishes/real/home-dish-30.jpg",
        "description": "和上一步并行操作，制作蘸料： 注意：葱切成葱花、蒜切碎、倒入酱油、芝麻、香醋，搅拌之。；油烧热，淋入蘸料。",
        "heat": "无",
        "minutes": 3,
        "tips": "葱切成葱花、蒜切碎、倒入酱油、芝麻、香醋，搅拌之。"
      },
      {
        "id": "home-dish-30-step-5",
        "stepNo": 5,
        "title": "虾出锅",
        "image": "/static/assets/dishes/real/home-dish-30.jpg",
        "description": "虾出锅，用干净的盘子装好。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "葱切成葱花、蒜切碎、倒入酱油、芝麻、香醋，搅拌之。"
    ]
  },
  {
    "id": "home-dish-31",
    "name": "蒜蓉虾",
    "emoji": "🦐",
    "category": "meat",
    "coverImage": "/static/assets/dishes/real/home-dish-31.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-31.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-31.jpg",
    "description": "这道广东传统名菜以鲜香嫩滑著称，虾肉清甜弹牙，蒜香浓郁扑鼻。海虾富含优质蛋白和钙、硒等微量元素，搭配蒜蓉有助杀菌开胃。做法十分简单，处理虾、铺酱、蒸制、淋油几步即成，新手也能轻松驾驭，全程约需 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "荤菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-31-ing-1",
        "groupType": "main",
        "name": "海虾",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-31-ing-2",
        "groupType": "seasoning",
        "name": "蒜蓉酱",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-31-ing-3",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-31-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      }
    ],
    "steps": [
      {
        "id": "home-dish-31-step-1",
        "stepNo": 1,
        "title": "用刀从从虾头中间切开",
        "image": "/static/assets/dishes/real/home-dish-31.jpg",
        "description": "用刀从从虾头中间切开，切到距离虾尾 1 cm",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-31-step-2",
        "stepNo": 2,
        "title": "蒜蓉酱铺在虾身中间",
        "image": "/static/assets/dishes/real/home-dish-31.jpg",
        "description": "将蒜蓉酱铺在虾身中间，放在盘子中",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-31-step-3",
        "stepNo": 3,
        "title": "倒入热水",
        "image": "/static/assets/dishes/real/home-dish-31.jpg",
        "description": "锅中倒入热水，将盘子放入锅中，大火蒸 3 分钟",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-31-step-4",
        "stepNo": 4,
        "title": "烧热油",
        "image": "/static/assets/dishes/real/home-dish-31.jpg",
        "description": "烧热油，倒入虾盘中，倒入生抽",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-32",
    "name": "玉米排骨汤",
    "emoji": "🍲",
    "category": "soup",
    "coverImage": "/static/assets/dishes/real/home-dish-32.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-32.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-32.jpg",
    "description": "玉米排骨汤是一道鲜美清甜的家常汤品，排骨软烂，玉米和胡萝卜带来自然甜味。富含蛋白质、维生素和膳食纤维，营养均衡。做法简单，对新手友好，只需将排骨焯水煸香后慢炖约一小时即可完成。从备菜到出锅大约需要一个半小时。",
    "difficulty": "中等",
    "estimatedMinutes": 43,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "汤类",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-32-ing-1",
        "groupType": "main",
        "name": "排骨",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-32-ing-2",
        "groupType": "main",
        "name": "玉米",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-32-ing-3",
        "groupType": "side",
        "name": "胡箩卜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-32-ing-4",
        "groupType": "side",
        "name": "生姜",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-32-ing-5",
        "groupType": "side",
        "name": "大葱",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-32-ing-6",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-32-ing-7",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-32-ing-8",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-32-ing-9",
        "groupType": "seasoning",
        "name": "黑胡椒粉",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-32-ing-10",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-32-step-1",
        "stepNo": 1,
        "title": "大葱切成 3-4cm",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "大葱切成 3-4cm 的大段，用刀背拍一下",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-2",
        "stepNo": 2,
        "title": "玉米剁成小块",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "玉米剁成小块",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-3",
        "stepNo": 3,
        "title": "胡箩卜切成滚刀块",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "胡箩卜切成滚刀块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-4",
        "stepNo": 4,
        "title": "生姜去皮切大片",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "生姜去皮切大片",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-5",
        "stepNo": 5,
        "title": "新鲜的排骨砍成小块",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "新鲜的排骨砍成小块",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-6",
        "stepNo": 6,
        "title": "排骨凉水下锅",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "排骨凉水下锅，放入大葱、生姜、料酒开始焯水，大火烧开，撇去浮沫，捞出排骨，沥干水分",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-7",
        "stepNo": 7,
        "title": "热锅凉油",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "热锅凉油，切大片的生姜和排骨一起下锅煸炒，待排骨表面微微焦黄，放入醋（可加速肉质软烂），继续煸炒一分钟",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-8",
        "stepNo": 8,
        "title": "冲入开水",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "冲入开水，一次给足，之后就不要再加了，大火烧开",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-9",
        "stepNo": 9,
        "title": "先下入玉米",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "先下入玉米，放入胡椒粉，盖盖小火炖二十分钟，然后放入胡萝卜，盖盖继续小火炖四十分钟",
        "heat": "小火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-32-step-10",
        "stepNo": 10,
        "title": "调味很简单",
        "image": "/static/assets/dishes/real/home-dish-32.jpg",
        "description": "调味很简单，出锅前三分钟，除了盐什么都不用放，最后撒上一把小葱花即可",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-33",
    "name": "排骨山药玉米汤",
    "emoji": "🍲",
    "category": "soup",
    "coverImage": "/static/assets/dishes/real/home-dish-33.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-33.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-33.jpg",
    "description": "排骨山药玉米汤清甜醇厚，山药软糯、玉米回甘，融合了排骨的鲜香，属于老少皆宜的家常汤品。它富含蛋白质、膳食纤维和多种维生素，有健脾益胃、增强抵抗力的作用。做法简单，预处理和炖煮步骤清晰，新手也能轻松上手，全程大约需要 1 小时即可完成。",
    "difficulty": "简单",
    "estimatedMinutes": 1,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "汤类",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-33-ing-1",
        "groupType": "main",
        "name": "排骨",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-33-ing-2",
        "groupType": "main",
        "name": "山药",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-33-ing-3",
        "groupType": "side",
        "name": "胡萝卜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-33-ing-4",
        "groupType": "side",
        "name": "玉米",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-33-ing-5",
        "groupType": "side",
        "name": "生姜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-33-ing-6",
        "groupType": "side",
        "name": "小葱",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-33-ing-7",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-33-ing-8",
        "groupType": "seasoning",
        "name": "食盐",
        "amount": "适量",
        "sortOrder": 7
      }
    ],
    "steps": [
      {
        "id": "home-dish-33-step-1",
        "stepNo": 1,
        "title": "食材预处理：",
        "image": "/static/assets/dishes/real/home-dish-33.jpg",
        "description": "食材预处理： 注意：将胡萝卜洗净去皮，切成大约 3cm 的滚刀块。；玉米洗净，剁成大约 4cm 的圆柱状小块。",
        "heat": "无",
        "minutes": 3,
        "tips": "将胡萝卜洗净去皮，切成大约 3cm 的滚刀块。"
      },
      {
        "id": "home-dish-33-step-2",
        "stepNo": 2,
        "title": "排骨焯水：",
        "image": "/static/assets/dishes/real/home-dish-33.jpg",
        "description": "排骨焯水： 注意：锅中加入足量冷水，放入洗净的排骨。；加入大约 10g 姜片、葱结和 15ml 料酒。",
        "heat": "无",
        "minutes": 6,
        "tips": "锅中加入足量冷水，放入洗净的排骨。"
      },
      {
        "id": "home-dish-33-step-3",
        "stepNo": 3,
        "title": "翻炒排骨：",
        "image": "/static/assets/dishes/real/home-dish-33.jpg",
        "description": "翻炒排骨： 注意：热锅，倒入 10ml 食用油，等待 10 秒让油温升高。；放入剩余大约 10g 姜片爆香。",
        "heat": "中大火",
        "minutes": 4,
        "tips": "热锅，倒入 10ml 食用油，等待 10 秒让油温升高。"
      },
      {
        "id": "home-dish-33-step-4",
        "stepNo": 4,
        "title": "炖煮过程：",
        "image": "/static/assets/dishes/real/home-dish-33.jpg",
        "description": "炖煮过程： 注意：在锅中一次性加入 1500ml - 2000ml 饮用水。；放入全部准备好的胡萝卜、玉米和山药。",
        "heat": "无",
        "minutes": 12,
        "tips": "在锅中一次性加入 1500ml - 2000ml 饮用水。"
      },
      {
        "id": "home-dish-33-step-5",
        "stepNo": 5,
        "title": "调味与出锅：",
        "image": "/static/assets/dishes/real/home-dish-33.jpg",
        "description": "调味与出锅： 注意：加入 6g - 8g 食盐，用勺子搅拌均匀。；保持小火继续炖煮 2 分钟使盐分入味。",
        "heat": "无",
        "minutes": 12,
        "tips": "加入 6g - 8g 食盐，用勺子搅拌均匀。"
      }
    ],
    "tips": [
      "将胡萝卜洗净去皮，切成大约 3cm 的滚刀块。",
      "锅中加入足量冷水，放入洗净的排骨。",
      "热锅，倒入 10ml 食用油，等待 10 秒让油温升高。"
    ]
  },
  {
    "id": "home-dish-34",
    "name": "西红柿鸡蛋汤",
    "emoji": "🍗",
    "category": "soup",
    "coverImage": "/static/assets/dishes/real/home-dish-34.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-34.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-34.jpg",
    "description": "西红柿鸡蛋汤是一道酸甜开胃、口感滑嫩的家常汤品，做法极简，属于老少皆宜的大众菜肴。富含番茄红素、维生素 C 和优质蛋白质，营养均衡易吸收。对新手非常友好，快手省时，预计制作时长 大约 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "汤类",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-34-ing-1",
        "groupType": "main",
        "name": "西红柿",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-34-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-34-ing-3",
        "groupType": "seasoning",
        "name": "香油",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-34-ing-4",
        "groupType": "side",
        "name": "味素",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-34-ing-5",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-34-ing-6",
        "groupType": "side",
        "name": "葱、姜、蒜",
        "amount": "适量",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "home-dish-34-step-1",
        "stepNo": 1,
        "title": "西红柿洗净",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "将西红柿洗净，切块。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-2",
        "stepNo": 2,
        "title": "葱姜蒜切碎",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "葱姜蒜切碎。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-3",
        "stepNo": 3,
        "title": "鸡蛋打到碗中",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "鸡蛋打到碗中，用筷子（或打蛋器）搅拌均匀。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-4",
        "stepNo": 4,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "热锅，并放入 15 毫升的油，待能从油中看到冒出一丝烟时，放入葱姜蒜翻炒 30 秒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-5",
        "stepNo": 5,
        "title": "放入西红柿翻炒 1 ",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "放入西红柿翻炒 1 分钟。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-6",
        "stepNo": 6,
        "title": "倒入水",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "倒入水，水的高度大约为锅内菜品高度的 1.2 倍，并放入盐。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-7",
        "stepNo": 7,
        "title": "待开锅后",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "待开锅后，将鸡蛋液放入，并用筷子将鸡蛋打散，放入味素和香油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-34-step-8",
        "stepNo": 8,
        "title": "等待 30 秒",
        "image": "/static/assets/dishes/real/home-dish-34.jpg",
        "description": "等待 30 秒，关火出锅。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "egg-fried-rice",
    "name": "蛋炒饭",
    "emoji": "🍳",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/egg-fried-rice.jpg",
    "squareImage": "/static/assets/dishes/real/egg-fried-rice.jpg",
    "detailImage": "/static/assets/dishes/real/egg-fried-rice.jpg",
    "description": "一道家常蛋炒饭，金黄的蛋丝裹着粒粒分明的米饭，搭配火腿、胡萝卜和黄瓜，口感丰富，咸香适口。鸡蛋提供优质蛋白，胡萝卜增添维生素，碳水化合物带来充足能量。制作步骤稍多，但新手按流程操作也能成功，全程大约需要 25 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 25,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "egg-fried-rice-ing-1",
        "groupType": "main",
        "name": "冷饭",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "egg-fried-rice-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "egg-fried-rice-ing-3",
        "groupType": "side",
        "name": "火腿",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "egg-fried-rice-ing-4",
        "groupType": "side",
        "name": "黄瓜",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "egg-fried-rice-ing-5",
        "groupType": "side",
        "name": "胡萝卜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "egg-fried-rice-ing-6",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "egg-fried-rice-ing-7",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "egg-fried-rice-ing-8",
        "groupType": "seasoning",
        "name": "胡椒粉",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "egg-fried-rice-ing-9",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "egg-fried-rice-ing-10",
        "groupType": "side",
        "name": "香葱",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "egg-fried-rice-ing-11",
        "groupType": "side",
        "name": "灯影牛肉丝/午餐肉/腊肠/卤肉...等熟肉",
        "amount": "适量",
        "sortOrder": 10
      }
    ],
    "steps": [
      {
        "id": "egg-fried-rice-step-1",
        "stepNo": 1,
        "title": "米饭提前用铲子铲成小",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "米饭提前用铲子铲成小块",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-2",
        "stepNo": 2,
        "title": "火腿肠、胡萝卜、黄瓜",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "火腿肠、胡萝卜、黄瓜等根据需求切片或者块状",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-3",
        "stepNo": 3,
        "title": "如果家里有熟肉 准备",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "如果家里有熟肉 准备好味道更佳",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-4",
        "stepNo": 4,
        "title": "蛋白",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "将蛋白，蛋黄分开，分别打入一个大碗里，各自搅匀。注意，不要在这一步加盐。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-5",
        "stepNo": 5,
        "title": "大火热锅",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "大火热锅，待锅里冒烟放入食用油，放入蛋白，待主体凝固后盛出备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-6",
        "stepNo": 6,
        "title": "如果油够",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "如果油够，则直接放入蛋黄，如果油不够则放入食用油并等其升温到大火热锅",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-7",
        "stepNo": 7,
        "title": "待主体凝固后",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "待主体凝固后，将火调至中小火，倒入火腿肠、熟肉，胡萝卜、黄瓜等备料、翻炒 10 秒钟（到爆香）",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-8",
        "stepNo": 8,
        "title": "重新倒入蛋白",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "重新倒入蛋白，翻炒 5s 钟，迅速倒入米饭大火翻炒，为的就是每一粒饭都裹上鸡蛋。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-9",
        "stepNo": 9,
        "title": "翻炒过程中将米饭的块",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "翻炒过程中将米饭的块状捣碎、这一步过程会比较长、待米饭全部捣碎再翻炒均匀即可",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-10",
        "stepNo": 10,
        "title": "调至小火、加盐、胡椒",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "调至小火、加盐、胡椒粉、生抽",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-11",
        "stepNo": 11,
        "title": "进一步翻炒均匀",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "进一步翻炒均匀，能看到一些米饭在锅里有“跳起来”的时候其实就已经差不多了",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "egg-fried-rice-step-12",
        "stepNo": 12,
        "title": "最后倒入香葱再翻炒 ",
        "image": "/static/assets/dishes/real/egg-fried-rice.jpg",
        "description": "最后倒入香葱再翻炒 10s",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-36",
    "name": "扬州炒饭",
    "emoji": "🍚",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/home-dish-36.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-36.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-36.jpg",
    "description": "这是一道配料丰富的升级版炒饭，米饭粒粒分明，鸡蛋嫩滑，搭配虾仁、午餐肉和蔬菜丁，口感层次鲜明，属于淮扬菜系中的经典主食。富含优质蛋白、碳水化合物和多种维生素，营养均衡。步骤虽多但操作直观，对初级烹饪者也较为友好，只需耐心备料。预计制作时长约",
    "difficulty": "较难",
    "estimatedMinutes": 46,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-36-ing-1",
        "groupType": "main",
        "name": "冷饭",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-36-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-36-ing-3",
        "groupType": "side",
        "name": "冷冻去皮基围虾",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-36-ing-4",
        "groupType": "side",
        "name": "午餐肉罐头",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-36-ing-5",
        "groupType": "side",
        "name": "青豆",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-36-ing-6",
        "groupType": "side",
        "name": "胡萝卜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-36-ing-7",
        "groupType": "side",
        "name": "玉米粒",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-36-ing-8",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-36-ing-9",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-36-ing-10",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-36-step-1",
        "stepNo": 1,
        "title": "胡萝卜切丁 0",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "胡萝卜切丁 0.2cm0.2cm0.2cm，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-2",
        "stepNo": 2,
        "title": "午餐肉切丁 0",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "午餐肉切丁 0.2cm0.2cm0.2cm，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-3",
        "stepNo": 3,
        "title": "葱分别取葱白和葱绿",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "葱分别取葱白和葱绿，各切成 0.25-0.5cm 的小段，分开备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-4",
        "stepNo": 4,
        "title": "在碗中打入鸡蛋液",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "在碗中打入鸡蛋液，均匀搅拌，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-5",
        "stepNo": 5,
        "title": "胡萝卜",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "将胡萝卜，青豆，玉米粒煮熟捞出，备用（水别倒）",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-6",
        "stepNo": 6,
        "title": "虾煮熟",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "将虾煮熟，捞出备用（水可以倒了）",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-7",
        "stepNo": 7,
        "title": "热锅热油",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "热锅热油，可以参考学习炒与煎中的热锅双油 注意：第二次倒油需使用 20-30ml 油，等到第二次凉油热了以后，缓慢倒入鸡蛋（控制碗到油直接的流注直径大约在 0.5cm）不要搅拌",
        "heat": "无",
        "minutes": 4,
        "tips": "第二次倒油需使用 20-30ml 油，等到第二次凉油热了以后，缓慢倒入鸡蛋（控制碗到油直接的流注直径大约在 0.5cm）不要搅拌"
      },
      {
        "id": "home-dish-36-step-8",
        "stepNo": 8,
        "title": "鸡蛋凝固后立刻捞出",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "鸡蛋凝固后立刻捞出，备用",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-9",
        "stepNo": 9,
        "title": "午餐肉",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "将午餐肉，青豆，胡萝卜，玉米粒，虾倒入锅中翻炒 1-2 分钟，装盘备用",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-10",
        "stepNo": 10,
        "title": "水冲一下锅",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "水冲一下锅，将杂物冲干净，保证锅内干净（可以有油但是不能有杂质）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-11",
        "stepNo": 11,
        "title": "热锅热油(10ml)",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "热锅热油(10ml)，将葱白放入爆香",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-36-step-12",
        "stepNo": 12,
        "title": "调至小火（如果油温过",
        "image": "/static/assets/dishes/real/home-dish-36.jpg",
        "description": "调至小火（如果油温过高可以关火 1-2 分钟），放入米饭，用铲子快速砸击米饭并翻炒，保证米饭均匀沾到油且粒粒分明",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。",
      "第二次倒油需使用 20-30ml 油，等到第二次凉油热了以后，缓慢倒入鸡蛋（控制碗到油直接的流注直径大约在 0.5cm）不要搅拌"
    ]
  },
  {
    "id": "home-dish-37",
    "name": "葱油拌面",
    "emoji": "🍚",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/home-dish-37.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-37.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-37.jpg",
    "description": "葱油拌面是一道经典的上海家常面点，以独特的葱油香味著称，做法简单快捷。富含碳水化合物和脂肪，能快速补充能量。一般初学者只需 20 分钟即可完成，非常适合作为日常快手晚餐。",
    "difficulty": "简单",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-37-ing-1",
        "groupType": "main",
        "name": "干面条",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-37-ing-2",
        "groupType": "main",
        "name": "小葱",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-37-ing-3",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-37-ing-4",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-37-ing-5",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "home-dish-37-step-1",
        "stepNo": 1,
        "title": " 小葱 洗净",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "将 小葱 洗净，切成长段（约 5-7 cm）。葱白和葱绿可以分开。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-2",
        "stepNo": 2,
        "title": "加入 100 ml ",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "锅中加入 100 ml 食用油，中火烧热。先放入葱白段，煸炒至微黄。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-3",
        "stepNo": 3,
        "title": "加入葱绿段",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "加入葱绿段，转小火，继续煸炒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-4",
        "stepNo": 4,
        "title": "保持小火",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "保持小火，耐心煸炒约 15-20 分钟，直至葱段变得焦黄酥脆。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-5",
        "stepNo": 5,
        "title": "焦黄的葱段捞出（葱油",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "将焦黄的葱段捞出（葱油保留在锅中）。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-6",
        "stepNo": 6,
        "title": "在锅中的葱油中",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "在锅中的葱油中，加入 60 ml 生抽，20 ml 老抽，15 g 白糖。小火加热并搅拌，约 1 分钟，至糖溶解，酱汁混合均匀。立即关火。将制作好的葱油酱汁倒入容器中，放凉后密封保存。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-7",
        "stepNo": 7,
        "title": "取 80 g 干面条",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "取 80 g 干面条。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-8",
        "stepNo": 8,
        "title": "加入 1000 ml",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "锅中加入 1000 ml 饮用水，大火烧开。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-9",
        "stepNo": 9,
        "title": "放入 面条",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "放入 面条，根据面条包装说明，煮至熟透（通常 3-8 分钟，以包装说明为准）。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-10",
        "stepNo": 10,
        "title": " 煮好的 面条 捞出",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "将 煮好的 面条 捞出，沥干水分，放入碗中。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-11",
        "stepNo": 11,
        "title": "在装有 面条 的碗中",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "在装有 面条 的碗中，加入 15 ml 之前做好的 葱油酱汁。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-37-step-12",
        "stepNo": 12,
        "title": "可以加入之前炸好的葱",
        "image": "/static/assets/dishes/real/home-dish-37.jpg",
        "description": "可以加入之前炸好的葱段（可选）。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-38",
    "name": "炸酱面",
    "emoji": "🍚",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/home-dish-38.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-38.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-38.jpg",
    "description": "炸酱面是一道酱香浓郁、面条劲道的传统北京家常面食，搭配清爽菜码，咸甜适口。主要营养来自瘦肉蛋白质和蔬菜维生素，能为人体提供充足能量。做法对新手友好，预计制作时长约 30 分钟，熟练掌握后可通过备菜与炒酱并行进一步缩短时间。",
    "difficulty": "中等",
    "estimatedMinutes": 30,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-38-ing-1",
        "groupType": "main",
        "name": "如果 面条 选择了挂面",
        "amount": "150g",
        "sortOrder": 0
      }
    ],
    "steps": [
      {
        "id": "home-dish-38-step-1",
        "stepNo": 1,
        "title": "菜码切丝备用",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "菜码切丝备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-2",
        "stepNo": 2,
        "title": "葱切碎",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "葱切碎。油锅烧热，下葱和肉，炒至肉完全熟透（无红色）",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-3",
        "stepNo": 3,
        "title": "下豆瓣酱和甜面酱",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "下豆瓣酱和甜面酱，继续炒至微微粘稠。盛出，得到炸酱。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-4",
        "stepNo": 4,
        "title": "取大碗",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "取大碗，加凉水备用。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-5",
        "stepNo": 5,
        "title": "煮面条至断生（无白芯",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "煮面条至断生（无白芯），盛入第 4 步装有凉水的碗中。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-6",
        "stepNo": 6,
        "title": "立即控水捞出",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "立即控水捞出，盛入干净的碗中。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-38-step-7",
        "stepNo": 7,
        "title": "取第 3 步炸酱",
        "image": "/static/assets/dishes/real/home-dish-38.jpg",
        "description": "取第 3 步炸酱，倒入碗中，拌匀。然后取第 1 步菜码，倒入碗中，拌匀。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-39",
    "name": "豆角焖面",
    "emoji": "🍚",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/home-dish-39.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-39.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-39.jpg",
    "description": "豆角焖面是一道北方家常面食，面条吸饱汤汁，口感软韧咸香，带着豆角的清爽和肉片的油润。五花肉提供蛋白质和脂肪，豆角富含膳食纤维和维生素，荤素搭配均衡。整体操作不难，但需要留意火候和加汤时机，适合有一定下厨经验的朋友尝试，一般约 30 分钟就能",
    "difficulty": "中等",
    "estimatedMinutes": 30,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-39-ing-1",
        "groupType": "seasoning",
        "name": "盐的用量为",
        "amount": "2g。",
        "sortOrder": 0
      },
      {
        "id": "home-dish-39-ing-2",
        "groupType": "seasoning",
        "name": "鸡精的用量为",
        "amount": "2g。",
        "sortOrder": 1
      },
      {
        "id": "home-dish-39-ing-3",
        "groupType": "seasoning",
        "name": "生抽的用量为",
        "amount": "10ml。",
        "sortOrder": 2
      },
      {
        "id": "home-dish-39-ing-4",
        "groupType": "seasoning",
        "name": "耗油的用量为",
        "amount": "5g。",
        "sortOrder": 3
      },
      {
        "id": "home-dish-39-ing-5",
        "groupType": "side",
        "name": "十三香的用量为",
        "amount": "1g。",
        "sortOrder": 4
      },
      {
        "id": "home-dish-39-ing-6",
        "groupType": "seasoning",
        "name": "老抽的用量为",
        "amount": "5ml。",
        "sortOrder": 5
      },
      {
        "id": "home-dish-39-ing-7",
        "groupType": "seasoning",
        "name": "味精的用量为",
        "amount": "1g。",
        "sortOrder": 6
      },
      {
        "id": "home-dish-39-ing-8",
        "groupType": "side",
        "name": "热水的用量为",
        "amount": "150ml。",
        "sortOrder": 7
      }
    ],
    "steps": [
      {
        "id": "home-dish-39-step-1",
        "stepNo": 1,
        "title": "豆角切成 5cm -",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "将豆角切成 5cm - 6cm 的小段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-2",
        "stepNo": 2,
        "title": "葱切成 1cm - ",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "将葱切成 1cm - 2cm 小段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-3",
        "stepNo": 3,
        "title": "姜切成 1mm x ",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "将姜切成 1mm x 1mm x 3cm 的长条",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-4",
        "stepNo": 4,
        "title": "蒜放在砧板上拍碎",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "将蒜放在砧板上拍碎，切成 1mm 的粒度。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-5",
        "stepNo": 5,
        "title": "五花肉切成 2mm ",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "将五花肉切成 2mm 厚度的肉片。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-6",
        "stepNo": 6,
        "title": "首先将锅烧热",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "首先将锅烧热，烧去锅内全部水汽，手放过内距离锅底 10cm 处，感觉明显有些许烤手。",
        "heat": "中火",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-7",
        "stepNo": 7,
        "title": "加入上述定量的食用油",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "加入上述定量的食用油，手持锅柄，离灶 5cm 处，摇晃锅，使食用油充分挂满锅的三分之二（自下而上）。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-8",
        "stepNo": 8,
        "title": "放入全部的姜和全部的",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "放入全部的姜和全部的葱段，翻炒爆香 5 秒（注意！此时有油飞溅的危险，建议带上手套或做好防护措施）。",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-9",
        "stepNo": 9,
        "title": "放入全部的肉片",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "放入全部的肉片，放入以后不着急饭锅，静置 5 秒后，再翻炒，使所有的肉都裹满食用油。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-10",
        "stepNo": 10,
        "title": "不断翻炒肉片",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "不断翻炒肉片，待到全部肉片都已经变色，沿锅边均匀淋如准备好的生抽，翻炒均匀。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-11",
        "stepNo": 11,
        "title": "依次加入准备好的盐、",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "依次加入准备好的盐、老抽、耗油、十三香、鸡精以及全部准备好的豆角，翻炒 2 分钟。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-39-step-12",
        "stepNo": 12,
        "title": "加入准备好的热水",
        "image": "/static/assets/dishes/real/home-dish-39.jpg",
        "description": "加入准备好的热水。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-40",
    "name": "手工水饺",
    "emoji": "🍚",
    "category": "staple",
    "coverImage": "/static/assets/dishes/real/home-dish-40.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-40.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-40.jpg",
    "description": "手工水饺是一道中式经典主食，皮薄馅大、鲜美多汁，饱腹又可以根据个人口味随意调味。猪肉馅提供优质蛋白质和脂肪，搭配韭菜还能补充维生素与膳食纤维。这道菜品对新手来说难度较高，需要掌握和面、擀皮、调馅和煮饺的火候，预计制作时间约 3 小时。",
    "difficulty": "较难",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "主食",
      "周末菜"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-40-ing-1",
        "groupType": "main",
        "name": "擀面杖",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-40-ing-2",
        "groupType": "main",
        "name": "面粉",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-40-ing-3",
        "groupType": "side",
        "name": "冷水",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-40-ing-4",
        "groupType": "side",
        "name": "直径 30cm 以上的盆",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-40-ing-5",
        "groupType": "seasoning",
        "name": "芝麻香油",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "home-dish-40-step-1",
        "stepNo": 1,
        "title": "盆中加入所有面粉",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "盆中加入所有面粉",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-2",
        "stepNo": 2,
        "title": "加入芝麻香油",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "加入芝麻香油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-3",
        "stepNo": 3,
        "title": "面粉中央挖小洞",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "面粉中央挖小洞",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-4",
        "stepNo": 4,
        "title": "分 4-5 次加入水",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "分 4-5 次加入水，并搅和，当出现碎末状的稍微干燥面团时",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-5",
        "stepNo": 5,
        "title": "取消加水",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "取消加水，用手将面团压实",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-6",
        "stepNo": 6,
        "title": "面团压实至可把盆周围",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "面团压实至可把盆周围的面粉纳入即可，此步骤为面光盆光",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-7",
        "stepNo": 7,
        "title": "面团置于桌上",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "将面团置于桌上，盆倒扣于桌上，环境温度为 25 度，使面团醒发约 45 分钟",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-8",
        "stepNo": 8,
        "title": "醒发完成后",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "醒发完成后，将面团搓成条状，合成一团，再次搓成条，重复 3 次",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-9",
        "stepNo": 9,
        "title": "擀成条状",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "擀成条状，切成 20 份均匀大小面团，并搓成直径约 3-3.5cm 的球状",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-10",
        "stepNo": 10,
        "title": "压扁面团",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "压扁面团，在手上，桌上，擀面杖上，及面团上撒上面粉，此步骤防止面团发粘",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-11",
        "stepNo": 11,
        "title": "用擀面杖将面团擀平",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "用擀面杖将面团擀平，约 8cm 直径，厚约 2mm，中间略微比四周厚 1mm",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-40-step-12",
        "stepNo": 12,
        "title": "猪肉去皮",
        "image": "/static/assets/dishes/real/home-dish-40.jpg",
        "description": "猪肉去皮,保留部分肥肉,切成小块",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-41",
    "name": "手撕包菜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-41.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-41.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-41.jpg",
    "description": "手撕包菜是一道酸辣脆爽的经典湘菜，成菜包菜脆嫩入味，五花肉干香不腻，开胃下饭。包菜富含维生素 C 和膳食纤维，搭配五花肉能提供蛋白质和能量。制作时需要掌握大火快炒的火候，对新手稍有挑战，但按步骤操作也能成功。从备料到出锅大约 20 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-41-ing-1",
        "groupType": "main",
        "name": "包菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-41-ing-2",
        "groupType": "main",
        "name": "五花肉",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-41-ing-3",
        "groupType": "side",
        "name": "小米辣",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-41-ing-4",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-41-ing-5",
        "groupType": "seasoning",
        "name": "料酒",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-41-ing-6",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-41-ing-7",
        "groupType": "seasoning",
        "name": "香醋",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-41-ing-8",
        "groupType": "seasoning",
        "name": "鸡精",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-41-ing-9",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-41-ing-10",
        "groupType": "side",
        "name": "蒜头",
        "amount": "适量",
        "sortOrder": 9
      },
      {
        "id": "home-dish-41-ing-11",
        "groupType": "side",
        "name": "蒜苗",
        "amount": "适量",
        "sortOrder": 10
      },
      {
        "id": "home-dish-41-ing-12",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 11
      }
    ],
    "steps": [
      {
        "id": "home-dish-41-step-1",
        "stepNo": 1,
        "title": "包菜对半切开",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "包菜对半切开，去掉中间白色部分【参见图一】",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-2",
        "stepNo": 2,
        "title": "手撕包菜",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "手撕包菜，碗中放入 2 g 盐，清洗包菜并沥干备用【参见图二】",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-3",
        "stepNo": 3,
        "title": "姜片、蒜头、小米辣、",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "姜片、蒜头、小米辣、蒜苗处理后备用【参见图三】",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-4",
        "stepNo": 4,
        "title": "五花肉切片",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "五花肉切片，清水清洗后备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-5",
        "stepNo": 5,
        "title": "加入 30 ml 食",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "锅中加入 30 ml 食用油，倒入包菜翻炒，大火翻炒 1 分钟 后，加入 3 g 盐 ，继续翻炒 2 分钟 后取出备用",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-6",
        "stepNo": 6,
        "title": "加入 30 ml 食",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "锅中加入 30 ml 食用油，倒入五花肉，大火翻炒 1 分钟",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-7",
        "stepNo": 7,
        "title": "倒入姜片等材料",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "倒入姜片等材料，翻炒 1 分钟",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-41-step-8",
        "stepNo": 8,
        "title": "倒入包菜翻炒后",
        "image": "/static/assets/dishes/real/home-dish-41.jpg",
        "description": "倒入包菜翻炒后，加入 香醋、料酒、鸡精、料酒，大火继续翻炒，2 分钟 后出锅",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-42",
    "name": "地三鲜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-42.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-42.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-42.jpg",
    "description": "地三鲜是东北经典家常菜，茄子软糯、土豆绵香、尖椒清脆，酱香咸鲜十分下饭。食材搭配可提供丰富的维生素与膳食纤维，土豆还带来满足的碳水能量。这道菜需要油炸和快速翻炒，有一定技巧要求，新手需稍加练习，制作全程约需 40 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-42-ing-1",
        "groupType": "main",
        "name": "茄子",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-42-ing-2",
        "groupType": "main",
        "name": "土豆",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-42-ing-3",
        "groupType": "side",
        "name": "尖椒",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-42-ing-4",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-42-ing-5",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-42-ing-6",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-42-ing-7",
        "groupType": "seasoning",
        "name": "豆瓣酱",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-42-ing-8",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-42-ing-9",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "适量",
        "sortOrder": 8
      },
      {
        "id": "home-dish-42-ing-10",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "适量",
        "sortOrder": 9
      }
    ],
    "steps": [
      {
        "id": "home-dish-42-step-1",
        "stepNo": 1,
        "title": "土豆、茄子、尖椒洗净",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "土豆、茄子、尖椒洗净。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-2",
        "stepNo": 2,
        "title": "土豆去皮",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "土豆去皮。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-3",
        "stepNo": 3,
        "title": "茄子、土豆均切成 1",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "茄子、土豆均切成 15g 的不规则的小块。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-4",
        "stepNo": 4,
        "title": "尖椒用手顺着纹路撕即",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "尖椒用手顺着纹路撕即可，撕成比土豆、茄子略大 25%的块。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-5",
        "stepNo": 5,
        "title": "尽可能除去青椒表面的",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "尽可能除去青椒表面的水分，避免后续炸的时候炸水。考虑使用厨房纸或风干半小时。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-6",
        "stepNo": 6,
        "title": "葱切 0",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "葱切 0.5cm 小段，共取 5g。蒜剁碎成蒜蓉取 15g，分成两份，各 7.5g。姜切沫取 5g。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-7",
        "stepNo": 7,
        "title": "拿一个空碗",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "拿一个空碗，放入生抽 10ml、糖 10g、淀粉 8g，加入 80ml 清水，彻底搅拌均匀，作为调料碗，备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-8",
        "stepNo": 8,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "热锅，加入 150ml 油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-9",
        "stepNo": 9,
        "title": "加入土豆",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "加入土豆，煎炸大约 3-4 分钟，以显示金黄色、筷子能轻松扎透为准。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-10",
        "stepNo": 10,
        "title": "捞出土豆",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "捞出土豆，留下油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-11",
        "stepNo": 11,
        "title": "加入茄子",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "加入茄子，煎炸大约 2-3 分钟，待其到大约 7 分熟，以茄子变软、边缘微焦且吐出多余油脂为准。",
        "heat": "中大火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-42-step-12",
        "stepNo": 12,
        "title": "捞出茄子",
        "image": "/static/assets/dishes/real/home-dish-42.jpg",
        "description": "捞出茄子，留下油。（也可能没有残余的油了）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-43",
    "name": "虎皮青椒",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-43.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-43.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-43.jpg",
    "description": "虎皮青椒是一道家常小菜，外皮微焦起皱，口感软嫩带脆，咸鲜中透着酸甜，十分开胃下饭。青椒富含维生素 C 和膳食纤维，有助于增强免疫力、促进消化。制作过程简单明了，只需掌握按压和火候，对新手也比较友好，一般约 15 分钟就能完成。",
    "difficulty": "中等",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-43-ing-1",
        "groupType": "main",
        "name": "青椒",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-43-ing-2",
        "groupType": "main",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-43-ing-3",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-43-ing-4",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-43-ing-5",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-43-ing-6",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "home-dish-43-step-1",
        "stepNo": 1,
        "title": "去掉青椒蒂",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "去掉青椒蒂，用自来水冲洗干净。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-2",
        "stepNo": 2,
        "title": "青椒切长片",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "青椒切长片，平均一个青椒纵向切成 3-4 片即可。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-3",
        "stepNo": 3,
        "title": "大蒜去皮",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "大蒜去皮，切成碎末，体积在 2mm x 2mm x 2mm 即可。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-4",
        "stepNo": 4,
        "title": "调料 1：拿一个小碗",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "调料 1：拿一个小碗倒入 20ml 油，将大蒜末放入其中。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-5",
        "stepNo": 5,
        "title": "调料 2：白糖、生抽",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "调料 2：白糖、生抽、醋、盐全部倒入砵（碗）等容器，搅拌。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-6",
        "stepNo": 6,
        "title": " 调料 1 倒入锅中",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "将 调料 1 倒入锅中，开火加热 5 成放入青椒，青椒片不要叠在一起，单独成片放置锅中。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-7",
        "stepNo": 7,
        "title": "用锅铲不停的按压青椒",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "用锅铲不停的按压青椒，合适的时候翻面。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-8",
        "stepNo": 8,
        "title": "翻炒约 2 分钟",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "翻炒约 2 分钟，待青椒表皮出现褶皱时，倒入 调料 2。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-43-step-9",
        "stepNo": 9,
        "title": "加大火候继续翻炒 3",
        "image": "/static/assets/dishes/real/home-dish-43.jpg",
        "description": "加大火候继续翻炒 30s 后即可出锅盛入盘中。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-44",
    "name": "蚝油生菜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-44.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-44.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-44.jpg",
    "description": "蚝油生菜是一道爽口鲜香的家常菜，脆嫩的生菜淋上蒜香蚝油汁，咸中带甜，属于粤菜和川菜馆都很常见的快手素菜。富含维生素和膳食纤维，有助于促进消化。做法对新手非常友好，从洗菜到出锅大约只需 15 分钟即可完成。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-44-ing-1",
        "groupType": "main",
        "name": "生菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-44-ing-2",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-44-ing-3",
        "groupType": "side",
        "name": "大蒜",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-44-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-44-ing-5",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-44-ing-6",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-44-ing-7",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 6
      }
    ],
    "steps": [
      {
        "id": "home-dish-44-step-1",
        "stepNo": 1,
        "title": "生菜洗净并去掉烂菜叶",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "生菜洗净并去掉烂菜叶。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-2",
        "stepNo": 2,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "热锅，先放 1 L 清水（凉），然后在锅内放入 2 ml - 3 ml 食用油和 0.5 g 盐，等待锅中的水煮沸。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-3",
        "stepNo": 3,
        "title": "水沸后",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "水沸后，放入生菜，将每一片生菜叶都焯水 10 s。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-4",
        "stepNo": 4,
        "title": "捞出生菜",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "捞出生菜，控干水份，摆盘 。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-5",
        "stepNo": 5,
        "title": "调汁：将生抽 10 ",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "调汁：将生抽 10 ml 、蚝油 6-8 ml 、盐 0.5 g 、 白糖 1 g 放入碗中调匀，并加入 10-15 ml 清水（凉）搅拌均匀。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-6",
        "stepNo": 6,
        "title": "再开火",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "再开火，热锅，放入食用油 5-8 ml，油热放入蒜泥。",
        "heat": "中大火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-7",
        "stepNo": 7,
        "title": "等待有蒜香飘出",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "等待有蒜香飘出，倒入调好的汁，煮沸即可，立马关火。",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-44-step-8",
        "stepNo": 8,
        "title": "锅中的汤汁均匀地浇在",
        "image": "/static/assets/dishes/real/home-dish-44.jpg",
        "description": "将锅中的汤汁均匀地浇在生菜上。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "garlic-broccoli",
    "name": "蒜蓉西兰花",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/garlic-broccoli.jpg",
    "squareImage": "/static/assets/dishes/real/garlic-broccoli.jpg",
    "detailImage": "/static/assets/dishes/real/garlic-broccoli.jpg",
    "description": "这道家常蔬菜以蒜香浓郁、调味简单见长，西兰花焯水后软嫩或微脆，清淡鲜美。富含维生素 C、膳食纤维和多种抗氧化物质，是营养均衡的快手素菜。制作过程不难，新手也能轻松掌握，从备料到出锅一般约 15 分钟即可完成。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "garlic-broccoli-ing-1",
        "groupType": "main",
        "name": "西兰花 1 个",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "garlic-broccoli-ing-2",
        "groupType": "main",
        "name": "大蒜 3-4 瓣",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "garlic-broccoli-ing-3",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "garlic-broccoli-ing-4",
        "groupType": "seasoning",
        "name": "蚝油",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "garlic-broccoli-ing-5",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "garlic-broccoli-step-1",
        "stepNo": 1,
        "title": " 西兰花 切成小朵",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "将 西兰花 切成小朵，清洗干净。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-2",
        "stepNo": 2,
        "title": " 大蒜 去皮",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "将 大蒜 去皮，切成蒜末，备用。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-3",
        "stepNo": 3,
        "title": "加入 1000 ml",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "锅中加入 1000 ml 饮用水，大火烧开。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-4",
        "stepNo": 4,
        "title": "放入 西兰花",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "放入 西兰花，保持大火 煮 2-3 分钟，至 西兰花 颜色变翠绿，口感变软。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-5",
        "stepNo": 5,
        "title": " 煮好的 西兰花 捞",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "将 煮好的 西兰花 捞出，沥干水分，摆入盘中，备用。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-6",
        "stepNo": 6,
        "title": "热锅",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "热锅，加入 10 ml 食用油。油温升高后，放入 大蒜末，小火煸炒出香味。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-7",
        "stepNo": 7,
        "title": "加入 10 ml 生",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "加入 10 ml 生抽，5 ml 蚝油，2 g 白糖，加入 30 ml 饮用水。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-8",
        "stepNo": 8,
        "title": "锅中汤汁烧开",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "将锅中汤汁烧开。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "garlic-broccoli-step-9",
        "stepNo": 9,
        "title": "烧好的蒜蓉汁 均匀淋",
        "image": "/static/assets/dishes/real/garlic-broccoli.jpg",
        "description": "将烧好的蒜蓉汁 均匀淋在盘中的 西兰花 上。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-46",
    "name": "蒜蓉空心菜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-46.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-46.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-46.jpg",
    "description": "蒜蓉空心菜是一道清脆爽口、蒜香浓郁的家常快手菜，属于典型的川式小炒风味。空心菜富含膳食纤维、维生素和钙质，有助于促进肠道蠕动。做法非常简单，对新手十分友好，从备料到出锅大约只需 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-46-ing-1",
        "groupType": "main",
        "name": "空心菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-46-ing-2",
        "groupType": "main",
        "name": "蒜末",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-46-ing-3",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-46-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-46-ing-5",
        "groupType": "side",
        "name": "筷子",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-46-ing-6",
        "groupType": "side",
        "name": "铲子",
        "amount": "适量",
        "sortOrder": 5
      }
    ],
    "steps": [
      {
        "id": "home-dish-46-step-1",
        "stepNo": 1,
        "title": "空心菜洗净",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "空心菜洗净，去掉烂叶或者老梗，均匀切成 2 段或者 3 段（防止过长不好炒）",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-46-step-2",
        "stepNo": 2,
        "title": "锅里先倒少量油",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "锅里先倒少量油，烧至微微冒烟，此时拿起锅将国内的热油向四周浸润，让油均匀覆盖锅底，然后再倒入剩余的油(热锅凉油法)。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-46-step-3",
        "stepNo": 3,
        "title": "放入蒜末",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "放入蒜末，小火炒 10 到 15 秒煸香",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-46-step-4",
        "stepNo": 4,
        "title": "尽快均匀地放入空心菜",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "尽快均匀地放入空心菜，开大火，左手拿铲子，右手拿筷子，配合将空心菜不停翻动，直至软化变绿。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-46-step-5",
        "stepNo": 5,
        "title": "接着不需使用筷子",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "接着不需使用筷子，而是使用铲子快速翻炒已软化的空心菜 15 - 20 秒，使之受热更均匀，撒入盐 2 g ，白糖 3 g，生抽 8 ml。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-46-step-6",
        "stepNo": 6,
        "title": "继续大火翻炒 10 ",
        "image": "/static/assets/dishes/real/home-dish-46.jpg",
        "description": "继续大火翻炒 10 秒，即可出锅。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-47",
    "name": "凉拌黄瓜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-47.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-47.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-47.jpg",
    "description": "这是一道清爽开胃的家常凉菜，口感脆嫩，酸香适口。黄瓜富含水分和维生素，有助于清热解暑、美容养颜。做法非常简单，对新手友好，只需拍碎、调味、腌制 15 分钟，全程约 20 分钟即可完成。",
    "difficulty": "简单",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-47-ing-1",
        "groupType": "main",
        "name": "黄瓜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-47-ing-2",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-47-ing-3",
        "groupType": "seasoning",
        "name": "酱油",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-47-ing-4",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 3
      }
    ],
    "steps": [
      {
        "id": "home-dish-47-step-1",
        "stepNo": 1,
        "title": "用菜刀将黄瓜拍扁",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "用菜刀将黄瓜拍扁，再剁成长 3 厘米的碎块",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-47-step-2",
        "stepNo": 2,
        "title": "碎黄瓜装入碗中",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "将碎黄瓜装入碗中",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-47-step-3",
        "stepNo": 3,
        "title": "蒜拍碎切成碎末",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "将蒜拍碎切成碎末",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-47-step-4",
        "stepNo": 4,
        "title": "碗中放入 5 克白糖",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "将碗中放入 5 克白糖，搅拌均匀腌制 15 分钟（用糖腌制更好吃，且成色更好不会蔫）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-47-step-5",
        "stepNo": 5,
        "title": "醋",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "将醋，酱油，盐，蚝油和蒜依次倒入碗中搅拌均匀",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-47-step-6",
        "stepNo": 6,
        "title": "香油倒入碗中并均匀搅",
        "image": "/static/assets/dishes/real/home-dish-47.jpg",
        "description": "将香油倒入碗中并均匀搅拌",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-48",
    "name": "凉拌木耳",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-48.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-48.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-48.jpg",
    "description": "凉拌木耳，由于发放物资中有很多干货，木耳是较为健康的食物。且凉拌木耳的烹饪方式也相对简单。",
    "difficulty": "简单",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-48-ing-1",
        "groupType": "main",
        "name": "干木耳",
        "amount": "20g / 湿木耳: 120g",
        "sortOrder": 0
      },
      {
        "id": "home-dish-48-ing-2",
        "groupType": "main",
        "name": "蒜瓣",
        "amount": "2-3 个",
        "sortOrder": 1
      },
      {
        "id": "home-dish-48-ing-3",
        "groupType": "side",
        "name": "小米辣",
        "amount": "2 个",
        "sortOrder": 2
      },
      {
        "id": "home-dish-48-ing-4",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "2 g",
        "sortOrder": 3
      },
      {
        "id": "home-dish-48-ing-5",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "5-10g（依个人口味）",
        "sortOrder": 4
      },
      {
        "id": "home-dish-48-ing-6",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "15ml",
        "sortOrder": 5
      },
      {
        "id": "home-dish-48-ing-7",
        "groupType": "seasoning",
        "name": "醋",
        "amount": "15ml",
        "sortOrder": 6
      },
      {
        "id": "home-dish-48-ing-8",
        "groupType": "seasoning",
        "name": "香油",
        "amount": "5ml",
        "sortOrder": 7
      },
      {
        "id": "home-dish-48-ing-9",
        "groupType": "side",
        "name": "芥末",
        "amount": "（约 2cm）",
        "sortOrder": 8
      }
    ],
    "steps": [
      {
        "id": "home-dish-48-step-1",
        "stepNo": 1,
        "title": "泡发干木耳",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "泡发干木耳, 水量约为 400ml, 泡发约 45 分钟。 （湿木耳跳过此步骤）",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-48-step-2",
        "stepNo": 2,
        "title": "泡发好的木耳",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "将泡发好的木耳, 进行去根处理（如图 4, 5, 6）, 并彻底洗净。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-48-step-3",
        "stepNo": 3,
        "title": "起锅烧水",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "起锅烧水，水开后放入木耳, 大火煮 1.5-2 分钟。",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-48-step-4",
        "stepNo": 4,
        "title": "蒜瓣、小米辣切碎放入",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "将蒜瓣、小米辣切碎放入碗中 （可选取中大碗）, 并依次加入盐、糖、生抽、醋、香油、芥末, 用量如上。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-48-step-5",
        "stepNo": 5,
        "title": "木耳盛出后沥水",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "木耳盛出后沥水, 放入上一步碗中。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-48-step-6",
        "stepNo": 6,
        "title": "搅拌充分",
        "image": "/static/assets/dishes/real/home-dish-48.jpg",
        "description": "搅拌充分，端盘。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-49",
    "name": "小炒藕丁",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-49.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-49.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-49.jpg",
    "description": "小炒藕丁是一道快手家常素菜，藕丁脆嫩爽口，咸鲜中带着微微辣意，非常下饭。莲藕富含膳食纤维和维生素，有助于清热润燥。制作简单，只要注意藕丁焯水和调味，厨房新手也能轻松完成。全程大约 20 分钟就能端上餐桌。",
    "difficulty": "中等",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-49-ing-1",
        "groupType": "main",
        "name": "大葱",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-49-ing-2",
        "groupType": "main",
        "name": "小米辣",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-49-ing-3",
        "groupType": "side",
        "name": "莲藕",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-49-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-49-ing-5",
        "groupType": "seasoning",
        "name": "老抽",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-49-ing-6",
        "groupType": "seasoning",
        "name": "耗油",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-49-ing-7",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 6
      }
    ],
    "steps": [
      {
        "id": "home-dish-49-step-1",
        "stepNo": 1,
        "title": "大葱、小米辣切小段",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "大葱、小米辣切小段，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-2",
        "stepNo": 2,
        "title": "莲藕去皮",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "莲藕去皮，切成不超过 3cm 的小块，放入水中备用（防止氧化发黑）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-3",
        "stepNo": 3,
        "title": "取炒锅",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "取炒锅，锅内放入 500ml 凉水，煮沸",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-4",
        "stepNo": 4,
        "title": "藕丁下入沸水中",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "将藕丁下入沸水中，焯水 2 分钟后，取出放入盘中备用",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-5",
        "stepNo": 5,
        "title": "锅中水倒掉后",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "将锅中水倒掉后，将锅加热干燥，加入 10-15 ml 食用油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-6",
        "stepNo": 6,
        "title": "待油温升高后",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "待油温升高后，下入葱花，小米辣爆香",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-7",
        "stepNo": 7,
        "title": "处理好的藕丁下入锅中",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "将处理好的藕丁下入锅中，大火翻炒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-8",
        "stepNo": 8,
        "title": "加入生抽、老抽、耗油",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "加入生抽、老抽、耗油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-49-step-9",
        "stepNo": 9,
        "title": "翻炒 2 分钟即可出",
        "image": "/static/assets/dishes/real/home-dish-49.jpg",
        "description": "翻炒 2 分钟即可出锅",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-50",
    "name": "菠菜炒鸡蛋",
    "emoji": "🍗",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-50.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-50.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-50.jpg",
    "description": "菠菜炒鸡蛋是一道清淡爽口的家常快手菜，菠菜软嫩、鸡蛋鲜香，属于南北皆宜的大众风味。菠菜富含铁、叶酸和维生素，鸡蛋提供优质蛋白与卵磷脂，搭配食用有助于补血养气、增强体质。整道菜操作简单，非常适合烹饪新手，从备料到出锅大约只需 15 分钟。",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-50-ing-1",
        "groupType": "main",
        "name": "菠菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-50-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-50-ing-3",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-50-ing-4",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 3
      }
    ],
    "steps": [
      {
        "id": "home-dish-50-step-1",
        "stepNo": 1,
        "title": "菠菜去根",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "菠菜去根，洗净，放在篮子里，焯水",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-2",
        "stepNo": 2,
        "title": "鸡蛋打入碗中",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "将鸡蛋打入碗中，搅匀",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-3",
        "stepNo": 3,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "热锅，加入 10ml 油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-4",
        "stepNo": 4,
        "title": "油热后",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "油热后，倒入鸡蛋液，中火翻炒 15 秒，先煎成蛋饼，然后再用锅铲切成小块",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-5",
        "stepNo": 5,
        "title": "关火",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "关火，将鸡蛋块 盛到盘子中，不要洗锅",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-6",
        "stepNo": 6,
        "title": "重新开火",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "重新开火，倒入 5ml 油，油热后，放入菠菜，大火 翻炒 15 秒后，倒入鸡蛋块，翻炒均匀",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-7",
        "stepNo": 7,
        "title": "加入 5g 盐、10",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "加入 5g 盐、100ml 饮用水，大火 翻炒 10 秒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-50-step-8",
        "stepNo": 8,
        "title": "关火",
        "image": "/static/assets/dishes/real/home-dish-50.jpg",
        "description": "关火，盛盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-51",
    "name": "西葫芦炒鸡蛋",
    "emoji": "🍗",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-51.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-51.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-51.jpg",
    "description": "西葫芦炒鸡蛋是一道清爽可口的家常快手菜，西葫芦软嫩多汁、鸡蛋鲜香松软，加入西红柿后更添酸甜风味，十分下饭。鸡蛋提供优质蛋白质和卵磷脂，西葫芦含有丰富的维生素 C 和膳食纤维，搭配食用营养均衡。制作过程简单，对新手非常友好，从备料到出锅一般初",
    "difficulty": "简单",
    "estimatedMinutes": 15,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-51-ing-1",
        "groupType": "main",
        "name": "西葫芦",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-51-ing-2",
        "groupType": "main",
        "name": "鸡蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-51-ing-3",
        "groupType": "side",
        "name": "西红柿",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-51-ing-4",
        "groupType": "seasoning",
        "name": "食用盐",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-51-ing-5",
        "groupType": "seasoning",
        "name": "食用油",
        "amount": "适量",
        "sortOrder": 4
      }
    ],
    "steps": [
      {
        "id": "home-dish-51-step-1",
        "stepNo": 1,
        "title": "西红柿洗净",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "西红柿洗净，切成小块，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-2",
        "stepNo": 2,
        "title": "西葫芦洗净",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "西葫芦洗净，切成边长约为 4cm 的菱形，备用",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-3",
        "stepNo": 3,
        "title": "打三个鸡蛋到碗里",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "打三个鸡蛋到碗里，打散搅匀，备用",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-4",
        "stepNo": 4,
        "title": "热锅",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "热锅，锅内放入 5ml - 10ml 食用油",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-5",
        "stepNo": 5,
        "title": "倒入鸡蛋",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "倒入鸡蛋，保持翻炒至鸡蛋成固体，用锅铲分成小块后盛到碗里，备用",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-6",
        "stepNo": 6,
        "title": "锅内放入 5ml -",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "锅内放入 5ml - 10ml 食用油，倒入西红柿，炒至变软",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-7",
        "stepNo": 7,
        "title": "倒入西葫芦一起翻炒均",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "倒入西葫芦一起翻炒均匀，放入 6g 食用盐，将火调小然后等待 4 - 5 分钟",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-8",
        "stepNo": 8,
        "title": "倒入备用的鸡蛋",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "倒入备用的鸡蛋，中火翻炒 15 秒",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-51-step-9",
        "stepNo": 9,
        "title": "关火",
        "image": "/static/assets/dishes/real/home-dish-51.jpg",
        "description": "关火，盛盘",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-52",
    "name": "茄子炖土豆",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-52.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-52.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-52.jpg",
    "description": "茄子炖土豆是一道东北家常炖菜，口感绵软咸香，带着辣椒的微辣和蒜香，十分下饭。茄子富含花青素和膳食纤维，土豆提供碳水化合物和维生素 C，加上猪肉的蛋白质，营养均衡又饱腹。这道菜操作流程简单，但需要掌握翻炒和收汁的火候，对新手有一定挑战，预估难",
    "difficulty": "中等",
    "estimatedMinutes": 45,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-52-ing-1",
        "groupType": "main",
        "name": "茄子的数量",
        "amount": "份数 1 个 （每个茄子约 150g）",
        "sortOrder": 0
      },
      {
        "id": "home-dish-52-ing-2",
        "groupType": "main",
        "name": "土豆数量",
        "amount": "份数 1 个（每个土豆约 150g）",
        "sortOrder": 1
      },
      {
        "id": "home-dish-52-ing-3",
        "groupType": "side",
        "name": "肉量",
        "amount": "份数 180 克",
        "sortOrder": 2
      },
      {
        "id": "home-dish-52-ing-4",
        "groupType": "seasoning",
        "name": "酱油量",
        "amount": "份数 15 毫升",
        "sortOrder": 3
      },
      {
        "id": "home-dish-52-ing-5",
        "groupType": "seasoning",
        "name": "盐量",
        "amount": "份数 5 克",
        "sortOrder": 4
      },
      {
        "id": "home-dish-52-ing-6",
        "groupType": "side",
        "name": "辣椒量",
        "amount": "50 克（调味",
        "sortOrder": 5
      },
      {
        "id": "home-dish-52-ing-7",
        "groupType": "side",
        "name": "蒜量",
        "amount": "3 瓣（调味",
        "sortOrder": 6
      }
    ],
    "steps": [
      {
        "id": "home-dish-52-step-1",
        "stepNo": 1,
        "title": "茄子、土豆、辣椒洗净",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "将茄子、土豆、辣椒洗净，蒜扒皮并拍碎。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-2",
        "stepNo": 2,
        "title": "茄子、土豆切成约 6",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "将茄子、土豆切成约 6 立方厘米的块，辣椒切成 5 克的小块，肉切成 3 厘米的丝。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-3",
        "stepNo": 3,
        "title": "开火",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "开火，热锅，加入份数 13 毫升的油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-4",
        "stepNo": 4,
        "title": "当能看到锅里的油冒出",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "当能看到锅里的油冒出一丝烟时，放入辣椒。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-5",
        "stepNo": 5,
        "title": "煸出辣椒香气后",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "煸出辣椒香气后，立刻放入肉，用铲子翻炒 30 秒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-6",
        "stepNo": 6,
        "title": "放入土豆",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "放入土豆，翻炒 30 秒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-7",
        "stepNo": 7,
        "title": "放入茄子",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "放入茄子，翻炒 30 秒。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-8",
        "stepNo": 8,
        "title": "放入酱油和盐",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "放入酱油和盐，继续翻炒 5 分钟。",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-9",
        "stepNo": 9,
        "title": "加入水",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "加入水，水面高度为锅内食材高度的 0.9 倍，并盖上锅盖。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-52-step-10",
        "stepNo": 10,
        "title": "等待",
        "image": "/static/assets/dishes/real/home-dish-52.jpg",
        "description": "等待，直到锅内水的高度剩余食材高度的 0.1 倍时，开盖，放入蒜，搅拌均匀，关火。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-53",
    "name": "干锅花菜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-53.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-53.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-53.jpg",
    "description": "干锅花菜是一道湘味家常菜，口感脆嫩干香，五花肉焦香四溢，带着微微辣意。花菜富含维生素 C 和膳食纤维，搭配五花肉补充蛋白质与能量。制作难度适中，只需注意焯水后充分沥干并把五花肉煸出油脂，适合有一定基础的烹饪新手。从准备到出锅大约需要 40 ",
    "difficulty": "中等",
    "estimatedMinutes": 40,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "下饭"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-53-ing-1",
        "groupType": "main",
        "name": "花菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-53-ing-2",
        "groupType": "main",
        "name": "五花肉",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-53-ing-3",
        "groupType": "side",
        "name": "辣椒",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-53-ing-4",
        "groupType": "seasoning",
        "name": "生抽",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-53-ing-5",
        "groupType": "seasoning",
        "name": "白糖",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-53-ing-6",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-53-ing-7",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-53-ing-8",
        "groupType": "seasoning",
        "name": "油",
        "amount": "适量",
        "sortOrder": 7
      }
    ],
    "steps": [
      {
        "id": "home-dish-53-step-1",
        "stepNo": 1,
        "title": "花菜朵朝下",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "花菜朵朝下，没入淡盐水中浸泡 20 分钟。然后洗净用小刀拆成小朵",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-2",
        "stepNo": 2,
        "title": "入开水锅中焯水 1 ",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "入开水锅中焯水 1 分钟，捞出立即用冷水冲淋至完全凉透，沥水备用",
        "heat": "中火",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-3",
        "stepNo": 3,
        "title": "五花肉切成薄片",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "五花肉切成薄片，大蒜白色切下用刀背拍扁，小红辣椒切成段",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-4",
        "stepNo": 4,
        "title": "锅烧热放油",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "锅烧热放油，油热下大葱白爆香",
        "heat": "中大火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-5",
        "stepNo": 5,
        "title": "下五花肉片入锅",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "下五花肉片入锅，用中火煸炒至表面全部变色，继续煸炒一会儿，把肥肉部分的油份逼出一部分",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-6",
        "stepNo": 6,
        "title": "倒入红辣椒段和花菜",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "倒入红辣椒段和花菜，翻炒几下",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-7",
        "stepNo": 7,
        "title": "加入 10 ml 生",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "加入 10 ml 生抽",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-8",
        "stepNo": 8,
        "title": "再加入 5 g 白糖",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "再加入 5 g 白糖，转大火不断翻炒 1 分钟",
        "heat": "中火",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-53-step-9",
        "stepNo": 9,
        "title": "大蒜叶部分切成段",
        "image": "/static/assets/dishes/real/home-dish-53.jpg",
        "description": "把大蒜叶部分切成段，放入锅中，翻炒几下后，关火盖上盖子焖 1 分钟即可",
        "heat": "无",
        "minutes": 12,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  },
  {
    "id": "home-dish-54",
    "name": "上汤娃娃菜",
    "emoji": "🥬",
    "category": "vegetable",
    "coverImage": "/static/assets/dishes/real/home-dish-54.jpg",
    "squareImage": "/static/assets/dishes/real/home-dish-54.jpg",
    "detailImage": "/static/assets/dishes/real/home-dish-54.jpg",
    "description": "这道上汤娃娃菜清甜鲜美，口感软嫩，属于家常素菜，尤其适合减肥期间食用。娃娃菜富含维生素和膳食纤维，低脂低热量，搭配皮蛋和午餐肉增添风味又不会过多增加负担。制作难度适中，新手也能尝试，从备菜到出锅大约只需 20 分钟。",
    "difficulty": "中等",
    "estimatedMinutes": 20,
    "servings": 2,
    "tasteTags": [
      "家常菜",
      "素菜",
      "快手"
    ],
    "rating": 0,
    "ratingCount": 0,
    "isFavorite": false,
    "ingredients": [
      {
        "id": "home-dish-54-ing-1",
        "groupType": "main",
        "name": "娃娃菜",
        "amount": "适量",
        "sortOrder": 0
      },
      {
        "id": "home-dish-54-ing-2",
        "groupType": "main",
        "name": "皮蛋",
        "amount": "适量",
        "sortOrder": 1
      },
      {
        "id": "home-dish-54-ing-3",
        "groupType": "side",
        "name": "午餐肉",
        "amount": "适量",
        "sortOrder": 2
      },
      {
        "id": "home-dish-54-ing-4",
        "groupType": "side",
        "name": "葱",
        "amount": "适量",
        "sortOrder": 3
      },
      {
        "id": "home-dish-54-ing-5",
        "groupType": "side",
        "name": "姜",
        "amount": "适量",
        "sortOrder": 4
      },
      {
        "id": "home-dish-54-ing-6",
        "groupType": "side",
        "name": "蒜",
        "amount": "适量",
        "sortOrder": 5
      },
      {
        "id": "home-dish-54-ing-7",
        "groupType": "seasoning",
        "name": "盐",
        "amount": "适量",
        "sortOrder": 6
      },
      {
        "id": "home-dish-54-ing-8",
        "groupType": "seasoning",
        "name": "糖",
        "amount": "适量",
        "sortOrder": 7
      },
      {
        "id": "home-dish-54-ing-9",
        "groupType": "seasoning",
        "name": "淀粉",
        "amount": "适量",
        "sortOrder": 8
      }
    ],
    "steps": [
      {
        "id": "home-dish-54-step-1",
        "stepNo": 1,
        "title": "娃娃菜洗净",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "娃娃菜洗净, 竖着切开切成段。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-2",
        "stepNo": 2,
        "title": "葱 3g 切 小段",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "葱 3g 切 小段。蒜 10g 切片。姜 10g 切小片。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-3",
        "stepNo": 3,
        "title": "皮蛋切成丁",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "皮蛋切成丁, 火腿肠或者午餐肉切成丁（1cm 大小的丁）",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-4",
        "stepNo": 4,
        "title": "金针菇洗净撕开",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "金针菇洗净撕开",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-5",
        "stepNo": 5,
        "title": "烧热水娃娃菜放进去十",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "烧热水娃娃菜放进去十秒钟出一下水捞出。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-6",
        "stepNo": 6,
        "title": "热锅凉油",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "热锅凉油, 加热锅倒入油过一遍就倒出来, 重新倒入一点油。",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-7",
        "stepNo": 7,
        "title": "调至小火加入葱姜蒜",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "调至小火加入葱姜蒜，煎炒出香味即可。",
        "heat": "无",
        "minutes": 4,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-8",
        "stepNo": 8,
        "title": "加入适 300g 清",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "加入适 300g 清水（水量没过娃娃菜即可）, 放入娃娃菜, 金针菇, 午餐肉",
        "heat": "中火",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-9",
        "stepNo": 9,
        "title": "加入调味料蚝油、糖、",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "加入调味料蚝油、糖、盐、味精烧开。",
        "heat": "无",
        "minutes": 3,
        "tips": "按锅内状态微调火候和咸淡。"
      },
      {
        "id": "home-dish-54-step-10",
        "stepNo": 10,
        "title": "煮 3 分钟",
        "image": "/static/assets/dishes/real/home-dish-54.jpg",
        "description": "煮 3 分钟, 煮开后开始装盘, 盛出娃娃菜后皮蛋放在上面把汤汁浇上去就可以了",
        "heat": "无",
        "minutes": 6,
        "tips": "按锅内状态微调火候和咸淡。"
      }
    ],
    "tips": [
      "按锅内状态微调火候和咸淡。"
    ]
  }
]
