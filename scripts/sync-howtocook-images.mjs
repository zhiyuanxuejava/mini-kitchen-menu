import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(dirname, '..')
const OUTPUT_DIR = path.join(ROOT, 'output')
const SOURCE_FILE = path.join(OUTPUT_DIR, 'recipe-import-sources.json')
const REPORT_FILE = path.join(OUTPUT_DIR, 'howtocook-image-report.json')
const TREE_CACHE_FILE = path.join(OUTPUT_DIR, 'howtocook-tree-cache.json')
const STATIC_DIR = path.join(ROOT, 'frontend', 'src', 'static', 'assets', 'dishes', 'howtocook')
const PUBLIC_PREFIX = '/static/assets/dishes/howtocook'
const HOWTOCOOK_REPO = 'https://github.com/Anduin2017/HowToCook'
const HOWTOCOOK_RAW = 'https://raw.githubusercontent.com/Anduin2017/HowToCook/master/'
const HOWTOCOOK_MEDIA = 'https://media.githubusercontent.com/media/Anduin2017/HowToCook/master/'
const HOWTOCOOK_TREE = 'https://api.github.com/repos/Anduin2017/HowToCook/git/trees/master?recursive=1'
const PLACEHOLDER_IMAGE = '/static/assets/placeholders/png/dish_cover_placeholder.png.png'
const SOURCE_LICENSE = 'HowToCook / Unlicense public domain dedication'

const prisma = new PrismaClient()

function parseArgs() {
  const args = new Set(process.argv.slice(2))
  return {
    dryRun: args.has('--dry-run'),
    force: args.has('--force')
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(url, options = {}) {
  let lastError
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { 'User-Agent': 'mini-kitchen-menu-image-sync', ...(options.headers || {}) }
      })
      if (response.ok || response.status < 500) return response
      lastError = new Error(`${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error
    }
    await sleep(1000 * attempt)
  }
  throw lastError
}

async function fetchJson(url) {
  const response = await fetchWithRetry(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  return response.json()
}

async function fetchText(url) {
  const response = await fetchWithRetry(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  return response.text()
}

async function fetchBytes(url) {
  const response = await fetchWithRetry(url)
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`)
  return Buffer.from(await response.arrayBuffer())
}

function loadJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function loadHowToCookTree() {
  const cached = loadJson(TREE_CACHE_FILE, null)
  if (cached?.tree?.length) return cached
  const tree = await fetchJson(HOWTOCOOK_TREE)
  writeJson(TREE_CACHE_FILE, tree)
  return tree
}

function dirnamePosix(value) {
  const index = value.lastIndexOf('/')
  return index >= 0 ? value.slice(0, index) : ''
}

function basenamePosix(value) {
  const index = value.lastIndexOf('/')
  return index >= 0 ? value.slice(index + 1) : value
}

function stripExt(value) {
  return value.replace(/\.[^.]+$/, '')
}

function cleanDishName(value) {
  return value.replace(/[^\p{Letter}\p{Number}]/gu, '').toLowerCase()
}

function recipePathFromDish(dish) {
  if (dish.syncKey?.startsWith('howtocook:')) return dish.syncKey.slice('howtocook:'.length)
  const marker = '/blob/master/'
  const sourceUrl = dish.sourceUrl || ''
  const index = sourceUrl.indexOf(marker)
  if (index >= 0) return decodeURIComponent(sourceUrl.slice(index + marker.length))
  return ''
}

function imageExt(imagePath) {
  const ext = path.posix.extname(imagePath).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return ext
  return '.jpg'
}

function localName(recipePath, imagePath) {
  const hash = crypto.createHash('sha1').update(`${recipePath}\n${imagePath}`).digest('hex').slice(0, 16)
  return `${hash}${imageExt(imagePath)}`
}

function isLikelyImage(file) {
  if (!fs.existsSync(file)) return false
  const stat = fs.statSync(file)
  if (stat.size < 64) return false
  const buffer = fs.readFileSync(file)
  const head = buffer.subarray(0, 64)
  if (head.toString('utf8').startsWith('version https://git-lfs.github.com/spec')) return false
  return (
    buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ||
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ||
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' ||
    buffer.subarray(0, 6).toString('ascii') === 'GIF87a' ||
    buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  )
}

function rawTextUrl(repoPath) {
  return `${HOWTOCOOK_RAW}${encodeURI(repoPath).replace(/#/g, '%23')}`
}

