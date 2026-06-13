import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { PrismaClient, type Dish, type User } from '@prisma/client'
import { z } from 'zod'
import { ensureDatabase } from './db-init.js'
import { sampleDishes } from './sample-data.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..')

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
const app = express()
const uploadDir = path.resolve(dirname, '..', 'uploads')
const staticDir = path.join(rootDir, 'frontend', 'src', 'static')
const recipeSourcesFile = path.join(rootDir, 'output', 'recipe-import-sources.json')
const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '0.0.0.0'
const jwtSecret = process.env.JWT_SECRET || 'dev-zhangshao-menu-secret'
const wechatAppId = process.env.WECHAT_APP_ID || ''
const wechatAppSecret = process.env.WECHAT_APP_SECRET || ''
const defaultWechatNickname = '微信用户'
const configuredAdminEmails = new Set(
  String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
)

fs.mkdirSync(uploadDir, { recursive: true })

const upload = multer({ dest: uploadDir })

app.use(cors())
app.use(express.json({ limit: '4mb' }))
app.use('/uploads', express.static(uploadDir))
app.use('/static', express.static(staticDir))

interface AuthedRequest extends Request {
  user?: User
}

type WechatCode2SessionResponse = {
  openid?: string
  unionid?: string
  session_key?: string
  errcode?: number
  errmsg?: string
}

type RecipeImportSource = {
  name: string
  recipeSource?: string
  recipeLicense?: string
  localImage?: string
}

function sign(user: User) {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '30d' })
}

function publicUser(user: User) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

function roleForEmail(email: string) {
  return configuredAdminEmails.has(email.toLowerCase()) ? 'admin' : 'user'
}

async function ensureConfiguredRole(user: User) {
  if (!user.email) return user
  const role = roleForEmail(user.email)
  if (role === user.role) return user
  return prisma.user.update({ where: { id: user.id }, data: { role } })
}

async function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    const payload = jwt.verify(token, jwtSecret) as { sub: string }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin only' })
    return
  }
  next()
}

function readRecipeSources() {
  try {
    return JSON.parse(fs.readFileSync(recipeSourcesFile, 'utf8')) as RecipeImportSource[]
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

async function seedSystemDishesFromSample() {
  const count = await prisma.dish.count({ where: { sourceType: 'system_sync' } })
  if (count > 0) return

  const sourceByName = new Map(readRecipeSources().map((source) => [source.name, source]))

  await Promise.all(
    sampleDishes.map((dish) => {
      const source = sourceByName.get(dish.name)
      return prisma.dish.create({
        data: {
          ownerUserId: null,
          name: dish.name,
          category: dish.category,
          coverImage: dish.coverImage,
          description: dish.description,
          difficulty: dish.difficulty,
          estimatedMinutes: dish.estimatedMinutes,
          servings: dish.servings,
          tasteTags: JSON.stringify(dish.tasteTags),
          sourceType: 'system_sync',
          sourceName: 'HowToCook',
          sourceUrl: source?.recipeSource,
          sourceLicense: source?.recipeLicense || 'HowToCook / Unlicense public domain dedication',
          syncKey: syncKeyFromRecipeSource(source, dish.name),
          status: 'published',
          ingredients: {
            create: dish.ingredients.map(([groupType, name, amount], index) => ({
              groupType,
              name,
              amount,
              sortOrder: index
            }))
          },
          steps: {
            create: dish.steps.map((step, index) => ({
              stepNo: index + 1,
              title: step.title,
              description: step.description,
              image: step.image || dish.coverImage,
              heat: step.heat,
              minutes: step.minutes,
              tips: step.tips
            }))
          }
        }
      })
    })
  )
}

function visibleDishWhere(userId: string) {
  return {
    OR: [
      { sourceType: 'system_sync', status: 'published' },
      { ownerUserId: userId }
    ]
  }
}

function canEditDish(dish: Pick<Dish, 'ownerUserId' | 'sourceType'>, user: User) {
  return user.role === 'admin' || (dish.sourceType === 'user_created' && dish.ownerUserId === user.id)
}

async function findVisibleDish(id: string, userId: string) {
  return prisma.dish.findFirst({
    where: { id, ...visibleDishWhere(userId) },
    include: { categoryRef: true, ingredients: { orderBy: { sortOrder: 'asc' } }, steps: { orderBy: { stepNo: 'asc' } } }
  })
}

async function findMenuItemForUser(itemId: string, userId: string) {
  return prisma.menuItem.findFirst({
    where: { id: itemId, menu: { userId } },
    include: { dish: true, menu: true }
  })
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function param(value: unknown) {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

async function todayMenu(userId: string) {
  return prisma.menu.upsert({
    where: { userId_menuDate: { userId, menuDate: today() } },
    create: { userId, menuDate: today(), servings: 3, status: 'draft' },
    update: {},
    include: { items: { orderBy: { sortOrder: 'asc' }, include: { dish: true } } }
  })
}

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const wechatLoginSchema = z.object({
  code: z.string().trim().min(1)
})

const profileSchema = z.object({
  nickname: z.string().trim().min(1).max(24),
  avatarUrl: z.string().trim().min(1).max(500).optional()
})

async function exchangeWechatCode(code: string) {
  if (!wechatAppId || !wechatAppSecret) {
    throw new Error('未配置微信小程序登录参数')
  }

  const params = new URLSearchParams({
    appid: wechatAppId,
    secret: wechatAppSecret,
    js_code: code,
    grant_type: 'authorization_code'
  })

  const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`微信登录服务异常 ${response.status}`)
  }

  const payload = (await response.json()) as WechatCode2SessionResponse
  if (!payload.openid) {
    throw new Error(payload.errmsg ? `微信登录失败：${payload.errmsg}` : '微信登录失败')
  }

  return payload
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'zhangshao-menu-api' })
})

