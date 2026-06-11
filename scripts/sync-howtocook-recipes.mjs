import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BACKEND_ENV = path.join(ROOT, 'backend', '.env')
const REPORT_FILE = path.join(ROOT, 'output', 'howtocook-sync-report.json')
const SOURCE_FILE = path.join(ROOT, 'output', 'recipe-import-sources.json')
const HOWTOCOOK_REPO = 'https://github.com/Anduin2017/HowToCook'
const HOWTOCOOK_RAW = 'https://raw.githubusercontent.com/Anduin2017/HowToCook/master/'
const HOWTOCOOK_TREE = 'https://api.github.com/repos/Anduin2017/HowToCook/git/trees/master?recursive=1'
const PLACEHOLDER_IMAGE = '/static/assets/placeholders/png/dish_cover_placeholder.png.png'
const SOURCE_LICENSE = 'HowToCook / Unlicense public domain dedication'

const CATEGORY_BY_DIR = {
  aquatic: 'aquatic',
  breakfast: 'breakfast',
  condiment: 'condiment',
  dessert: 'dessert',
  drink: 'drink',
  meat_dish: 'meat',
  'semi-finished': 'semi_finished',
  soup: 'soup',
  staple: 'staple',
  vegetable_dish: 'vegetable'
}

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

function parseArgs() {
  const args = process.argv.slice(2)
  const option = {
    dryRun: args.includes('--dry-run') || process.env.npm_config_dry_run === 'true',
    skipBuild: args.includes('--skip-build') || process.env.npm_config_skip_build === 'true',
    limit: Number(process.env.npm_config_limit || 0),
    dirs: new Set(String(process.env.npm_config_dirs || Object.keys(CATEGORY_BY_DIR).join(',')).split(',').map((item) => item.trim()).filter(Boolean))
  }

  for (const arg of args) {
    if (arg.startsWith('--limit=')) option.limit = Number(arg.split('=')[1] || 0)
    if (arg.startsWith('--dirs=')) option.dirs = new Set(arg.split('=')[1].split(',').map((item) => item.trim()).filter(Boolean))
  }

  return option
}

async function loadBackendEnv() {
  try {
    const text = await fs.readFile(BACKEND_ENV, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].trim().replace(/^"|"$/g, '')
    }
  } catch {
    // DATABASE_URL may already be provided by the caller.
  }
}

async function fetchText(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'mini-kitchen-menu howtocook-sync/1.0',
          'accept-language': 'zh-CN,zh;q=0.9'
        },
        signal: controller.signal
      })
      if (response.ok) return response.text()
      if (attempt === retries) throw new Error(`GET ${url} failed: ${response.status}`)
    } catch (error) {
      if (attempt === retries) throw error
    } finally {
      clearTimeout(timeout)
    }
    await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)))
  }
  throw new Error(`GET ${url} failed`)
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url))
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