function rawMediaUrl(repoPath) {
  return `${HOWTOCOOK_MEDIA}${encodeURI(repoPath).replace(/#/g, '%23')}`
}

function resolveMarkdownImage(markdownPath, imageRef) {
  const trimmed = imageRef.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return ''
  const withoutAnchor = trimmed.split('#')[0].split('?')[0]
  if (!withoutAnchor) return ''
  const recipeDir = dirnamePosix(markdownPath)
  const resolved = path.posix.normalize(path.posix.join(recipeDir, withoutAnchor))
  return resolved.startsWith('dishes/') ? resolved : ''
}

function markdownImageRefs(markdown, recipePath) {
  const refs = new Set()
  for (const match of markdown.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
    const ref = resolveMarkdownImage(recipePath, match[1].replace(/^<|>$/g, ''))
    if (ref) refs.add(ref)
  }
  for (const match of markdown.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const ref = resolveMarkdownImage(recipePath, match[1])
    if (ref) refs.add(ref)
  }
  return [...refs]
}

function imageScore(dishName, imagePath, markdownIndex) {
  const file = basenamePosix(imagePath)
  const base = stripExt(file)
  const normalizedDish = cleanDishName(dishName)
  const normalizedBase = cleanDishName(base)
  let score = 0

  if (markdownIndex >= 0) score += 200 - markdownIndex
  if (normalizedBase === normalizedDish) score += 180
  if (normalizedBase.includes(normalizedDish) || normalizedDish.includes(normalizedBase)) score += 100
  if (/成品|完成|摆盘|装盘|出锅|final|finish|finished|cover|main/i.test(file)) score += 90
  if (/^封面|^菜品|^效果/.test(base)) score += 70
  if (/步骤|过程|材料|食材|准备|切|洗|腌|焯|煮|炒制|调料|酱汁|葱白|改刀/.test(base)) score -= 60
  if (/^\d+$/.test(base)) score -= 80
  if (/\.(jpg|jpeg|png)$/i.test(file)) score += 10
  if (/\.gif$/i.test(file)) score -= 100

  return score
}

function chooseImage(dish, recipePath, markdownRefs, imagesByDir, imageSet) {
  const recipeDir = dirnamePosix(recipePath)
  const markdownCandidates = markdownRefs.filter((ref) => imageSet.has(ref))
  const dirCandidates = (imagesByDir.get(recipeDir) || []).filter((imagePath) => dirnamePosix(imagePath) === recipeDir)
  const allCandidates = [...new Set([...markdownCandidates, ...dirCandidates])]
  if (!allCandidates.length) return null

  return allCandidates
    .map((imagePath) => ({
      imagePath,
      score: imageScore(dish.name, imagePath, markdownCandidates.indexOf(imagePath))
    }))
    .sort((a, b) => b.score - a.score || a.imagePath.localeCompare(b.imagePath, 'zh-Hans-CN'))[0]
}

function chunk(array, size) {
  const chunks = []
  for (let index = 0; index < array.length; index += size) chunks.push(array.slice(index, index + size))
  return chunks
}

async function mapLimit(items, size, handler) {
  const results = []
  for (const part of chunk(items, size)) {
    results.push(...(await Promise.all(part.map(handler))))
  }
  return results
}

function mergeRecipeSource(existingSources, dish, recipePath, selected, publicPath) {
  const recipeSource = `${HOWTOCOOK_REPO}/blob/master/${recipePath}`
  const source = existingSources.get(recipeSource) || {
    id: dish.id,
    name: dish.name,
    recipeSource,
    recipeLicense: SOURCE_LICENSE
  }

  source.name = dish.name
  source.recipeSource = recipeSource
  source.recipeLicense = source.recipeLicense || SOURCE_LICENSE
  source.imageSource = 'HowToCook repository'
  source.imageTitle = basenamePosix(selected.imagePath)
  source.imagePage = `${HOWTOCOOK_REPO}/blob/master/${selected.imagePath}`
  source.imageUrl = rawMediaUrl(selected.imagePath)
  source.thumbnailUrl = source.imageUrl
  source.imageMatchScore = selected.score
  source.localImage = publicPath
  existingSources.set(recipeSource, source)
}

