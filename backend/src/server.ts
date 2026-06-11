import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { PrismaClient, type User } from '@prisma/client'
import { z } from 'zod'
import { ensureDatabase } from './db-init.js'
import { sampleDishes } from './sample-data.js'

const prisma = new PrismaClient()
const app = express()
const dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(dirname, '..', 'uploads')
const port = Number(process.env.PORT || 3001)
const jwtSecret = process.env.JWT_SECRET || 'dev-zhangshao-menu-secret'

fs.mkdirSync(uploadDir, { recursive: true })

const upload = multer({ dest: uploadDir })

app.use(cors())
app.use(express.json({ limit: '4mb' }))
app.use('/uploads', express.static(uploadDir))

interface AuthedRequest extends Request {
  user?: User
}

function sign(user: User) {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '30d' })
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

async function seedUserDishes(userId: string) {
  const count = await prisma.dish.count({ where: { userId } })
  if (count > 0) return

  await Promise.all(
    sampleDishes.map((dish) =>
      prisma.dish.create({
        data: {
          userId,
          name: dish.name,
          category: dish.category,
          coverImage: dish.coverImage,
          description: dish.description,
          difficulty: dish.difficulty,
          estimatedMinutes: dish.estimatedMinutes,
          servings: dish.servings,
          tasteTags: JSON.stringify(dish.tasteTags),
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
    )
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || ''
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
      avatarUrl: '/static/assets/illustrations/png/chef_avatar_256.png'
    }
  })
  await seedUserDishes(user.id)
  res.json({ token: sign(user), user })
})

app.post('/auth/login/email', async (req, res) => {
  const body = emailSchema.parse(req.body)
  let user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) {
    const passwordHash = await bcrypt.hash(body.password, 10)
    user = await prisma.user.create({
      data: { email: body.email, passwordHash, nickname: body.email.split('@')[0] }
    })
    await seedUserDishes(user.id)
  } else if (!user.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) {
    res.status(401).json({ message: '邮箱或密码错误' })
    return
  }
  res.json({ token: sign(user), user })
})

app.post('/auth/login/wechat', async (req, res) => {
  const openId = String(req.body.openId || 'wechat-demo-openid')
  const user = await prisma.user.upsert({
    where: { wechatOpenId: openId },
    create: { wechatOpenId: openId, nickname: '小厨房', avatarUrl: '/static/assets/illustrations/png/chef_avatar_256.png' },
    update: {}
  })
  await seedUserDishes(user.id)
  res.json({ token: sign(user), user })
})

app.post('/auth/logout', auth, (_req, res) => {
  res.json({ ok: true })
})

app.get('/dishes', auth, async (req: AuthedRequest, res) => {
  const dishes = await prisma.dish.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: { ingredients: { orderBy: { sortOrder: 'asc' } }, steps: { orderBy: { stepNo: 'asc' } } }
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
      userId: req.user!.id,
      name: body.name,
      category: body.category,
      coverImage: body.coverImage,
      description: body.description,
      difficulty: body.difficulty,
      estimatedMinutes: body.estimatedMinutes,
      servings: body.servings,
      tasteTags: JSON.stringify(body.tasteTags),
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
  const dish = await prisma.dish.findFirst({
    where: { id, userId: req.user!.id },
    include: { ingredients: { orderBy: { sortOrder: 'asc' } }, steps: { orderBy: { stepNo: 'asc' } } }
  })
  if (!dish) {
    res.status(404).json({ message: 'Dish not found' })
    return
  }
  res.json(dish)
})

app.put('/dishes/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  const dish = await prisma.dish.update({
    where: { id, userId: req.user!.id },
    data: req.body
  })
  res.json(dish)
})

app.delete('/dishes/:id', auth, async (req: AuthedRequest, res) => {
  const id = param(req.params.id)
  await prisma.dish.delete({ where: { id, userId: req.user!.id } })
  res.json({ ok: true })
})

app.get('/menus/today', auth, async (req: AuthedRequest, res) => {
  res.json(await todayMenu(req.user!.id))
})

app.post('/menus/today/items', auth, async (req: AuthedRequest, res) => {
  const body = z.object({ dishId: z.string(), quantity: z.number().int().positive().default(1), note: z.string().default('') }).parse(req.body)
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

app.put('/menus/today/items/:id', auth, async (req, res) => {
  const id = param(req.params.id)
  const item = await prisma.menuItem.update({
    where: { id },
    data: req.body,
    include: { dish: true }
  })
  res.json(item)
})

app.delete('/menus/today/items/:id', auth, async (req, res) => {
  const id = param(req.params.id)
  await prisma.menuItem.delete({ where: { id } })
  res.json({ ok: true })
})

app.post('/menus/today/reorder', auth, async (req, res) => {
  const body = z.object({ itemIds: z.array(z.string()) }).parse(req.body)
  await prisma.$transaction(body.itemIds.map((id, index) => prisma.menuItem.update({ where: { id }, data: { sortOrder: index + 1 } })))
  res.json({ ok: true })
})

app.post('/menus/today/submit', auth, async (req: AuthedRequest, res) => {
  const menu = await todayMenu(req.user!.id)
  const updated = await prisma.menu.update({ where: { id: menu.id }, data: { status: 'submitted' }, include: { items: true } })
  res.json(updated)
})

app.post('/cook/start', auth, async (req, res) => {
  const body = z.object({ menuItemId: z.string() }).parse(req.body)
  const item = await prisma.menuItem.update({
    where: { id: body.menuItemId },
    data: { cookStatus: 'cooking', currentStep: 1 },
    include: { dish: true }
  })
  res.json(item)
})

app.put('/cook/:id/step', auth, async (req, res) => {
  const id = param(req.params.id)
  const body = z.object({ currentStep: z.number().int().positive() }).parse(req.body)
  const item = await prisma.menuItem.update({ where: { id }, data: { currentStep: body.currentStep } })
  res.json(item)
})

app.post('/cook/:id/finish', auth, async (req, res) => {
  const id = param(req.params.id)
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
  const item = await prisma.menuItem.findUnique({ where: { id } })
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

app.post('/records/:id/rating', auth, async (req, res) => {
  const id = param(req.params.id)
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
  const [dishCount, recordCount, ratings] = await Promise.all([
    prisma.dish.count({ where: { userId: req.user!.id } }),
    prisma.cookRecord.count({ where: { userId: req.user!.id } }),
    prisma.rating.findMany({ where: { record: { userId: req.user!.id } }, select: { overallScore: true } })
  ])
  const averageRating = ratings.length ? Number((ratings.reduce((sum, item) => sum + item.overallScore, 0) / ratings.length).toFixed(1)) : 0
  res.json({ dishCount, recordCount, averageRating })
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

app.listen(port, () => {
  console.log(`Zhangshao menu API listening on http://localhost:${port}`)
})