app.post('/auth/register', async (req, res) => {
  const body = emailSchema.parse(req.body)
  const passwordHash = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({
    data: {
      email: body.email,
      passwordHash,
      nickname: body.email.split('@')[0],
      avatarUrl: '/static/assets/illustrations/png/chef_avatar_256.png',
      role: roleForEmail(body.email)
    }
  })
  res.json({ token: sign(user), user: publicUser(user) })
})

app.post('/auth/login/email', async (req, res) => {
  const body = emailSchema.parse(req.body)
  let user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) {
    const passwordHash = await bcrypt.hash(body.password, 10)
    user = await prisma.user.create({
      data: { email: body.email, passwordHash, nickname: body.email.split('@')[0], role: roleForEmail(body.email) }
    })
  } else if (!user.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) {
    res.status(401).json({ message: '邮箱或密码错误' })
    return
  }
  user = await ensureConfiguredRole(user)
  res.json({ token: sign(user), user: publicUser(user) })
})

app.post('/auth/login/wechat', async (req, res) => {
  const body = wechatLoginSchema.parse(req.body)
  const session = await exchangeWechatCode(body.code)
  const openId = session.openid!
  const user = await prisma.user.upsert({
    where: { wechatOpenId: openId },
    create: { wechatOpenId: openId, nickname: defaultWechatNickname },
    update: {}
  })
  res.json({ token: sign(user), user: publicUser(user) })
})

app.post('/auth/logout', auth, (_req, res) => {
  res.json({ ok: true })
})

app.put('/me/profile', auth, async (req: AuthedRequest, res) => {
  const body = profileSchema.parse(req.body)
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      nickname: body.nickname,
      ...(body.avatarUrl ? { avatarUrl: body.avatarUrl } : {})
    }
  })
  res.json(publicUser(user))
})

app.get('/categories', auth, async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: 'asc' }
  })
  res.json(categories)
})

app.get('/dishes', auth, async (req: AuthedRequest, res) => {
  const source = param(req.query.source)
  const category = param(req.query.category)
  const q = param(req.query.q).trim()
  const filters: object[] = [visibleDishWhere(req.user!.id)]
  if (source === 'system_sync' || source === 'user_created') filters.push({ sourceType: source })
  if (category) filters.push({ category })
  if (q) {
    filters.push({
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { tasteTags: { contains: q } }
      ]
    })
  }

  const dishes = await prisma.dish.findMany({
    where: { AND: filters },
    orderBy: { createdAt: 'desc' },
    include: { categoryRef: true, ingredients: { orderBy: { sortOrder: 'asc' } }, steps: { orderBy: { stepNo: 'asc' } } }
  })
  res.json(dishes)
})