async function main() {
  const options = parseArgs()
  fs.mkdirSync(STATIC_DIR, { recursive: true })

  const tree = await loadHowToCookTree()
  const imagePaths = tree.tree
    .filter((item) => item.type === 'blob' && /^dishes\//.test(item.path) && /\.(png|jpe?g|gif|webp)$/i.test(item.path))
    .map((item) => item.path)
  const imageSet = new Set(imagePaths)
  const imagesByDir = new Map()
  for (const imagePath of imagePaths) {
    const dir = dirnamePosix(imagePath)
    if (!imagesByDir.has(dir)) imagesByDir.set(dir, [])
    imagesByDir.get(dir).push(imagePath)
  }

  const dishes = await prisma.dish.findMany({
    where: { sourceType: 'system_sync' },
    select: {
      id: true,
      name: true,
      coverImage: true,
      sourceUrl: true,
      syncKey: true
    },
    orderBy: { name: 'asc' }
  })

  const sources = loadJson(SOURCE_FILE, [])
  const sourceMap = new Map(sources.filter((item) => item.recipeSource).map((item) => [item.recipeSource, item]))
  const candidates = []
  const noOriginalImage = []
  const errors = []

  await mapLimit(dishes, 8, async (dish) => {
    const recipePath = recipePathFromDish(dish)
    if (!recipePath) {
      errors.push({ name: dish.name, reason: 'missing_recipe_path' })
      return
    }

    try {
      const markdown = await fetchText(rawTextUrl(recipePath))
      const markdownRefs = markdownImageRefs(markdown, recipePath)
      const selected = chooseImage(dish, recipePath, markdownRefs, imagesByDir, imageSet)
      if (!selected) {
        noOriginalImage.push({ name: dish.name, recipePath })
        return
      }

      const fileName = localName(recipePath, selected.imagePath)
      const localFile = path.join(STATIC_DIR, fileName)
      const publicPath = `${PUBLIC_PREFIX}/${fileName}`
      candidates.push({ dish, recipePath, selected, localFile, publicPath })
    } catch (error) {
      errors.push({ name: dish.name, recipePath, reason: error instanceof Error ? error.message : String(error) })
    }
  })

  let downloaded = 0
  let updated = 0
  let alreadyLocal = 0

  for (const item of candidates) {
    const needsDownload = options.force || !isLikelyImage(item.localFile)
    if (!options.dryRun && needsDownload) {
      const bytes = await fetchBytes(rawMediaUrl(item.selected.imagePath))
      fs.writeFileSync(item.localFile, bytes)
      downloaded += 1
    } else if (!needsDownload) {
      alreadyLocal += 1
    }

    mergeRecipeSource(sourceMap, item.dish, item.recipePath, item.selected, item.publicPath)

    if (!options.dryRun && item.dish.coverImage !== item.publicPath) {
      await prisma.$transaction([
        prisma.dish.update({
          where: { id: item.dish.id },
          data: { coverImage: item.publicPath }
        }),
        prisma.dishStep.updateMany({
          where: { dishId: item.dish.id },
          data: { image: item.publicPath }
        })
      ])
      updated += 1
    }
  }

  if (!options.dryRun) {
    const mergedSources = [...sourceMap.values()].sort((a, b) => String(a.recipeSource || '').localeCompare(String(b.recipeSource || '')))
    writeJson(SOURCE_FILE, mergedSources)
  }

  const report = {
    dryRun: options.dryRun,
    totalSystemDishes: dishes.length,
    howToCookImageFiles: imagePaths.length,
    matchedRecipes: candidates.length,
    noOriginalImageCount: noOriginalImage.length,
    downloaded,
    alreadyLocal,
    updated,
    errors,
    noOriginalImage,
    matched: candidates.map((item) => ({
      name: item.dish.name,
      recipePath: item.recipePath,
      imagePath: item.selected.imagePath,
      score: item.selected.score,
      localImage: item.publicPath
    }))
  }

  writeJson(REPORT_FILE, report)
  console.log(JSON.stringify({
    dryRun: report.dryRun,
    totalSystemDishes: report.totalSystemDishes,
    howToCookImageFiles: report.howToCookImageFiles,
    matchedRecipes: report.matchedRecipes,
    noOriginalImageCount: report.noOriginalImageCount,
    downloaded: report.downloaded,
    alreadyLocal: report.alreadyLocal,
    updated: report.updated,
    errors: report.errors.length,
    report: path.relative(ROOT, REPORT_FILE)
  }, null, 2))
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
