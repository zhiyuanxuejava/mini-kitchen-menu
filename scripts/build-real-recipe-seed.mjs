import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const HOWTOCOOK_REPO = 'https://github.com/Anduin2017/HowToCook'
const HOWTOCOOK_RAW = 'https://raw.githubusercontent.com/Anduin2017/HowToCook/master/'
const HOWTOCOOK_TREE = 'https://api.github.com/repos/Anduin2017/HowToCook/git/trees/master?recursive=1'

const SELECTED_DISHES = [
  { name: '红烧肉', match: '红烧肉/简易红烧肉.md' },
  { name: '西红柿炒鸡蛋' },
  { name: '紫菜蛋花汤' },
  { name: '酸辣土豆丝' },
  { name: '麻婆豆腐' },
  { name: '可乐鸡翅' },
  { name: '宫保鸡丁' },
  { name: '鱼香肉丝' },
  { name: '回锅肉' },
  { name: '糖醋排骨' },
  { name: '糖醋里脊' },
  { name: '黄焖鸡' },
  { name: '水煮肉片' },
  { name: '小炒肉' },
  { name: '孜然牛肉' },
  { name: '尖椒炒牛肉' },
  { name: '蒜苔炒肉末' },
  { name: '鱼香茄子' },
  { name: '辣椒炒肉' },
  { name: '香菇滑鸡' },
  { name: '土豆炖排骨' },
  { name: '梅菜扣肉' },
  { name: '红烧鸡翅' },
  { name: '西红柿牛腩' },
  { name: '青椒土豆炒肉' },
  { name: '清蒸鲈鱼' },
  { name: '红烧鱼' },
  { name: '水煮鱼' },
  { name: '油焖大虾' },
  { name: '白灼虾' },
  { name: '蒜蓉虾' },
  { name: '玉米排骨汤' },
  { name: '排骨山药玉米汤' },
  { name: '西红柿鸡蛋汤' },
  { name: '蛋炒饭' },
  { name: '扬州炒饭' },
  { name: '葱油拌面' },
  { name: '炸酱面' },
  { name: '豆角焖面' },
  { name: '手工水饺' },
  { name: '手撕包菜' },
  { name: '地三鲜' },
  { name: '虎皮青椒' },
  { name: '蚝油生菜' },
  { name: '蒜蓉西兰花' },
  { name: '蒜蓉空心菜' },
  { name: '凉拌黄瓜' },
  { name: '凉拌木耳' },
  { name: '小炒藕丁' },
  { name: '菠菜炒鸡蛋' },
  { name: '西葫芦炒鸡蛋' },
  { name: '茄子炖土豆' },
  { name: '干锅花菜' },
  { name: '上汤娃娃菜' }
]

const ID_OVERRIDES = new Map([
  ['红烧肉', 'hongshaorou'],
  ['西红柿炒鸡蛋', 'tomato-egg'],
  ['紫菜蛋花汤', 'seaweed-egg-soup'],
  ['酸辣土豆丝', 'shredded-potato'],
  ['麻婆豆腐', 'mapo-tofu'],
  ['蒜蓉西兰花', 'garlic-broccoli'],
  ['蛋炒饭', 'egg-fried-rice']
])

const SEASONING_WORDS = [
  '油',
  '盐',
  '糖',
  '醋',
  '酱',
  '料酒',
  '蚝油',
  '淀粉',
  '胡椒',
  '花椒',
  '八角',
  '桂皮',
  '香叶',
  '辣椒粉',
  '孜然',
  '味精',
  '鸡精',
  '香油',
  '抽'
]

const IMAGE_SOURCE_PREFERENCE = [
  'home.meishichina.com',
  'meishichina.com',
  'xiachufang.com',
  'douguo.com',
  'meishij.net',
  'xiangha.com',
  'food.hiyd.com'
]

const MIN_IMAGE_MATCH_SCORE = 250

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchText(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'mini-kitchen-menu recipe import/1.0',
          'accept-language': 'zh-CN,zh;q=0.9'
        }
      })
      if (response.ok) return response.text()
      if (attempt === retries) throw new Error(`GET ${url} failed: ${response.status}`)
    } catch (error) {
      if (attempt === retries) throw error
    }
    await sleep(900 * (attempt + 1))
  }
  throw new Error(`GET ${url} failed`)
}