app.post('/dishes', auth, async (req: AuthedRequest, res) => {
  const body = z
    .object({
      name: z.string().min(1),
      category: z.string(),
      coverImage: z.string().default('/static/assets/placeholders/png/dish_cover_placeholder.png.png'),
      description: z.string().default(''),
      difficulty: z.string().default('简单'),
      estimatedMinutes: z.number().int().positive().default(20),
      servings: z.number().int().positive().default(2),
      tasteTags: z.array(z.string()).default([]),
      ingredients: z.array(z.object({ groupType: z.string(), name: z.string(), amount: z.string() })).default([]),
      steps: z.array(z.object({ title: z.string(), description: z.string(), heat: z.string(), minutes: z.number().int(), tips: z.string().default('') })).default([])
    })
    .parse(req.body)

  const dish = await prisma.dish.create({
    data: {
      ownerUserId: req.user!.id,
      name: body.name,
      category: body.category,
      coverImage: body.coverImage,
      description: body.description,
      difficulty: body.difficulty,
      estimatedMinutes: body.estimatedMinutes,
      servings: body.servings,
      tasteTags: JSON.stringify(body.tasteTags),
      sourceType: 'user_created',
      sourceName: '用户录入',
      status: 'published',
      ingredients: {
        create: body.ingredients.map((item, index) => ({ ...item, sortOrder: index }))
      },
      steps: {
        create: body.steps.map((item, index) => ({ ...item, stepNo: index + 1 }))
      }
    },
    include: { ingredients: true, steps: true }
  })
  res.status(201).json(dish)
})

app.get('/dishes/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const dish = await findVisibleDish(id, req.user!.id)
  if (!dish) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }
  res.json(dish)
})

app.put('/dishes/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const existing = await findVisibleDish(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }
  if (!canEditDish(existing, req.user!)) {
    res.status(403).json({ message: '系统同步菜品不可由普通用户编辑' })
    return
  }
  const body = z
    .object({
      name: z.string().min(1).optional(),
      category: z.string().optional(),
      coverImage: z.string().optional(),
      description: z.string().optional(),
      difficulty: z.string().optional(),
      estimatedMinutes: z.number().int().positive().optional(),
      servings: z.number().int().positive().optional(),
      tasteTags: z.array(z.string()).optional(),
      isFavorite: z.boolean().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional()
    })
    .parse(req.body)
  const { tasteTags, ...data } = body
  const dish = await prisma.dish.update({
    where: { id },
    data: { ...data, ...(tasteTags ? { tasteTags: JSON.stringify(tasteTags) } : {}) },
    include: { categoryRef: true, ingredients: { orderBy: { sortOrder: 'asc' } }, steps: { orderBy: { stepNo: 'asc' } } }
  })
  res.json(dish)
})

app.delete('/dishes/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const existing = await findVisibleDish(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }
  if (!canEditDish(existing, req.user!)) {
    res.status(403).json({ message: '系统同步菜品不可由普通用户删除' })
    return
  }
  await prisma.dish.delete({ where: { id } })
  res.json({ ok: true })
})

app.get('/menus/today', auth, async (req: AuthedRequest, res) => {
  res.json(await todayMenu(req.user!.id))
})

app.post('/menus/today/items', auth, async (req: AuthedRequest, res) => {
  const body = z.object({ dishId: z.string(), quantity: z.number().int().positive().default(1), note: z.string().default('') }).parse(req.body)
  const dish = await findVisibleDish(body.dishId, req.user!.id)
  if (!dish) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }
  const menu = await todayMenu(req.user!.id)
  const item = await prisma.menuItem.create({
    data: {
      menuId: menu.id,
      dishId: body.dishId,
      quantity: body.quantity,
      note: body.note,
      sortOrder: menu.items.length + 1
    },
    include: { dish: true }
  })
  res.status(201).json(item)
})

app.put('/menus/today/items/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const existing = await findMenuItemForUser(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  const item = await prisma.menuItem.update({
    where: { id },
    data: req.body,
    include: { dish: true }
  })
  res.json(item)
})

app.delete('/menus/today/items/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const existing = await findMenuItemForUser(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  await prisma.menuItem.delete({ where: { id } })
  res.json({ ok: true })
})

