import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Dish, type PrismaClient } from '@prisma/client'
import { sampleDishes } from './sample-data.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..')
const recipeSourcesFile = path.join(rootDir, 'output', 'recipe-import-sources.json')
const fullSystemDishesFile = path.join(rootDir, 'output', 'system-dishes.full.json')

type RecipeImportSource = {
  name: string
  recipeSource?: string
  recipeLicense?: string
  localImage?: string
}

export type SystemSeedDish = {
  name: string
  category: string
  coverImage: string
  description: string
  remark?: string
  difficulty: string
  estimatedMinutes: number
  servings: number
  tasteTags: string[]
  sourceType?: 'system_sync'
  sourceName?: string
  sourceUrl?: string
  sourceLicense?: string
  syncKey?: string
  status?: string
  ingredients: Array<{
    groupType: string
    name: string
    amount: string
    sortOrder?: number
  }>
  steps: Array<{
    stepNo?: number
    title: string
    description: string
    image?: string
    heat: string
    minutes: number
    tips: string
  }>
}

export type SyncSystemDishesResult = {
  publishedDishCount: number
  archivedDuplicateCount: number
  republishedDishCount: number
  totalSystemDishRows: number
}

type PublicDishPriorityInput = Pick<Dish, 'name' | 'syncKey' | 'sourceUrl' | 'createdAt'>

function readRecipeSources() {
  try {
    return JSON.parse(fs.readFileSync(recipeSourcesFile, 'utf8')) as RecipeImportSource[]
  } catch {
    return []
  }
}

