import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))

const FALLBACK_IMAGES = {
  meat: '/static/assets/dishes/png/card/hongshaorou_card.png',
  vegetable: '/static/assets/dishes/png/card/shredded_potato_card.png',
  soup: '/static/assets/dishes/png/card/seaweed_egg_soup_card.png',
  staple: '/static/assets/dishes/png/card/tomato_egg_card.png'
}

const USAGE = `Usage:
  node scripts/import-xiaohongshu-note-urls.mjs <urls.txt|urls.json> [--write-seed] [--out output/xiaohongshu-recipes.json]
  echo "https://www.xiaohongshu.com/explore/..." | node scripts/import-xiaohongshu-note-urls.mjs -

Input can be:
  - a text file with one Xiaohongshu note URL per line
  - a JSON array of URLs
  - a JSON array of objects: { "url": "...", "name": "菜名", "category": "meat|vegetable|soup|staple" }

This script does not search or bypass login. It imports public note detail pages that you provide.
`

function parseArgs() {
  const args = process.argv.slice(2)
  if (!args.length || args.includes('--help')) {
    console.log(USAGE)
    process.exit(args.length ? 0 : 1)
  }
  const input = args[0]
  const writeSeed = args.includes('--write-seed')
  const outIndex = args.indexOf('--out')
  const out = outIndex >= 0 ? args[outIndex + 1] : 'output/xiaohongshu-recipes.json'
  return { input, writeSeed, out }
}

async function fetchText(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
          'accept-language': 'zh-CN,zh;q=0.9'
        }
      })
      if (response.ok) return response.text()
      if (attempt === retries) throw new Error(`GET ${url} failed: ${response.status}`)
    } catch (error) {
      if (attempt === retries) throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
  }
  throw new Error(`GET ${url} failed`)
}

async function readInput(file) {
  const content =
    file === '-'
      ? await new Promise((resolve, reject) => {
          let data = ''
          process.stdin.setEncoding('utf8')
          process.stdin.on('data', (chunk) => {
            data += chunk
          })
          process.stdin.on('end', () => resolve(data))
          process.stdin.on('error', reject)
        })
      : await fs.readFile(file, 'utf8')
  if (file.endsWith('.json')) {
    const parsed = JSON.parse(content)
    return parsed.map((item) => (typeof item === 'string' ? { url: item } : item))
  }
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((url) => ({ url }))
}

function extractObjectAt(text, start) {
  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) return text.slice(start, index + 1)
    }
  }
  return ''
}

function htmlAttr(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, 'i'))?.[1] || ''
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function extractNote(html, noteId) {
  const detailIndex = noteId ? html.indexOf(`"noteDetailMap":{"${noteId}"`) : html.indexOf('"noteDetailMap":{')
  const noteIndex = detailIndex >= 0 ? html.indexOf('"note":{', detailIndex) : -1
  if (noteIndex >= 0) {
    const start = html.indexOf('{', noteIndex)
    const objectText = extractObjectAt(html, start)
    if (objectText) return JSON.parse(objectText)
  }

  const title = decodeHtml(htmlAttr(html, 'og:title')).replace(/\s*-\s*小红书$/, '')
  const desc = decodeHtml(htmlAttr(html, 'description') || htmlAttr(html, 'og:description'))
  const images = [...html.matchAll(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/gi)].map((match) => decodeHtml(match[1]))
  if (!title && !desc && !images.length) throw new Error('No note detail found in HTML')
  return { title, desc, imageList: images.map((url) => ({ urlDefault: url })) }
}

function noteIdFromUrl(url) {
  return url.match(/\/explore\/([0-9a-f]{24})/)?.[1] || ''
}