app.post('/menus/today/reorder', auth, async (req: AuthedRequest, res) => {
  const body = z.object({ itemIds: z.array(z.string()) }).parse(req.body)
  const ownedCount = await prisma.menuItem.count({
    where: { id: { in: body.itemIds }, menu: { userId: req.user!.id } }
  })
  if (ownedCount !== body.itemIds.length) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  await prisma.$transaction(body.itemIds.map((id, index) => prisma.menuItem.update({ where: { id }, data: { sortOrder: index + 1 } })))
  res.json({ ok: true })
})

app.post('/menus/today/submit', auth, async (req: AuthedRequest, res) => {
  const menu = await todayMenu(req.user!.id)
  const updated = await prisma.menu.update({ where: { id: menu.id }, data: { status: 'submitted' }, include: { items: true } })
  res.json(updated)
})

app.post('/cook/start', auth, async (req: AuthedRequest, res) => {
  const body = z.object({ menuItemId: z.string() }).parse(req.body)
  const existing = await findMenuItemForUser(body.menuItemId, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  const item = await prisma.menuItem.update({
    where: { id: body.menuItemId },
    data: { cookStatus: 'cooking', currentStep: 1 },
    include: { dish: true }
  })
  res.json(item)
})

app.put('/cook/:id/step', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const body = z.object({ currentStep: z.number().int().positive() }).parse(req.body)
  const existing = await findMenuItemForUser(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  const item = await prisma.menuItem.update({ where: { id }, data: { currentStep: body.currentStep } })
  res.json(item)
})

app.post('/cook/:id/finish', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const existing = await findMenuItemForUser(id, req.user!.id)
  if (!existing) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  const item = await prisma.menuItem.update({ where: { id }, data: { cookStatus: 'done' }, include: { dish: true } })
  res.json(item)
})

app.post('/uploads', auth, upload.array('files', 3), (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) || []
  res.json({
    files: files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      originalName: file.originalname
    }))
  })
})

app.post('/records', auth, async (req: AuthedRequest, res) => {
  const body = z
    .object({
      dishId: z.string(),
      menuItemId: z.string().optional(),
      actualMinutes: z.number().int().positive(),
      photos: z.array(z.string()).default([]),
      tasteFeedback: z.string(),
      note: z.string().default(''),
      includeInHistory: z.boolean().default(true)
    })
    .parse(req.body)

  const dish = await findVisibleDish(body.dishId, req.user!.id)
  if (!dish) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }

  if (body.menuItemId) {
    const item = await findMenuItemForUser(body.menuItemId, req.user!.id)
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' })
      return
    }
  }

  const record = await prisma.cookRecord.create({
    data: {
      userId: req.user!.id,
      dishId: body.dishId,
      menuItemId: body.menuItemId,
      actualMinutes: body.actualMinutes,
      photos: JSON.stringify(body.photos),
      tasteFeedback: body.tasteFeedback,
      note: body.note,
      includeInHistory: body.includeInHistory
    },
    include: { dish: true, rating: true }
  })
  res.status(201).json(record)
})

app.get('/records', auth, async (req: AuthedRequest, res) => {
  const records = await prisma.cookRecord.findMany({
    where: { userId: req.user!.id, includeInHistory: true },
    orderBy: { finishedAt: 'desc' },
    include: { dish: true, rating: true }
  })
  res.json(records)
})

app.get('/records/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const record = await prisma.cookRecord.findFirst({
    where: { id, userId: req.user!.id },
    include: { dish: true, rating: true }
  })
  if (!record) {
    res.status(404).json({ message: 'Record not found' })
    return
  }
  res.json(record)
})

app.post('/cook/:id/record', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const item = await findMenuItemForUser(id, req.user!.id)
  if (!item) {
    res.status(404).json({ message: 'Menu item not found' })
    return
  }
  const body = z
    .object({
      actualMinutes: z.number().int().positive(),
      photos: z.array(z.string()).default([]),
      tasteFeedback: z.string(),
      note: z.string().default(''),
      includeInHistory: z.boolean().default(true)
    })
    .parse(req.body)
  const record = await prisma.cookRecord.create({
    data: {
      userId: req.user!.id,
      dishId: item.dishId,
      menuItemId: item.id,
      actualMinutes: body.actualMinutes,
      photos: JSON.stringify(body.photos),
      tasteFeedback: body.tasteFeedback,
      note: body.note,
      includeInHistory: body.includeInHistory
    }
  })
  res.status(201).json(record)
})

