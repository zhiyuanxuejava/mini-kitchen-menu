import { asset } from './assets'
import type { Dish, DishCategory, Difficulty, Ingredient, DishStep } from './types'

const imageMap = {
  hongshaorou: {
    card: asset('dishes/png/card/hongshaorou_card.png'),
    square: asset('dishes/png/square/hongshaorou_square.png'),
    detail: asset('dishes/png/detail/hongshaorou_detail.png')
  },
  tomatoEgg: {
    card: asset('dishes/png/card/tomato_egg_card.png'),
    square: asset('dishes/png/square/tomato_egg_square.png'),
    detail: asset('dishes/png/detail/tomato_egg_detail.png')
  },
  seaweedSoup: {
    card: asset('dishes/png/card/seaweed_egg_soup_card.png'),
    square: asset('dishes/png/square/seaweed_egg_soup_square.png'),
    detail: asset('dishes/png/detail/seaweed_egg_soup_detail.png')
  },
  potato: {
    card: asset('dishes/png/card/shredded_potato_card.png'),
    square: asset('dishes/png/square/shredded_potato_square.png'),
    detail: asset('dishes/png/detail/shredded_potato_detail.png')
  },
  mapo: {
    card: asset('dishes/png/card/mapo_tofu_card.png'),
    square: asset('dishes/png/square/mapo_tofu_square.png'),
    detail: asset('dishes/png/detail/mapo_tofu_detail.png')
  },
  beef: {
    card: asset('dishes/png/card/broccoli_beef_card.png'),
    square: asset('dishes/png/square/broccoli_beef_square.png'),
    detail: asset('dishes/png/detail/broccoli_beef_detail.png')
  }
}

const groupNames = {
  main: '主料',
  side: '辅料',
  seasoning: '调料'
} satisfies Record<Ingredient['groupType'], string>

interface StepSeed {
  title: string
  description: string
  heat: string
  minutes: number
  tips: string
  timeLabel?: string
}

interface DishSeed {
  id: string
  name: string
  emoji: string
  category: DishCategory
  images: keyof typeof imageMap
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  servings: number
  tasteTags: string[]
  rating: number
  ratingCount: number
  isFavorite?: boolean
  main: string
  side: string
  seasoning: string
  steps: StepSeed[]
  tips: string[]
}

