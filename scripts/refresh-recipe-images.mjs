import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const FRONTEND_SEED = path.join(ROOT, 'frontend/src/data/seed.ts')
const BACKEND_SAMPLE = path.join(ROOT, 'backend/src/sample-data.ts')
const SOURCE_FILE = path.join(ROOT, 'output/recipe-import-sources.json')
const LOCAL_IMAGE_DIR = path.join(ROOT, 'frontend/src/static/assets/dishes/real')
const STATIC_IMAGE_PREFIX = '/static/assets/dishes/real'

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

const ID_OVERRIDES = new Map([
  ['红烧肉', 'hongshaorou'],
  ['西红柿炒鸡蛋', 'tomato-egg'],
  ['紫菜蛋花汤', 'seaweed-egg-soup'],
  ['酸辣土豆丝', 'shredded-potato'],
  ['麻婆豆腐', 'mapo-tofu'],
  ['蒜蓉西兰花', 'garlic-broccoli'],
  ['蛋炒饭', 'egg-fried-rice']
])

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function json(value) {
  return JSON.stringify(value, null, 2)
}

function clean(value) {
  return String(value || '')
    .replace(/!\[(.*?)\]\(.*?\)/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeHtml(value) {
  return String(value || '')
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
  const value = decodeHtml(item[key]).trim()
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

async function downloadDishImageWithFallback(dish, cachedImage) {
  try {
    return {
      image: cachedImage,
      localImage: await downloadImage(cachedImage.coverImage, dish.id)
    }
  } catch (cachedError) {
    const freshImage = await findDishImage(dish.name)
    try {
      return {
        image: freshImage,
        localImage: await downloadImage(freshImage.coverImage, dish.id)
      }
    } catch (freshError) {
      throw new Error(
        `Image download failed for ${dish.name} (${dish.id}). Cached: ${cachedImage.coverImage}. Fresh: ${freshImage.coverImage}. ${freshError.message || freshError}; cached error: ${cachedError.message || cachedError}`
      )
    }
  }
}

function extensionFromContentType(contentType, fallbackUrl) {
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
  const match = fallbackUrl.match(/\.([a-z0-9]+)(?:[?#].*)?$/i)
  return match ? match[1].toLowerCase() : 'jpg'
}

async function downloadImage(url, id) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 mini-kitchen-menu recipe image import/1.0'
      },
      signal: controller.signal
    })
    const contentType = response.headers.get('content-type') || ''
    if (!response.ok || !contentType.startsWith('image/')) {
      throw new Error(`Image download failed for ${id}: ${response.status} ${contentType}`)
    }

    const ext = extensionFromContentType(contentType, url)
    const filename = `${id}.${ext}`
    const filePath = path.join(LOCAL_IMAGE_DIR, filename)
    await fs.mkdir(LOCAL_IMAGE_DIR, { recursive: true })
    await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()))
    return {
      filePath,
      publicPath: `${STATIC_IMAGE_PREFIX}/${filename}`
    }
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

    return {
      coverImage,
      squareImage: coverImage,
      detailImage: coverImage,
      sourceImageUrl: imageUrlFrom(candidate.item, 'img') || coverImage,
      sourceThumbnailUrl: coverImage,
      sourceTitle: clean(candidate.item.title || candidate.item.litetitle || name),
      sourcePage: decodeHtml(candidate.item.link).trim(),
      sourceSite: candidate.item.site || candidate.item.dspurl || '',
      score: candidate.score
    }
  }

  throw new Error(`No reachable matching image found for ${name}`)
}