function section(markdown, heading) {
  const match = markdown.match(new RegExp(`^##\\s+${heading}\\s*$`, 'm'))
  if (!match) return ''
  const start = match.index + match[0].length
  const rest = markdown.slice(start)
  const next = rest.search(/^##\s+/m)
  return (next >= 0 ? rest.slice(0, next) : rest).trim()
}

function dishNameFromPath(recipePath) {
  const filename = recipePath.split('/').pop()?.replace(/\.md$/i, '') || ''
  const parent = recipePath.split('/').at(-2) || ''
  return clean(filename === 'README' || filename === 'index' ? parent : filename)
}

function categoryFromPath(recipePath) {
  const dir = recipePath.split('/')[1]
  return CATEGORY_BY_DIR[dir] || 'other'
}

function emojiFor(category, name) {
  if (category === 'aquatic' || /虾|鱼|蟹|鳝|蚝/.test(name)) return '🦐'
  if (/蛋/.test(name)) return '🍳'
  if (/鸡/.test(name)) return '🍗'
  if (/牛|羊|排骨|肉/.test(name)) return '🥩'
  if (category === 'soup') return '🍲'
  if (category === 'staple' || category === 'breakfast') return '🍚'
  if (category === 'dessert') return '🍮'
  if (category === 'drink') return '🥤'
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

function groupTypeFor(name, index) {
  if (SEASONING_WORDS.some((word) => name.includes(word))) return 'seasoning'
  return index < 2 ? 'main' : 'side'
}

function cleanIngredientName(value) {
  return clean(value)
    .replace(/总量$/, '')
    .replace(/^(所需|需要|准备)/, '')
    .replace(/的?数量$/, '')
    .replace(/(?<=.)量$/, '')
    .replace(/[（(].*$/, '')
    .trim()
}

function cleanAmount(value) {
  return clean(value)
    .replace(/份数\s*\*\s*/g, '每份 ')
    .replace(/\s*\*\s*份数/g, ' / 份')
    .replace(/^份数\s*/g, '')
    .replace(/，.*$/, '')
    .replace(/[（(]调味[）)]?$/, '')
    .trim()
}

function parseIngredients(markdown) {
  const rows = []
  const calc = section(markdown, '计算')

  for (const line of calc.split('\n')) {
    const match = line.match(/^\s*[*-]\s*([^=：:]+)\s*[=：:]\s*(.+)$/)
    if (!match) continue
    const name = cleanIngredientName(match[1])
    const amount = cleanAmount(match[2])
    if (name && amount && !name.includes('总量')) rows.push({ name, amount })
  }

  if (!rows.length) {
    const required = section(markdown, '必备原料和工具')
    for (const line of required.split('\n')) {
      const match = line.match(/^\s*[*-]\s+(.+)$/)
      if (!match) continue
      const name = cleanIngredientName(match[1])
      if (name && !['锅', '碗', '盘', '刀', '砧板', '锅铲', '烤箱'].some((tool) => name.includes(tool))) {
        rows.push({ name, amount: '适量' })
      }
    }
  }

  const unique = []
  const seen = new Set()
  for (const row of rows) {
    if (!row.name || seen.has(row.name)) continue
    seen.add(row.name)
    unique.push(row)
  }

  return unique.slice(0, 24).map((row, index) => ({
    groupType: groupTypeFor(row.name, index),
    name: row.name,
    amount: row.amount || '适量',
    sortOrder: index
  }))
}

function estimateStepMinutes(text) {
  const explicit = text.match(/(\d{1,3})\s*分钟/)?.[1]
  if (explicit) return Math.max(1, Math.min(90, Number(explicit)))
  if (/炖|煲|焖|烤|蒸/.test(text)) return 12
  if (/煮|焯|炸/.test(text)) return 6
  if (/炒|煎|爆香|收汁/.test(text)) return 4
  return 3
}

function estimateHeat(text) {
  if (/洗|切|腌|调|拌|盛|装盘|准备|冷藏|静置/.test(text)) return '无'
  if (/炖|焖|煲|收汁|小火/.test(text)) return '小火'
  if (/爆香|快炒|油热|煎|炸|大火/.test(text)) return '中大火'
  return '中火'
}

function titleForStep(text, index) {
  const normalized = clean(text)
  const phrase = normalized.split(/[，。；;,.]/)[0] || normalized
  const compact = phrase.replace(/^将|^把|^向锅中|^锅中/, '')
  return compact.length > 14 ? compact.slice(0, 14) : compact || `第 ${index + 1} 步`
}

function parseSteps(markdown) {
  const operations = section(markdown, '操作')
  const parsed = []
  let current = null

  for (const rawLine of operations.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    const numbered = line.match(/^(\d+)[.、]\s+(.+)$/)
    if (numbered) {
      if (current) parsed.push(current)
      current = { text: clean(numbered[2]), notes: [] }
      continue
    }
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (current && bullet) current.notes.push(clean(bullet[1]))
  }
  if (current) parsed.push(current)

  const steps = parsed
    .filter((item) => item.text && !/^如果您遵循/.test(item.text))
    .slice(0, 20)
    .map((item, index) => {
      const extra = item.notes.length ? ` 注意：${item.notes.slice(0, 2).join('；')}` : ''
      const description = `${item.text}${extra}`.slice(0, 240)
      return {
        stepNo: index + 1,
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
          stepNo: 1,
          title: '备料制作',
          description: '按菜谱准备食材和调料，完成切配后按常规方法制作。',
          heat: '无',
          minutes: 5,
          tips: '导入源未提供结构化步骤，建议在后台补全。'
        }
      ]
}

function minutesFrom(markdown, steps) {
  const explicit = markdown.match(/(?:约|大约|大概|需|需要|只需|耗时)[^0-9]{0,8}(\d{1,3})\s*分钟/)?.[1]
  if (explicit) return Number(explicit)
  const sum = steps.reduce((total, step) => total + step.minutes, 0)
  return Math.max(5, Math.min(180, sum))
}

function descriptionFrom(markdown, name) {
  const afterTitle = markdown.replace(/^#.*$/m, '').trim()
  const beforeMeta = afterTitle.split(/预估烹饪难度|##\s+必备原料和工具/)[0]
  const paragraph = clean(beforeMeta)
  if (paragraph.length >= 12) return paragraph.slice(0, 160)
  return `${name} 整理自 HowToCook 开源菜谱，包含配料比例和可执行步骤。`
}

function tipsFrom(steps, markdown) {
  const extra = section(markdown, '附加内容')
  const bulletTips = [...extra.matchAll(/^\s*[*-]\s+(.+)$/gm)].map((match) => clean(match[1]))
  const all = [...steps.map((step) => step.tips), ...bulletTips, '出锅前尝味，根据口味微调盐分。']
  return [...new Set(all.filter(Boolean).map((tip) => tip.slice(0, 80)))].slice(0, 4)
}

function tagsFor(category, minutes) {
  const labelByCategory = {
    aquatic: '水产',
    breakfast: '早餐',
    condiment: '调料',
    dessert: '甜品',
    drink: '饮品',
    meat: '荤菜',
    semi_finished: '半成品',
    soup: '汤类',
    staple: '主食',
    vegetable: '素菜',
    other: '其他'
  }
  return ['HowToCook', labelByCategory[category] || '其他', minutes <= 20 ? '快手' : '家常'].filter(Boolean)
}

function readExistingSources() {
  return fs
    .readFile(SOURCE_FILE, 'utf8')
    .then((text) => JSON.parse(text))
    .catch(() => [])
}

async function loadRecipes(option) {
  const tree = await fetchJson(HOWTOCOOK_TREE)
  const existingSources = await readExistingSources()
  const sourceByUrl = new Map(existingSources.map((source) => [source.recipeSource, source]))
  const paths = tree.tree
    .map((item) => item.path)
    .filter((recipePath) => recipePath.startsWith('dishes/') && recipePath.endsWith('.md'))
    .filter((recipePath) => !recipePath.includes('/template/'))
    .filter((recipePath) => option.dirs.has(recipePath.split('/')[1]))
    .slice(0, option.limit > 0 ? option.limit : undefined)

  const recipes = []
  const failures = []

  for (const recipePath of paths) {
    try {
      const markdown = await fetchText(`${HOWTOCOOK_RAW}${encodeURI(recipePath)}`)
      const name = dishNameFromPath(recipePath)
      const category = categoryFromPath(recipePath)
      const steps = parseSteps(markdown)
      const estimatedMinutes = minutesFrom(markdown, steps)
      const sourceUrl = `${HOWTOCOOK_REPO}/blob/master/${recipePath}`
      const existingSource = sourceByUrl.get(sourceUrl)
      const coverImage = existingSource?.localImage || PLACEHOLDER_IMAGE

      recipes.push({
        syncKey: `howtocook:${recipePath}`,
        name,
        emoji: emojiFor(category, name),
        category,
        coverImage,
        description: descriptionFrom(markdown, name),
        difficulty: difficultyFrom(markdown, steps.length),
        estimatedMinutes,
        servings: 2,
        tasteTags: tagsFor(category, estimatedMinutes),
        sourceUrl,
        recipePath,
        ingredients: parseIngredients(markdown),
        steps,
        tips: tipsFrom(steps, markdown)
      })
    } catch (error) {
      failures.push({ recipePath, message: error instanceof Error ? error.message : String(error) })
    }
  }

  return { recipes, failures, totalCandidates: paths.length, treeTruncated: Boolean(tree.truncated) }
}

async function upsertRecipe(prisma, recipe) {
  const base = {
    ownerUserId: null,
    name: recipe.name,
    category: recipe.category,
    coverImage: recipe.coverImage,
    description: recipe.description,
    difficulty: recipe.difficulty,
    estimatedMinutes: recipe.estimatedMinutes,
    servings: recipe.servings,
    tasteTags: JSON.stringify(recipe.tasteTags),
    isFavorite: false,
    sourceType: 'system_sync',
    sourceName: 'HowToCook',
    sourceUrl: recipe.sourceUrl,
    sourceLicense: SOURCE_LICENSE,
    status: 'published'
  }

  const matches = await prisma.dish.findMany({
    where: {
      sourceType: 'system_sync',
      OR: [{ syncKey: recipe.syncKey }, { sourceUrl: recipe.sourceUrl }]
    },
    select: { id: true, syncKey: true },
    orderBy: { createdAt: 'asc' }
  })
  const target = matches.find((match) => match.syncKey === recipe.syncKey) || matches[0]
  const duplicateIds = matches.filter((match) => match.id !== target?.id).map((match) => match.id)

  if (duplicateIds.length) {
    await prisma.dish.deleteMany({ where: { id: { in: duplicateIds } } })
  }

  const ingredients = {
    deleteMany: {},
    create: recipe.ingredients.map((item) => ({
      groupType: item.groupType,
      name: item.name,
      amount: item.amount,
      sortOrder: item.sortOrder
    }))
  }
  const steps = {
    deleteMany: {},
    create: recipe.steps.map((step) => ({
      stepNo: step.stepNo,
      title: step.title,
      description: step.description,
      image: recipe.coverImage,
      heat: step.heat,
      minutes: step.minutes,
      tips: step.tips
    }))
  }

  if (target) {
    await prisma.dish.update({
      where: { id: target.id },
      data: {
        ...base,
        syncKey: recipe.syncKey,
        ingredients,
        steps
      }
    })
    return
  }

  await prisma.dish.create({
    data: {
      ...base,
      syncKey: recipe.syncKey,
      ingredients: {
        create: recipe.ingredients.map((item) => ({
          groupType: item.groupType,
          name: item.name,
          amount: item.amount,
          sortOrder: item.sortOrder
        }))
      },
      steps: {
        create: recipe.steps.map((step) => ({
          stepNo: step.stepNo,
          title: step.title,
          description: step.description,
          image: recipe.coverImage,
          heat: step.heat,
          minutes: step.minutes,
          tips: step.tips
        }))
      }
    }
  })
}

async function main() {
  const option = parseArgs()
  if (!option.skipBuild) {
    console.log('Building backend for current db-init...')
    execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--workspace', 'backend', 'run', 'build'], {
      cwd: ROOT,
      stdio: 'inherit'
    })
  }
  await loadBackendEnv()
  const { PrismaClient } = await import('@prisma/client')
  const { ensureDatabase } = await import('../backend/dist/db-init.js')
  const prisma = new PrismaClient()

  try {
    console.log('Ensuring database schema...')
    await ensureDatabase(prisma)
    console.log('Loading HowToCook recipes...')
    const result = await loadRecipes(option)

    if (!option.dryRun) {
      console.log(`Writing ${result.recipes.length} recipes...`)
      for (const recipe of result.recipes) {
        await upsertRecipe(prisma, recipe)
      }
    }

    const categoryCounts = result.recipes.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1
      return acc
    }, {})
    const suspicious = result.recipes
      .filter((recipe) => recipe.ingredients.length === 0 || recipe.steps.length <= 1 || recipe.coverImage === PLACEHOLDER_IMAGE)
      .map((recipe) => ({
        name: recipe.name,
        recipePath: recipe.recipePath,
        reason: [
          recipe.ingredients.length === 0 ? 'no_ingredients' : '',
          recipe.steps.length <= 1 ? 'weak_steps' : '',
          recipe.coverImage === PLACEHOLDER_IMAGE ? 'placeholder_image' : ''
        ].filter(Boolean)
      }))

    const report = {
      dryRun: option.dryRun,
      totalCandidates: result.totalCandidates,
      synced: option.dryRun ? 0 : result.recipes.length,
      parsed: result.recipes.length,
      failed: result.failures.length,
      treeTruncated: result.treeTruncated,
      categoryCounts,
      suspiciousCount: suspicious.length,
      suspicious: suspicious.slice(0, 100),
      failures: result.failures.slice(0, 100),
      updatedAt: new Date().toISOString()
    }

    await fs.mkdir(path.dirname(REPORT_FILE), { recursive: true })
    await fs.writeFile(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    console.log(JSON.stringify(report, null, 2))
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