function readFullSystemDishes() {
  try {
    const rows = JSON.parse(fs.readFileSync(fullSystemDishesFile, 'utf8')) as SystemSeedDish[]
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

function syncKeyFromRecipeSource(source: RecipeImportSource | undefined, name: string) {
  const marker = '/blob/master/'
  const recipeSource = source?.recipeSource || ''
  const index = recipeSource.indexOf(marker)
  if (index >= 0) return `howtocook:${decodeURIComponent(recipeSource.slice(index + marker.length))}`
  return `legacy-howtocook:${name}`
}

export function normalizePublicDishName(name: string) {
  return name.trim()
}

function publicDishPriority(dish: PublicDishPriorityInput) {
  const syncKey = dish.syncKey || ''
  const sourceUrl = dish.sourceUrl || ''
  return [
    syncKey.startsWith('legacy-howtocook:') ? 1 : 0,
    sourceUrl ? sourceUrl.length : Number.MAX_SAFE_INTEGER,
    syncKey ? syncKey.length : Number.MAX_SAFE_INTEGER,
    dish.createdAt.getTime()
  ] as const
}

export function comparePublicDishPriority(left: PublicDishPriorityInput, right: PublicDishPriorityInput) {
  const leftPriority = publicDishPriority(left)
  const rightPriority = publicDishPriority(right)
  for (let index = 0; index < leftPriority.length; index += 1) {
    if (leftPriority[index] !== rightPriority[index]) return leftPriority[index] - rightPriority[index]
  }
  return left.name.localeCompare(right.name, 'zh-CN')
}

async function seedSystemDishesFromSample(prisma: PrismaClient) {
  const sourceByName = new Map(readRecipeSources().map((source) => [source.name, source]))
  const fullSystemDishes = readFullSystemDishes()
  const sourceDishes: SystemSeedDish[] = fullSystemDishes.length
    ? fullSystemDishes
    : sampleDishes.map((dish) => ({
        name: dish.name,
        category: dish.category,
        coverImage: dish.coverImage,
        description: dish.description,
        remark: '',
        difficulty: dish.difficulty,
        estimatedMinutes: dish.estimatedMinutes,
        servings: dish.servings,
        tasteTags: [...dish.tasteTags],
        sourceType: 'system_sync',
        sourceName: 'HowToCook',
        sourceUrl: sourceByName.get(dish.name)?.recipeSource,
        sourceLicense: sourceByName.get(dish.name)?.recipeLicense || 'HowToCook / Unlicense public domain dedication',
        syncKey: syncKeyFromRecipeSource(sourceByName.get(dish.name), dish.name),
        status: 'published',
        ingredients: dish.ingredients.map(([groupType, name, amount], index) => ({
          groupType,
          name,
          amount,
          sortOrder: index
        })),
        steps: dish.steps.map((step, index) => ({
          stepNo: index + 1,
          title: step.title,
          description: step.description,
          image: step.image || dish.coverImage,
          heat: step.heat,
          minutes: step.minutes,
          tips: step.tips
        }))
      }))

  for (const dish of sourceDishes) {
    const source = sourceByName.get(dish.name)
    const syncKey = dish.syncKey || syncKeyFromRecipeSource(source, dish.name)
    const data = {
      ownerUserId: null,
      copiedFromDishId: null,
      name: dish.name,
      category: dish.category,
      coverImage: dish.coverImage,
      description: dish.description,
      remark: dish.remark || '',
      difficulty: dish.difficulty,
      estimatedMinutes: dish.estimatedMinutes,
      servings: dish.servings,
      tasteTags: JSON.stringify(dish.tasteTags),
      sourceType: 'system_sync' as const,
      sourceName: dish.sourceName || 'HowToCook',
      sourceUrl: dish.sourceUrl || source?.recipeSource,
      sourceLicense: dish.sourceLicense || source?.recipeLicense || 'HowToCook / Unlicense public domain dedication',
      syncKey,
      status: dish.status || 'published'
    }
    const ingredients = dish.ingredients.map((item, index) => ({
      groupType: item.groupType,
      name: item.name,
      amount: item.amount,
      sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index
    }))
    const steps = dish.steps.map((step, index) => ({
      stepNo: typeof step.stepNo === 'number' ? step.stepNo : index + 1,
      title: step.title,
      description: step.description,
      image: step.image || dish.coverImage,
      heat: step.heat,
      minutes: step.minutes,
      tips: step.tips
    }))

    const existing = await prisma.dish.findFirst({
      where: {
        sourceType: 'system_sync',
        OR: [
          { syncKey },
          { syncKey: null, name: dish.name, category: dish.category }
        ]
      },
      select: { id: true }
    })

    if (!existing) {
      await prisma.dish.create({
        data: {
          ...data,
          ingredients: { create: ingredients },
          steps: { create: steps }
        }
      })
      continue
    }

    await prisma.$transaction([
      prisma.dish.update({
        where: { id: existing.id },
        data
      }),
      prisma.dishIngredient.deleteMany({ where: { dishId: existing.id } }),
      prisma.dishStep.deleteMany({ where: { dishId: existing.id } }),
      prisma.dishIngredient.createMany({
        data: ingredients.map((item) => ({ dishId: existing.id, ...item }))
      }),
      prisma.dishStep.createMany({
        data: steps.map((item) => ({ dishId: existing.id, ...item }))
      })
    ])
  }
}

export async function ensureUniquePublishedSystemDishes(prisma: PrismaClient): Promise<SyncSystemDishesResult> {
  const dishes = await prisma.dish.findMany({
    where: { sourceType: 'system_sync' },
    select: {
      id: true,
      name: true,
      syncKey: true,
      sourceUrl: true,
      createdAt: true,
      status: true
    }
  })

  const canonicalByName = new Map<string, typeof dishes[number]>()
  for (const dish of dishes) {
    const key = normalizePublicDishName(dish.name)
    const current = canonicalByName.get(key)
    if (!current || comparePublicDishPriority(dish, current) < 0) {
      canonicalByName.set(key, dish)
    }
  }

  const canonicalIds = new Set([...canonicalByName.values()].map((dish) => dish.id))
  const publishIds = dishes.filter((dish) => canonicalIds.has(dish.id) && dish.status !== 'published').map((dish) => dish.id)
  const archiveIds = dishes.filter((dish) => !canonicalIds.has(dish.id) && dish.status !== 'archived').map((dish) => dish.id)

  if (publishIds.length) {
    await prisma.dish.updateMany({
      where: { id: { in: publishIds } },
      data: { status: 'published' }
    })
  }
  if (archiveIds.length) {
    await prisma.dish.updateMany({
      where: { id: { in: archiveIds } },
      data: { status: 'archived' }
    })
  }

  return {
    publishedDishCount: canonicalIds.size,
    archivedDuplicateCount: archiveIds.length,
    republishedDishCount: publishIds.length,
    totalSystemDishRows: dishes.length
  }
}

export async function syncSystemDishesFromSample(prisma: PrismaClient) {
  await seedSystemDishesFromSample(prisma)
  return ensureUniquePublishedSystemDishes(prisma)
}