async function fetchJson(url) {
  const text = await fetchText(url)
  return JSON.parse(text)
}

function json(value) {
  return JSON.stringify(value, null, 2)
}

function clean(value) {
  return value
    .replace(/!\[(.*?)\]\(.*?\)/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function section(markdown, heading) {
  const match = markdown.match(new RegExp(`^##\\s+${heading}\\s*$`, 'm'))
  if (!match) return ''
  const start = match.index + match[0].length
  const rest = markdown.slice(start)
  const next = rest.search(/^##\s+/m)
  return (next >= 0 ? rest.slice(0, next) : rest).trim()
}

function categoryFromPath(recipePath) {
  if (recipePath.includes('/vegetable_dish/')) return 'vegetable'
  if (recipePath.includes('/soup/')) return 'soup'
  if (recipePath.includes('/staple/') || recipePath.includes('/breakfast/')) return 'staple'
  return 'meat'
}

function emojiFor(category, name) {
  if (name.includes('虾') || name.includes('鱼')) return '🦐'
  if (name.includes('鸡')) return '🍗'
  if (name.includes('牛')) return '🥩'
  if (name.includes('蛋')) return '🍳'
  if (category === 'soup') return '🍲'
  if (category === 'staple') return '🍚'
  if (category === 'vegetable') return '🥬'
  return '🍽️'
}

function difficultyFrom(markdown, stepsCount) {
  const stars = markdown.match(/预估烹饪难度[:：]\s*([★☆]+)/)?.[1]
  const score = stars ? [...stars].filter((char) => char === '★').length : Math.ceil(stepsCount / 4)
  if (score <= 2) return '简单'
  if (score <= 3) return '中等'
  return '较难'
}

function minutesFrom(markdown, steps) {
  const explicit = markdown.match(/(?:约|大约|大概|需|需要|只需|耗时)[^0-9]{0,8}(\d{1,3})\s*分钟/)?.[1]
  if (explicit) return Number(explicit)
  const sum = steps.reduce((total, step) => total + step.minutes, 0)
  return Math.max(10, Math.min(120, sum))
}

function groupTypeFor(name, index) {
  if (SEASONING_WORDS.some((word) => name.includes(word))) return 'seasoning'
  return index < 2 ? 'main' : 'side'
}

function parseIngredients(markdown) {
  const calc = section(markdown, '计算')
  const rows = []
  for (const line of calc.split('\n')) {
    const match = line.match(/^\s*[*-]\s*([^=：:]+)\s*[=：:]\s*(.+)$/)
    if (!match) continue
    const name = clean(match[1]).replace(/总量$/, '').trim()
    const amount = clean(match[2]).replace(/\s*\*\s*份数/g, ' / 份').replace(/，.*$/, '')
    if (name && amount && !name.includes('总量')) rows.push({ name, amount })
  }

  if (!rows.length) {
    const required = section(markdown, '必备原料和工具')
    for (const line of required.split('\n')) {
      const match = line.match(/^\s*[*-]\s+(.+)$/)
      if (!match) continue
      const name = clean(match[1]).replace(/[（(].*$/, '').trim()
      if (name && !['锅', '碗', '盘', '刀', '砧板', '锅铲'].some((tool) => name.includes(tool))) rows.push({ name, amount: '适量' })
    }
  }

  const unique = []
  const seen = new Set()
  for (const row of rows) {
    if (seen.has(row.name)) continue
    seen.add(row.name)
    unique.push(row)
  }

  return unique.slice(0, 16).map((row, index) => ({
    groupType: groupTypeFor(row.name, index),
    name: row.name,
    amount: row.amount || '适量'
  }))
}

function estimateStepMinutes(text) {
  if (/炖|煲|焖|烤|蒸/.test(text)) return 12
  if (/煮|焯|炸/.test(text)) return 6
  if (/炒|煎|爆香|收汁/.test(text)) return 4
  return 3
}

function estimateHeat(text) {
  if (/洗|切|腌|调|拌|盛|装盘|准备/.test(text)) return '无'
  if (/炖|焖|煲|收汁/.test(text)) return '小火'
  if (/爆香|快炒|油热|煎|炸/.test(text)) return '中大火'
  return '中火'
}

function titleForStep(text, index) {
  const normalized = clean(text)
  const phrase = normalized.split(/[，。；;,.]/)[0] || normalized
  const compact = phrase.replace(/^将|^把|^向锅中|^锅中/, '')
  return compact.length > 10 ? compact.slice(0, 10) : compact || `第 ${index + 1} 步`
}

function parseSteps(markdown) {
  const operations = section(markdown, '操作')
  const parsed = []
  let current = null

  for (const rawLine of operations.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    const numbered = line.match(/^(\d+)\.\s+(.+)$/)
    if (numbered) {
      if (current) parsed.push(current)
      current = { text: clean(numbered[2]), notes: [] }
      continue
    }
    const note = line.match(/^[-*]\s+(.+)$/)
    if (current && note) current.notes.push(clean(note[1]))
  }
  if (current) parsed.push(current)

  const steps = parsed
    .filter((item) => item.text && !/^如果您遵循/.test(item.text))
    .slice(0, 12)
    .map((item, index) => {
      const extra = item.notes.length ? ` 注意：${item.notes.slice(0, 2).join('；')}` : ''
      const description = `${item.text}${extra}`.slice(0, 180)
      return {
        title: titleForStep(item.text, index),
        description,
        heat: estimateHeat(description),
        minutes: estimateStepMinutes(description),
        tips: item.notes[0] || '按锅内状态微调火候和咸淡。'
      }
    })

  return steps.length
    ? steps
    : [
        {
          title: '备料',
          description: '按菜谱准备食材和调料，切配完成后再开火。',
          heat: '无',
          minutes: 5,
          tips: '先备齐调料可以避免下锅后手忙脚乱。'
        }
      ]
}

function parseDescription(markdown, name) {
  const afterTitle = markdown.replace(/^#.*$/m, '').trim()
  const beforeMeta = afterTitle.split(/预估烹饪难度|##\s+必备原料和工具/)[0]
  const paragraph = clean(beforeMeta)
  if (paragraph.length >= 12) return paragraph.slice(0, 120)
  return `${name} 是常见家常菜，整理自 HowToCook 开源菜谱，包含配料比例和可执行步骤。`
}

function tipsFrom(steps, markdown) {
  const extra = section(markdown, '附加内容')
  const bulletTips = [...extra.matchAll(/^\s*[*-]\s+(.+)$/gm)].map((match) => clean(match[1]))
  const stepTips = steps.map((step) => step.tips).filter(Boolean)
  const all = [...stepTips, ...bulletTips, '出锅前尝味，根据口味微调盐分。']
  const unique = []
  for (const tip of all) {
    if (!tip || unique.includes(tip)) continue
    unique.push(tip.slice(0, 60))
  }
  return unique.slice(0, 3)
}

function tagsFor(category, difficulty, minutes) {
  const labels = {
    meat: '荤菜',
    vegetable: '素菜',
    soup: '汤类',
    staple: '主食'
  }
  return ['家常菜', labels[category], minutes <= 20 ? '快手' : difficulty === '较难' ? '周末菜' : '下饭'].filter(Boolean)
}

function slugFor(name, index) {
  if (ID_OVERRIDES.has(name)) return ID_OVERRIDES.get(name)
  return `home-dish-${String(index + 1).padStart(2, '0')}`
}

function resolveRecipePath(paths, item) {
  if (item.match) {
    const matched = paths.find((recipePath) => recipePath.endsWith(item.match))
    if (matched) return matched
  }
  const exactFile = paths.find((recipePath) => recipePath.endsWith(`/${item.name}.md`))
  if (exactFile) return exactFile
  const nested = paths.find((recipePath) => recipePath.includes(`/${item.name}/`) && recipePath.endsWith('.md'))
  if (nested) return nested
  const fuzzy = paths.find((recipePath) => recipePath.includes(item.name) && recipePath.endsWith('.md'))
  if (fuzzy) return fuzzy
  throw new Error(`No recipe path found for ${item.name}`)
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\\\//g, '/')
}

function normalizeSearchText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

function toHttpsWhenLikelySupported(url) {
  if (!url.startsWith('http://')) return url
  if (/^http:\/\/(i\d+\.meishichina\.com|cp\d+\.douguo\.com|i\d+\.chuimg\.com)\//.test(url)) {
    return url.replace(/^http:\/\//, 'https://')
  }
  return url
}

function imageUrlFrom(item, key) {
  const value = decodeHtml(String(item[key] || '')).trim()
  return /^https?:\/\//.test(value) ? toHttpsWhenLikelySupported(value) : ''
}

function scoreImageCandidate(item, name) {
  const title = normalizeSearchText(item.title || item.litetitle)
  const link = normalizeSearchText(item.link || '')
  const site = String(item.site || item.dspurl || '')
  let score = 0

  if (title.includes(normalizeSearchText(name))) score += 300
  if (link.includes(encodeURIComponent(name).toLowerCase()) || link.includes(normalizeSearchText(name))) score += 40

  const preferredIndex = IMAGE_SOURCE_PREFERENCE.findIndex((domain) => site.includes(domain))
  if (preferredIndex >= 0) score += 80 - preferredIndex * 5

  const width = Number(item.width || 0)
  const height = Number(item.height || 0)
  if (width >= 400 && height >= 300) score += 25
  if (width > height) score += 10
  if (/步骤|做法|怎么做|菜谱|家常/.test(item.title || '')) score += 20
  if (/合集|大全|菜单|视频|素材|海报|卡通|表情|头像/.test(item.title || '')) score -= 120
  if (!imageUrlFrom(item, 'thumb') && !imageUrlFrom(item, 'img')) score -= 999

  return score
}

async function fetchImageCandidates(name) {
  const searchUrl = `https://image.so.com/j?q=${encodeURIComponent(`${name} 的做法 成品图 家常菜`)}&src=srp&sn=0&pn=30`
  const response = await fetch(searchUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 mini-kitchen-menu recipe image import/1.0',
      referer: 'https://image.so.com/'
    }
  })
  if (!response.ok) throw new Error(`GET ${searchUrl} failed: ${response.status}`)
  const payload = await response.json()
  return Array.isArray(payload.list) ? payload.list : []
}

async function isReachableImage(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 mini-kitchen-menu recipe image import/1.0',
        range: 'bytes=0-2047'
      },
      signal: controller.signal
    })
    const contentType = response.headers.get('content-type') || ''
    return (response.ok || response.status === 206) && contentType.startsWith('image/')
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function findDishImage(name) {
  const candidates = (await fetchImageCandidates(name))
    .map((item) => ({ item, score: scoreImageCandidate(item, name) }))
    .filter((candidate) => candidate.score >= MIN_IMAGE_MATCH_SCORE)
    .sort((a, b) => b.score - a.score)

  for (const candidate of candidates.slice(0, 8)) {
    const coverImage = imageUrlFrom(candidate.item, 'thumb') || imageUrlFrom(candidate.item, 'img')
    if (!coverImage || !(await isReachableImage(coverImage))) continue

    const sourceImageUrl = imageUrlFrom(candidate.item, 'img') || coverImage
    return {
      coverImage,
      squareImage: coverImage,
      detailImage: coverImage,
      sourceImageUrl,
      sourceThumbnailUrl: coverImage,
      sourceTitle: clean(candidate.item.title || candidate.item.litetitle || name),
      sourcePage: decodeHtml(String(candidate.item.link || '')).trim(),
      sourceSite: candidate.item.site || candidate.item.dspurl || '',
      score: candidate.score
    }
  }

  throw new Error(`No reachable matching image found for ${name}`)
}

function frontendDishCode(dishes) {
  return `import type { Dish, DishCategory, Ingredient } from './types'

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

export const seedDishes: Dish[] = ${json(dishes)}
`
}

function backendDishCode(dishes) {
  const sample = dishes.map((dish) => ({
    name: dish.name,
    category: dish.category,
    coverImage: dish.coverImage,
    description: dish.description,
    difficulty: dish.difficulty,
    estimatedMinutes: dish.estimatedMinutes,
    servings: dish.servings,
    tasteTags: dish.tasteTags,
    ingredients: dish.ingredients.map((item) => [item.groupType, item.name, item.amount]),
    steps: dish.steps.map((step) => ({
      title: step.title,
      description: step.description,
      image: step.image,
      heat: step.heat,
      minutes: step.minutes,
      tips: step.tips
    }))
  }))
  return `export const sampleDishes = ${json(sample)} as const
`
}

async function main() {
  const tree = await fetchJson(HOWTOCOOK_TREE)
  const paths = tree.tree
    .map((item) => item.path)
    .filter((recipePath) => /^dishes\/(aquatic|meat_dish|vegetable_dish|soup|staple|breakfast)\/.*\.md$/.test(recipePath))

  const imageCache = new Map()
  const dishes = []
  const sources = []

  for (let index = 0; index < SELECTED_DISHES.length; index += 1) {
    const selected = SELECTED_DISHES[index]
    const recipePath = resolveRecipePath(paths, selected)
    const sourceUrl = `${HOWTOCOOK_REPO}/blob/master/${recipePath}`
    const rawUrl = `${HOWTOCOOK_RAW}${encodeURI(recipePath)}`
    const markdown = await fetchText(rawUrl)
    const category = categoryFromPath(recipePath)
    const steps = parseSteps(markdown)
    const name = selected.name
    const id = slugFor(name, index)

    let image = imageCache.get(name)
    if (!image) {
      image = await findDishImage(name)
      await sleep(250)
      imageCache.set(name, image)
    }

    const { coverImage, squareImage, detailImage } = image
    const ingredients = parseIngredients(markdown).map((ingredient, ingredientIndex) => ({
      id: `${id}-ing-${ingredientIndex + 1}`,
      ...ingredient,
      sortOrder: ingredientIndex
    }))
    const dishSteps = steps.map((step, stepIndex) => ({
      id: `${id}-step-${stepIndex + 1}`,
      stepNo: stepIndex + 1,
      title: step.title,
      image: coverImage,
      description: step.description,
      heat: step.heat,
      minutes: step.minutes,
      tips: step.tips
    }))
    const difficulty = difficultyFrom(markdown, dishSteps.length)
    const estimatedMinutes = minutesFrom(markdown, dishSteps)

    dishes.push({
      id,
      name,
      emoji: emojiFor(category, name),
      category,
      coverImage,
      squareImage,
      detailImage,
      description: parseDescription(markdown, name),
      difficulty,
      estimatedMinutes,
      servings: 2,
      tasteTags: tagsFor(category, difficulty, estimatedMinutes),
      rating: 0,
      ratingCount: 0,
      isFavorite: index < 6,
      ingredients,
      steps: dishSteps,
      tips: tipsFrom(dishSteps, markdown)
    })

    sources.push({
      id,
      name,
      recipeSource: sourceUrl,
      recipeLicense: 'HowToCook / Unlicense public domain dedication',
      imageSource: image.sourceSite ? `${image.sourceSite} via 360 Image Search` : '360 Image Search result',
      imageTitle: image.sourceTitle,
      imagePage: image.sourcePage,
      imageUrl: image.sourceImageUrl,
      thumbnailUrl: image.sourceThumbnailUrl,
      imageMatchScore: image.score
    })
  }

  const imageOwners = new Map()
  for (const dish of dishes) {
    const owners = imageOwners.get(dish.coverImage) || []
    owners.push(dish.name)
    imageOwners.set(dish.coverImage, owners)
  }
  const duplicatedImages = [...imageOwners.values()].filter((owners) => owners.length > 1)
  if (duplicatedImages.length) {
    throw new Error(`Duplicate dish images found: ${duplicatedImages.map((owners) => owners.join(' / ')).join('; ')}`)
  }

  await fs.writeFile(path.join(ROOT, 'frontend/src/data/seed.ts'), frontendDishCode(dishes), 'utf8')
  await fs.writeFile(path.join(ROOT, 'backend/src/sample-data.ts'), backendDishCode(dishes), 'utf8')
  await fs.mkdir(path.join(ROOT, 'output'), { recursive: true })
  await fs.writeFile(path.join(ROOT, 'output/recipe-import-sources.json'), `${json(sources)}\n`, 'utf8')
  console.log(`Generated ${dishes.length} dishes`)
  console.log(`Unique dish cover images: ${imageOwners.size}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