function imageFromExistingSource(source) {
  if (!source?.thumbnailUrl || (source.imageMatchScore || 0) < MIN_IMAGE_MATCH_SCORE) return null
  return {
    coverImage: source.thumbnailUrl,
    squareImage: source.thumbnailUrl,
    detailImage: source.thumbnailUrl,
    sourceImageUrl: source.imageUrl || source.thumbnailUrl,
    sourceThumbnailUrl: source.thumbnailUrl,
    sourceTitle: source.imageTitle || source.name,
    sourcePage: source.imagePage || '',
    sourceSite: source.imageSource?.replace(/\s+via 360 Image Search$/, '') || '',
    score: source.imageMatchScore
  }
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

function slugFor(name, index, sourceByName) {
  const sourceId = sourceByName.get(name)?.id
  if (sourceId) return sourceId
  if (ID_OVERRIDES.has(name)) return ID_OVERRIDES.get(name)
  return `home-dish-${String(index + 1).padStart(2, '0')}`
}

function tipsFromBackendSteps(steps) {
  const tips = []
  for (const step of steps) {
    if (step.tips && !tips.includes(step.tips)) tips.push(step.tips)
  }
  if (!tips.length) tips.push('出锅前尝味，根据口味微调盐分。')
  return tips.slice(0, 3)
}

function buildFrontendDishesFromBackend(backendDishes, sourceByName) {
  return backendDishes.map((dish, index) => {
    const id = slugFor(dish.name, index, sourceByName)
    return {
      id,
      name: dish.name,
      emoji: emojiFor(dish.category, dish.name),
      category: dish.category,
      coverImage: dish.coverImage,
      squareImage: dish.coverImage,
      detailImage: dish.coverImage,
      description: dish.description,
      difficulty: dish.difficulty,
      estimatedMinutes: dish.estimatedMinutes,
      servings: dish.servings,
      tasteTags: dish.tasteTags,
      rating: 0,
      ratingCount: 0,
      isFavorite: index < 6,
      ingredients: dish.ingredients.map(([groupType, name, amount], ingredientIndex) => ({
        id: `${id}-ing-${ingredientIndex + 1}`,
        groupType,
        name,
        amount,
        sortOrder: ingredientIndex
      })),
      steps: dish.steps.map((step, stepIndex) => ({
        id: `${id}-step-${stepIndex + 1}`,
        stepNo: stepIndex + 1,
        title: step.title,
        image: step.image || dish.coverImage,
        description: step.description,
        heat: step.heat,
        minutes: step.minutes,
        tips: step.tips
      })),
      tips: tipsFromBackendSteps(dish.steps)
    }
  })
}

function extractFrontendDishes(source) {
  const marker = 'export const seedDishes: Dish[] = '
  const index = source.indexOf(marker)
  if (index < 0) throw new Error('Cannot find seedDishes in frontend seed file')
  return JSON.parse(source.slice(index + marker.length).trim())
}

function extractBackendSample(source) {
  const marker = 'export const sampleDishes = '
  const index = source.indexOf(marker)
  if (index < 0) throw new Error('Cannot find sampleDishes in backend sample file')
  return JSON.parse(source.slice(index + marker.length).replace(/\s+as const\s*$/, '').trim())
}

function backendDishCode(dishes) {
  return `export const sampleDishes = ${json(dishes)} as const
`
}

async function main() {
  const frontendSource = await fs.readFile(FRONTEND_SEED, 'utf8')
  const backendSource = await fs.readFile(BACKEND_SAMPLE, 'utf8')
  const sources = JSON.parse(await fs.readFile(SOURCE_FILE, 'utf8'))
  const backendDishes = extractBackendSample(backendSource)
  const backendByName = new Map(backendDishes.map((dish) => [dish.name, dish]))
  const sourceByName = new Map(sources.map((source) => [source.name, source]))
  let frontendDishes
  try {
    frontendDishes = extractFrontendDishes(frontendSource)
  } catch {
    frontendDishes = buildFrontendDishesFromBackend(backendDishes, sourceByName)
  }
  const imagesByCover = new Map()

  for (const dish of frontendDishes) {
    const source = sourceByName.get(dish.name)
    const cachedImage = imageFromExistingSource(source) || (await findDishImage(dish.name))
    if (!source?.thumbnailUrl) await sleep(220)
    const { image, localImage } = await downloadDishImageWithFallback(dish, cachedImage)

    dish.coverImage = localImage.publicPath
    dish.squareImage = localImage.publicPath
    dish.detailImage = localImage.publicPath
    for (const step of dish.steps) step.image = localImage.publicPath

    const backendDish = backendByName.get(dish.name)
    if (backendDish) {
      backendDish.coverImage = localImage.publicPath
      for (const step of backendDish.steps) step.image = localImage.publicPath
    }

    if (source) {
      source.imageSource = image.sourceSite ? `${image.sourceSite} via 360 Image Search` : '360 Image Search result'
      source.imageTitle = image.sourceTitle
      source.imagePage = image.sourcePage
      source.imageUrl = image.sourceImageUrl
      source.thumbnailUrl = image.sourceThumbnailUrl
      source.localImage = localImage.publicPath
      source.imageMatchScore = image.score
    }

    const owners = imagesByCover.get(localImage.publicPath) || []
    owners.push(dish.name)
    imagesByCover.set(localImage.publicPath, owners)
  }

  const duplicatedImages = [...imagesByCover.values()].filter((owners) => owners.length > 1)
  if (duplicatedImages.length) {
    throw new Error(`Duplicate dish images found: ${duplicatedImages.map((owners) => owners.join(' / ')).join('; ')}`)
  }

  await fs.writeFile(FRONTEND_SEED, frontendDishCode(frontendDishes), 'utf8')
  await fs.writeFile(BACKEND_SAMPLE, backendDishCode(backendDishes), 'utf8')
  await fs.writeFile(SOURCE_FILE, `${json(sources)}\n`, 'utf8')
  console.log(`Refreshed ${frontendDishes.length} dishes with ${imagesByCover.size} unique reachable images`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