function normalizeImage(url) {
  if (!url) return ''
  return url.replace(/^http:\/\//, 'https://').replace(/\\u002F/g, '/')
}

function stripTopics(text) {
  return text
    .replace(/#.*?(?:\s|$)/g, ' ')
    .replace(/\[[^\]]+R\]/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim()
}

function cleanLine(line) {
  return stripTopics(line)
    .replace(/^[❤️❤✅✔️☑️•*-]+/, '')
    .replace(/^[一二三四五六七八九十]+[、.]/, '')
    .trim()
}

function inferCategory(name, desc) {
  const text = `${name} ${desc}`
  if (/汤|粥|羹/.test(text)) return 'soup'
  if (/饭|面|饺|包|饼|粿|粉|馒头|馍/.test(text)) return 'staple'
  if (/肉|鸡|鸭|鱼|虾|排骨|牛|猪|羊|蛋|翅|腩/.test(text)) return 'meat'
  return 'vegetable'
}

function inferName(title) {
  const compact = stripTopics(title)
    .replace(/[!！?？~～｜|].*$/, '')
    .replace(/(做法|教程|配方|家常|好吃到.*|太香了.*)$/g, '')
    .trim()
  return compact.slice(0, 16) || '小红书菜谱'
}

function groupType(name, index) {
  if (/油|盐|糖|酱|醋|料酒|蚝油|生抽|老抽|胡椒|淀粉|花椒|辣椒粉|孜然|鸡精/.test(name)) return 'seasoning'
  return index < 2 ? 'main' : 'side'
}

function parseIngredients(desc, id) {
  const rows = []
  for (const raw of desc.split(/\r?\n/)) {
    const line = cleanLine(raw)
    const match = line.match(/^([^：:]{1,20})[：:]\s*(.{1,40})$/)
    if (!match) continue
    const name = match[1].replace(/^(主料|配方|材料|调料|内馅|酱汁|辅料)$/, '').trim()
    const amount = match[2].trim()
    if (!name || !amount || /操作|方法|步骤|做法|小贴士/.test(name)) continue
    rows.push({ name, amount })
  }
  const unique = []
  const seen = new Set()
  for (const row of rows) {
    if (seen.has(row.name)) continue
    seen.add(row.name)
    unique.push(row)
  }
  return unique.slice(0, 16).map((row, index) => ({
    id: `${id}-ing-${index + 1}`,
    groupType: groupType(row.name, index),
    name: row.name,
    amount: row.amount,
    sortOrder: index
  }))
}

function parseSteps(desc, id, image) {
  const lines = desc.split(/\r?\n/).map(cleanLine).filter(Boolean)
  const steps = []
  for (const line of lines) {
    const match = line.match(/^(\d{1,2})[.、]\s*(.+)$/)
    if (match) steps.push(match[2])
  }
  if (!steps.length) {
    const start = lines.findIndex((line) => /操作|步骤|做法|方法/.test(line))
    if (start >= 0) {
      for (const line of lines.slice(start + 1)) {
        if (/^#/.test(line)) break
        if (line.length > 6) steps.push(line)
      }
    }
  }
  return steps.slice(0, 12).map((text, index) => ({
    id: `${id}-step-${index + 1}`,
    stepNo: index + 1,
    title: text.split(/[，。；;,.]/)[0].slice(0, 12) || `第 ${index + 1} 步`,
    image,
    description: text.slice(0, 180),
    heat: /腌|切|洗|拌|准备/.test(text) ? '无' : /炖|焖|煮|烤|蒸/.test(text) ? '小火' : '中火',
    minutes: /炖|焖|烤|蒸/.test(text) ? 12 : /煮|炸/.test(text) ? 6 : 4,
    tips: '按笔记步骤观察状态，出锅前按口味微调。'
  }))
}

function dishFromNote(note, input, index) {
  const title = note.title || input.name || '小红书菜谱'
  const desc = note.desc || ''
  const name = input.name || inferName(title)
  const id = `xhs-dish-${String(index + 1).padStart(2, '0')}`
  const category = input.category || inferCategory(name, desc)
  const image = normalizeImage(note.imageList?.[0]?.urlDefault || note.imageList?.[0]?.urlPre || '') || FALLBACK_IMAGES[category]
  const steps = parseSteps(desc, id, image)
  return {
    id,
    name,
    emoji: category === 'soup' ? '🍲' : category === 'staple' ? '🍚' : category === 'vegetable' ? '🥬' : '🍽️',
    category,
    coverImage: image,
    squareImage: image,
    detailImage: image,
    description: stripTopics(desc).split(/\r?\n/).find((line) => line.length > 8)?.slice(0, 120) || title,
    difficulty: steps.length >= 8 ? '中等' : '简单',
    estimatedMinutes: Math.max(10, Math.min(90, steps.reduce((sum, step) => sum + step.minutes, 0))),
    servings: 2,
    tasteTags: ['小红书', '家常菜', category === 'soup' ? '汤类' : category === 'staple' ? '主食' : category === 'vegetable' ? '素菜' : '荤菜'],
    rating: 0,
    ratingCount: 0,
    isFavorite: index < 6,
    ingredients: parseIngredients(desc, id),
    steps,
    tips: ['来源为用户提供的小红书公开笔记。', '按自家锅具火力调整时间。', '出锅前尝味再微调。']
  }
}

function frontendSeed(dishes) {
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

export const seedDishes: Dish[] = ${JSON.stringify(dishes, null, 2)}
`
}

function backendSeed(dishes) {
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
  return `export const sampleDishes = ${JSON.stringify(sample, null, 2)} as const
`
}

async function main() {
  const args = parseArgs()
  const inputs = await readInput(args.input)
  const dishes = []
  const sources = []

  for (let index = 0; index < inputs.length; index += 1) {
    const input = inputs[index]
    const html = await fetchText(input.url)
    const noteId = noteIdFromUrl(input.url)
    const note = extractNote(html, noteId)
    const dish = dishFromNote(note, input, index)
    if (!dish.steps.length) {
      console.warn(`Skipped ${input.url}: no usable steps found`)
      continue
    }
    dishes.push(dish)
    sources.push({
      id: dish.id,
      name: dish.name,
      source: input.url,
      noteId,
      title: note.title || '',
      imageUrl: dish.coverImage
    })
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }

  await fs.mkdir(path.dirname(path.resolve(ROOT, args.out)), { recursive: true })
  await fs.writeFile(path.resolve(ROOT, args.out), `${JSON.stringify({ dishes, sources }, null, 2)}\n`, 'utf8')

  if (args.writeSeed) {
    if (dishes.length < 50) throw new Error(`Refusing to overwrite seed: only ${dishes.length} dishes parsed, need at least 50`)
    await fs.writeFile(path.join(ROOT, 'frontend/src/data/seed.ts'), frontendSeed(dishes), 'utf8')
    await fs.writeFile(path.join(ROOT, 'backend/src/sample-data.ts'), backendSeed(dishes), 'utf8')
  }

  console.log(`Parsed ${dishes.length} Xiaohongshu dishes`)
  console.log(`Wrote ${args.out}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
