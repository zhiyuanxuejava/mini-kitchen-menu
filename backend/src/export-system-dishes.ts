import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'
import { comparePublicDishPriority, normalizePublicDishName } from './system-dishes.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..')
const outputFile = path.join(rootDir, 'output', 'system-dishes.full.json')

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator <= 0) continue

    const key = line.slice(0, separator).trim()
    if (!key || process.env[key] !== undefined) continue

    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

loadEnvFile(path.join(rootDir, 'backend', '.env'))
loadEnvFile(path.join(rootDir, '.env'))

const prisma = new PrismaClient()

async function main() {
  const dishes = await prisma.dish.findMany({
    where: {
      sourceType: 'system_sync',
      status: 'published'
    },
    orderBy: { createdAt: 'asc' },
    include: {
      ingredients: { orderBy: { sortOrder: 'asc' } },
      steps: { orderBy: { stepNo: 'asc' } }
    }
  })

  const bestDishByName = new Map<string, typeof dishes[number]>()
  for (const dish of dishes) {
    const key = normalizePublicDishName(dish.name)
    const current = bestDishByName.get(key)
    if (!current || comparePublicDishPriority(dish, current) < 0) {
      bestDishByName.set(key, dish)
    }
  }

  const rows = [...bestDishByName.values()].map((dish) => ({
    name: dish.name,
    category: dish.category,
    coverImage: dish.coverImage,
    description: dish.description,
    remark: dish.remark || '',
    difficulty: dish.difficulty,
    estimatedMinutes: dish.estimatedMinutes,
    servings: dish.servings,
    tasteTags: JSON.parse(dish.tasteTags || '[]') as string[],
    sourceType: 'system_sync' as const,
    sourceName: dish.sourceName || 'HowToCook',
    sourceUrl: dish.sourceUrl || undefined,
    sourceLicense: dish.sourceLicense || 'HowToCook / Unlicense public domain dedication',
    syncKey: dish.syncKey || undefined,
    status: dish.status || 'published',
    ingredients: dish.ingredients.map((item) => ({
      groupType: item.groupType,
      name: item.name,
      amount: item.amount,
      sortOrder: item.sortOrder
    })),
    steps: dish.steps.map((step) => ({
      stepNo: step.stepNo,
      title: step.title,
      description: step.description,
      image: step.image || dish.coverImage,
      heat: step.heat,
      minutes: step.minutes,
      tips: step.tips
    }))
  }))

  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2) + '\n', 'utf8')
  console.log(`Exported ${rows.length} system dishes to ${outputFile}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