app.post('/records/:id/rating', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const record = await prisma.cookRecord.findFirst({ where: { id, userId: req.user!.id } })
  if (!record) {
    res.status(404).json({ message: 'Record not found' })
    return
  }
  const body = z
    .object({
      tasteScore: z.number(),
      appearanceScore: z.number(),
      similarityScore: z.number(),
      heatScore: z.number(),
      satisfactionScore: z.number(),
      comment: z.string().default('')
    })
    .parse(req.body)
  const overallScore = Number(((body.tasteScore + body.appearanceScore + body.similarityScore + body.heatScore + body.satisfactionScore) / 5).toFixed(1))
  const rating = await prisma.rating.upsert({
    where: { cookRecordId: id },
    create: { cookRecordId: id, ...body, overallScore },
    update: { ...body, overallScore }
  })
  res.status(201).json(rating)
})

app.get('/ratings/me', auth, async (req: AuthedRequest, res) => {
  const ratings = await prisma.rating.findMany({
    where: { record: { userId: req.user!.id } },
    orderBy: { createdAt: 'desc' },
    include: { record: { include: { dish: true } } }
  })
  res.json(ratings)
})

app.get('/me/stats', auth, async (req: AuthedRequest, res) => {
  const [ownDishCount, visibleDishCount, recordCount, ratings] = await Promise.all([
    prisma.dish.count({ where: { ownerUserId: req.user!.id } }),
    prisma.dish.count({ where: visibleDishWhere(req.user!.id) }),
    prisma.cookRecord.count({ where: { userId: req.user!.id } }),
    prisma.rating.findMany({ where: { record: { userId: req.user!.id } }, select: { overallScore: true } })
  ])
  const averageRating = ratings.length ? Number((ratings.reduce((sum, item) => sum + item.overallScore, 0) / ratings.length).toFixed(1)) : 0
  res.json({ dishCount: ownDishCount, visibleDishCount, recordCount, averageRating })
})

app.get('/admin/overview', auth, requireAdmin, async (_req, res) => {
  const [userCount, dishCount, systemDishCount, userDishCount, categoryCount, recordCount] = await Promise.all([
    prisma.user.count(),
    prisma.dish.count(),
    prisma.dish.count({ where: { sourceType: 'system_sync' } }),
    prisma.dish.count({ where: { sourceType: 'user_created' } }),
    prisma.category.count(),
    prisma.cookRecord.count()
  ])

  res.json({ userCount, dishCount, systemDishCount, userDishCount, categoryCount, recordCount })
})

app.get('/admin/users', auth, requireAdmin, async (req, res) => {
  const q = param(req.query.q).trim()
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { nickname: { contains: q } },
            { email: { contains: q } },
            { wechatOpenId: { contains: q } }
          ]
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nickname: true,
      avatarUrl: true,
      email: true,
      wechatOpenId: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { dishes: true, menus: true, cookRecords: true } }
    }
  })
  res.json(users)
})

app.get('/admin/dishes', auth, requireAdmin, async (req, res) => {
  const q = param(req.query.q).trim()
  const source = param(req.query.source)
  const category = param(req.query.category)
  const filters: object[] = []
  if (q) {
    filters.push({
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { sourceUrl: { contains: q } }
      ]
    })
  }
  if (source === 'system_sync' || source === 'user_created') filters.push({ sourceType: source })
  if (category) filters.push({ category })

  const dishes = await prisma.dish.findMany({
    where: filters.length ? { AND: filters } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      categoryRef: true,
      owner: { select: { id: true, nickname: true, email: true } },
      _count: { select: { ingredients: true, steps: true, cookRecords: true } }
    }
  })
  res.json(dishes)
})

app.get('/admin/categories', auth, requireAdmin, async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { dishes: true } } }
  })
  res.json(categories)
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: 'Validation error', issues: error.issues })
    return
  }
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

await ensureDatabase(prisma)
await seedSystemDishesFromSample()

app.listen(port, host, () => {
  console.log(`Zhangshao menu API listening on http://${host}:${port}`)
})