function splitRows(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseIngredient(value: string) {
  const [name, ...amount] = value.trim().split(/\s+/)
  return {
    name,
    amount: amount.join(' ') || '适量'
  }
}

function ingredients(id: string, rows: Array<[Ingredient['groupType'], string]>): Ingredient[] {
  let sortOrder = 0
  return rows.flatMap(([groupType, value]) =>
    splitRows(value).map((item) => {
      const parsed = parseIngredient(item)
      sortOrder += 1
      return {
        id: `${id}-${groupType}-${sortOrder}`,
        groupType,
        name: parsed.name,
        amount: parsed.amount,
        sortOrder
      }
    })
  )
}

function steps(id: string, image: string, rows: StepSeed[]): DishStep[] {
  return rows.map((step, index) => ({
    id: `${id}-step-${index + 1}`,
    stepNo: index + 1,
    title: step.title,
    description: step.description,
    image,
    heat: step.heat,
    minutes: step.minutes,
    timeLabel: step.timeLabel,
    tips: step.tips
  }))
}

const seeds: DishSeed[] = [
  {
    id: 'hongshaorou',
    name: '红烧肉',
    emoji: '🥩',
    category: 'meat',
    images: 'hongshaorou',
    description: '色泽红亮，肥而不腻，入口软糯，酱香浓郁。',
    difficulty: '中等',
    estimatedMinutes: 60,
    servings: 3,
    tasteTags: ['家常菜', '咸香微甜', '下饭'],
    rating: 4.8,
    ratingCount: 328,
    isFavorite: true,
    main: '五花肉 500g, 生姜 15g',
    side: '葱 2根, 八角 2个, 香叶 2片',
    seasoning: '冰糖 25g, 料酒 1勺, 生抽 2勺, 老抽 1勺',
    steps: [
      { title: '切肉', description: '五花肉切成均匀方块，冷水冲洗干净。', heat: '无需开火', minutes: 6, tips: '大小一致更容易熟透。' },
      { title: '焯水', description: '冷水下锅，加姜片和料酒煮出浮沫后捞出。', heat: '中火', minutes: 8, tips: '浮沫要撇干净。' },
      { title: '炒糖色', description: '小火融化冰糖，炒到琥珀色后下肉块翻匀。', heat: '小火', minutes: 8, tips: '糖色宁浅勿焦。' },
      { title: '炖煮', description: '加入调料和热水，盖盖小火炖到软糯。', heat: '小火', minutes: 32, tips: '水量没过肉块即可。' },
      { title: '收汁', description: '开盖转中火翻炒，让酱汁均匀包裹肉块。', heat: '中火', minutes: 6, tips: '收汁时勤翻动防粘锅。' }
    ],
    tips: ['选五花肉肥瘦相间', '糖色小火慢炒', '收汁时勤翻动']
  },
  {
    id: 'tomato-egg',
    name: '西红柿炒蛋',
    emoji: '🍅🍳',
    category: 'vegetable',
    images: 'tomatoEgg',
    description: '酸甜开胃，鸡蛋嫩滑，是最快手的家常菜。',
    difficulty: '简单',
    estimatedMinutes: 15,
    servings: 2,
    tasteTags: ['快手菜', '酸甜', '儿童友好'],
    rating: 4.7,
    ratingCount: 256,
    isFavorite: true,
    main: '鸡蛋 3个, 西红柿 2个',
    side: '葱花 适量',
    seasoning: '盐 3g, 糖 5g, 生抽 半勺',
    steps: [
      { title: '备料', description: '西红柿切块，鸡蛋加少许盐打散。', heat: '无需开火', minutes: 3, tips: '蛋液打到略微起泡。' },
      { title: '炒鸡蛋 🍳', description: '锅中倒油，油热后倒入打散的鸡蛋液，快速翻炒。', heat: '中小火', minutes: 8, timeLabel: '2-3分钟', tips: '炒到刚凝固即可，不要太老。' },
      { title: '下番茄 🍅', description: '下西红柿翻炒出汁，加入盐和少许糖。', heat: '中火', minutes: 3, tips: '番茄出汁后味道更浓。' },
      { title: '合炒 ✨', description: '倒回鸡蛋快速翻匀，撒葱花即可出锅。', heat: '大火', minutes: 1, tips: '合锅后不要久炒。' }
    ],
    tips: ['鸡蛋不要炒老', '番茄炒出汁再合锅', '糖能平衡酸味']
  },
  {
    id: 'seaweed-egg-soup',
    name: '紫菜蛋花汤',
    emoji: '🍲',
    category: 'soup',
    images: 'seaweedSoup',
    description: '清爽鲜美，十几分钟上桌，适合搭配重口味菜。',
    difficulty: '简单',
    estimatedMinutes: 20,
    servings: 3,
    tasteTags: ['清淡', '汤类', '快手'],
    rating: 4.6,
    ratingCount: 198,
    main: '鸡蛋 2个, 紫菜 6g',
    side: '虾皮 10g, 葱花 适量',
    seasoning: '盐 3g, 香油 半勺, 白胡椒 少许',
    steps: [
      { title: '煮汤底', description: '清水煮开后放入虾皮。', heat: '大火', minutes: 5, tips: '虾皮先煮出鲜味。' },
      { title: '下紫菜', description: '放入紫菜轻轻拨散。', heat: '中火', minutes: 4, tips: '紫菜不要久煮。' },
      { title: '淋蛋液', description: '沿锅边细流倒入蛋液形成蛋花。', heat: '小火', minutes: 5, tips: '倒蛋液时不要大力搅拌。' },
      { title: '调味', description: '加盐、胡椒和香油，撒葱花。', heat: '关火', minutes: 6, tips: '香油最后放更香。' }
    ],
    tips: ['蛋液细流入锅', '关火后点香油', '紫菜不要久煮']
  },
  {
    id: 'shredded-potato',
    name: '青椒土豆丝',
    emoji: '🥔🌶️',
    category: 'vegetable',
    images: 'potato',
    description: '脆爽微辣，酸香开胃，适合日常配米饭。',
    difficulty: '简单',
    estimatedMinutes: 15,
    servings: 2,
    tasteTags: ['素菜', '微辣', '脆爽'],
    rating: 4.6,
    ratingCount: 173,
    main: '土豆 2个, 青椒 1个',
    side: '干辣椒 2个, 蒜 3瓣',
    seasoning: '盐 3g, 米醋 1勺, 生抽 半勺',
    steps: [
      { title: '切丝', description: '土豆和青椒切细丝。', heat: '无需开火', minutes: 4, tips: '土豆丝粗细保持一致。' },
      { title: '泡洗', description: '土豆丝泡水洗掉表面淀粉。', heat: '无需开火', minutes: 4, tips: '沥干后再下锅。' },
      { title: '爆香', description: '热油爆香蒜片和干辣椒。', heat: '中火', minutes: 3, tips: '干辣椒不要炒糊。' },
      { title: '快炒', description: '下土豆丝和青椒大火快炒调味。', heat: '大火', minutes: 4, tips: '醋最后放更清香。' }
    ],
    tips: ['土豆丝泡掉淀粉', '全程大火快炒', '醋最后再放更香']
  },
  {
    id: 'mapo-tofu',
    name: '麻婆豆腐',
    emoji: '🌶️',
    category: 'meat',
    images: 'mapo',
    description: '麻辣鲜香，豆腐嫩滑，是米饭杀手。',
    difficulty: '中等',
    estimatedMinutes: 25,
    servings: 2,
    tasteTags: ['川味', '麻辣', '下饭'],
    rating: 4.6,
    ratingCount: 146,
    main: '嫩豆腐 1盒, 肉末 80g',
    side: '蒜苗 1根, 姜蒜 适量',
    seasoning: '豆瓣酱 1勺, 花椒粉 少许, 生抽 1勺',
    steps: [
      { title: '焯豆腐', description: '豆腐切块后用淡盐水焯热。', heat: '中火', minutes: 5, tips: '动作轻，避免碎。' },
      { title: '炒底料', description: '肉末炒香后加入豆瓣酱炒出红油。', heat: '中火', minutes: 8, tips: '豆瓣酱炒透更香。' },
      { title: '烧豆腐', description: '加入豆腐和少量水烧入味。', heat: '小火', minutes: 9, tips: '轻推不要翻碎。' },
      { title: '勾芡', description: '分次淋入水淀粉，撒花椒粉。', heat: '中火', minutes: 3, tips: '薄芡更清爽。' }
    ],
    tips: ['豆腐提前焯水', '红油炒足', '最后撒花椒粉']
  },
  {
    id: 'broccoli-beef',
    name: '西兰花牛肉',
    emoji: '🥦',
    category: 'meat',
    images: 'beef',
    description: '牛肉滑嫩，西兰花清甜，营养均衡。',
    difficulty: '中等',
    estimatedMinutes: 30,
    servings: 2,
    tasteTags: ['高蛋白', '清爽', '便当'],
    rating: 4.7,
    ratingCount: 132,
    main: '牛里脊 200g, 西兰花 1棵',
    side: '蒜 3瓣, 胡萝卜 少许',
    seasoning: '蚝油 1勺, 生抽 1勺, 淀粉 1勺',
    steps: [
      { title: '腌牛肉', description: '牛肉切片后加调料抓匀腌制。', heat: '无需开火', minutes: 10, tips: '加少许油锁住水分。' },
      { title: '焯西兰花', description: '西兰花焯到翠绿后捞出。', heat: '大火', minutes: 5, tips: '水里加盐和油。' },
      { title: '滑炒牛肉', description: '热锅快炒牛肉到变色。', heat: '大火', minutes: 6, tips: '不要炒老。' },
      { title: '合炒调味', description: '加入西兰花和料汁翻匀。', heat: '中火', minutes: 9, tips: '出锅前再调味。' }
    ],
    tips: ['牛肉逆纹切片', '焯菜保持翠绿', '快炒保持嫩滑']
  }
]

function parseIngredientRows(seed: DishSeed) {
  return ingredients(seed.id, [
    ['main', seed.main],
    ['side', seed.side],
    ['seasoning', seed.seasoning]
  ])
}

export const categoryLabels: Record<DishCategory | 'all', string> = {
  all: '全部',
  meat: '荤菜',
  vegetable: '素菜',
  soup: '汤类',
  staple: '主食',
  aquatic: '水产',
  breakfast: '早餐',
  dessert: '甜品',
  drink: '饮品',
  condiment: '调料',
  semi_finished: '半成品',
  other: '其他'
}

export const groupLabels: Record<Ingredient['groupType'], string> = groupNames

export const seedDishes: Dish[] = seeds.map((seed) => {
  const images = imageMap[seed.images]

  return {
    id: seed.id,
    name: seed.name,
    emoji: seed.emoji,
    category: seed.category,
    coverImage: images.card,
    squareImage: images.square,
    detailImage: images.detail,
    description: seed.description,
    difficulty: seed.difficulty,
    estimatedMinutes: seed.estimatedMinutes,
    servings: seed.servings,
    tasteTags: seed.tasteTags,
    rating: seed.rating,
    ratingCount: seed.ratingCount,
    isFavorite: Boolean(seed.isFavorite),
    ingredients: parseIngredientRows(seed),
    steps: steps(seed.id, images.detail, seed.steps),
    tips: seed.tips
  }
})
