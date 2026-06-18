import type { PrismaClient } from '@prisma/client'

type ColumnInfo = {
  name: string
  notnull: number
}

const categorySeeds = [
  ['meat', '荤菜', 10],
  ['vegetable', '素菜', 20],
  ['soup', '汤类', 30],
  ['staple', '主食', 40],
  ['aquatic', '水产', 50],
  ['breakfast', '早餐', 60],
  ['dessert', '甜品', 70],
  ['drink', '饮品', 80],
  ['condiment', '调料', 90],
  ['semi_finished', '半成品', 100],
  ['other', '其他', 999]
] as const

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "email" TEXT,
    "passwordHash" TEXT,
    "wechatOpenId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_wechatOpenId_key" ON "User"("wechatOpenId")`,
  `CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Category_code_key" ON "Category"("code")`,
  `CREATE TABLE IF NOT EXISTS "Dish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "copiedFromDishId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "tasteTags" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "sourceType" TEXT NOT NULL DEFAULT 'user_created',
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "sourceLicense" TEXT,
    "syncKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dish_copiedFromDishId_fkey" FOREIGN KEY ("copiedFromDishId") REFERENCES "Dish" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Dish_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "DishIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dishId" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "DishIngredient_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "DishStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dishId" TEXT NOT NULL,
    "stepNo" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "heat" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "tips" TEXT NOT NULL,
    CONSTRAINT "DishStep_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "menuDate" TEXT NOT NULL,
    "servings" INTEGER NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Menu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Menu_userId_menuDate_key" ON "Menu"("userId", "menuDate")`,
  `CREATE TABLE IF NOT EXISTS "MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL,
    "cookStatus" TEXT NOT NULL DEFAULT 'pending',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "CookRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "menuItemId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualMinutes" INTEGER NOT NULL,
    "photos" TEXT NOT NULL,
    "tasteFeedback" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "includeInHistory" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CookRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CookRecord_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CookRecord_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cookRecordId" TEXT NOT NULL,
    "tasteScore" REAL NOT NULL,
    "appearanceScore" REAL NOT NULL,
    "similarityScore" REAL NOT NULL,
    "heatScore" REAL NOT NULL,
    "satisfactionScore" REAL NOT NULL,
    "overallScore" REAL NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_cookRecordId_fkey" FOREIGN KEY ("cookRecordId") REFERENCES "CookRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Rating_cookRecordId_key" ON "Rating"("cookRecordId")`,
  `CREATE TABLE IF NOT EXISTS "LearnedDish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "learnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearnedDish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnedDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LearnedDish_userId_dishId_key" ON "LearnedDish"("userId", "dishId")`,
  `CREATE INDEX IF NOT EXISTS "LearnedDish_userId_learnedAt_idx" ON "LearnedDish"("userId", "learnedAt")`,
  `CREATE INDEX IF NOT EXISTS "LearnedDish_dishId_idx" ON "LearnedDish"("dishId")`,
  `CREATE TABLE IF NOT EXISTS "FavoriteDish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "favoritedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FavoriteDish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FavoriteDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FavoriteDish_userId_dishId_key" ON "FavoriteDish"("userId", "dishId")`,
  `CREATE INDEX IF NOT EXISTS "FavoriteDish_userId_favoritedAt_idx" ON "FavoriteDish"("userId", "favoritedAt")`,
  `CREATE INDEX IF NOT EXISTS "FavoriteDish_dishId_idx" ON "FavoriteDish"("dishId")`
]

async function tableInfo(prisma: PrismaClient, table: string) {
  return prisma.$queryRawUnsafe<ColumnInfo[]>(`PRAGMA table_info("${table}")`)
}

function hasColumn(columns: ColumnInfo[], name: string) {
  return columns.some((column) => column.name === name)
}

async function ensureUserColumns(prisma: PrismaClient) {
  const columns = await tableInfo(prisma, 'User')
  if (!hasColumn(columns, 'role')) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user'`)
  }
}

async function seedCategories(prisma: PrismaClient) {
  for (const [code, name, sortOrder] of categorySeeds) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Category" ("id", "code", "name", "sortOrder", "enabled")
       VALUES (?, ?, ?, ?, true)
       ON CONFLICT("code") DO UPDATE SET
         "name" = excluded."name",
         "sortOrder" = excluded."sortOrder",
         "enabled" = excluded."enabled"`,
      `cat-${code}`,
      code,
      name,
      sortOrder
    )
  }
}

function selectColumn(columns: ColumnInfo[], name: string, fallback: string) {
  return hasColumn(columns, name) ? `"${name}"` : fallback
}

async function rebuildDishTableIfNeeded(prisma: PrismaClient) {
  const columns = await tableInfo(prisma, 'Dish')
  const userId = columns.find((column) => column.name === 'userId')
  const requiredColumns = ['sourceType', 'sourceName', 'sourceUrl', 'sourceLicense', 'syncKey', 'status', 'remark', 'copiedFromDishId']
  const needsRebuild = Boolean(userId?.notnull) || requiredColumns.some((name) => !hasColumn(columns, name))

  if (!needsRebuild) return

  const sourceTypeFallback = hasColumn(columns, 'userId') ? `CASE WHEN "userId" IS NULL THEN 'system_sync' ELSE 'user_created' END` : `'user_created'`

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF')
  try {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Dish_next"')
    await prisma.$executeRawUnsafe(`CREATE TABLE "Dish_next" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT,
      "copiedFromDishId" TEXT,
      "name" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "coverImage" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "remark" TEXT NOT NULL DEFAULT '',
      "difficulty" TEXT NOT NULL,
      "estimatedMinutes" INTEGER NOT NULL,
      "servings" INTEGER NOT NULL,
      "tasteTags" TEXT NOT NULL,
      "isFavorite" BOOLEAN NOT NULL DEFAULT false,
      "sourceType" TEXT NOT NULL DEFAULT 'user_created',
      "sourceName" TEXT,
      "sourceUrl" TEXT,
      "sourceLicense" TEXT,
      "syncKey" TEXT,
      "status" TEXT NOT NULL DEFAULT 'published',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "Dish_copiedFromDishId_fkey" FOREIGN KEY ("copiedFromDishId") REFERENCES "Dish" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "Dish_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
    )`)
    await prisma.$executeRawUnsafe(`INSERT INTO "Dish_next" (
      "id", "userId", "copiedFromDishId", "name", "category", "coverImage", "description", "remark", "difficulty",
      "estimatedMinutes", "servings", "tasteTags", "isFavorite", "sourceType", "sourceName",
      "sourceUrl", "sourceLicense", "syncKey", "status", "createdAt", "updatedAt"
    )
    SELECT
      ${selectColumn(columns, 'id', `lower(hex(randomblob(12)))`)},
      ${selectColumn(columns, 'userId', 'NULL')},
      ${selectColumn(columns, 'copiedFromDishId', 'NULL')},
      ${selectColumn(columns, 'name', `'未命名菜品'`)},
      CASE WHEN ${selectColumn(columns, 'category', `'other'`)} IN (SELECT "code" FROM "Category") THEN ${selectColumn(columns, 'category', `'other'`)} ELSE 'other' END,
      ${selectColumn(columns, 'coverImage', `'/static/assets/placeholders/png/dish_cover_placeholder.png.png'`)},
      ${selectColumn(columns, 'description', `''`)},
      ${selectColumn(columns, 'remark', `''`)},
      ${selectColumn(columns, 'difficulty', `'简单'`)},
      ${selectColumn(columns, 'estimatedMinutes', '20')},
      ${selectColumn(columns, 'servings', '2')},
      ${selectColumn(columns, 'tasteTags', `'[]'`)},
      ${selectColumn(columns, 'isFavorite', 'false')},
      ${selectColumn(columns, 'sourceType', sourceTypeFallback)},
      ${selectColumn(columns, 'sourceName', 'NULL')},
      ${selectColumn(columns, 'sourceUrl', 'NULL')},
      ${selectColumn(columns, 'sourceLicense', 'NULL')},
      ${selectColumn(columns, 'syncKey', 'NULL')},
      ${selectColumn(columns, 'status', `'published'`)},
      ${selectColumn(columns, 'createdAt', 'CURRENT_TIMESTAMP')},
      ${selectColumn(columns, 'updatedAt', 'CURRENT_TIMESTAMP')}
    FROM "Dish"`)
    await prisma.$executeRawUnsafe('DROP TABLE "Dish"')
    await prisma.$executeRawUnsafe('ALTER TABLE "Dish_next" RENAME TO "Dish"')
  } finally {
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
  }
}

async function ensureIndexes(prisma: PrismaClient) {
  const indexStatements = [
    `CREATE INDEX IF NOT EXISTS "Dish_userId_idx" ON "Dish"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Dish_copiedFromDishId_idx" ON "Dish"("copiedFromDishId")`,
    `CREATE INDEX IF NOT EXISTS "Dish_sourceType_idx" ON "Dish"("sourceType")`,
    `CREATE INDEX IF NOT EXISTS "Dish_category_idx" ON "Dish"("category")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Dish_syncKey_key" ON "Dish"("syncKey") WHERE "syncKey" IS NOT NULL`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Dish_userId_copiedFromDishId_unique" ON "Dish"("userId", "copiedFromDishId") WHERE "userId" IS NOT NULL AND "copiedFromDishId" IS NOT NULL`
  ]

  for (const statement of indexStatements) {
    await prisma.$executeRawUnsafe(statement)
  }
}

async function backfillCopiedFromDishId(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(`
    UPDATE "Dish" AS target
    SET "copiedFromDishId" = (
      SELECT source."id"
      FROM "Dish" AS source
      WHERE source."sourceType" = 'system_sync'
        AND source."sourceUrl" IS NOT NULL
        AND source."sourceUrl" = target."sourceUrl"
      LIMIT 1
    )
    WHERE target."sourceType" = 'user_created'
      AND target."sourceName" = '复制自公共菜品'
      AND target."copiedFromDishId" IS NULL
      AND target."sourceUrl" IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM "Dish" AS source
        WHERE source."sourceType" = 'system_sync'
          AND source."sourceUrl" IS NOT NULL
          AND source."sourceUrl" = target."sourceUrl"
      )
  `)

  await prisma.$executeRawUnsafe(`
    UPDATE "Dish" AS target
    SET "copiedFromDishId" = (
      SELECT source."id"
      FROM "Dish" AS source
      WHERE source."sourceType" = 'system_sync'
        AND source."name" = target."name"
        AND source."category" = target."category"
      LIMIT 1
    )
    WHERE target."sourceType" = 'user_created'
      AND target."sourceName" = '复制自公共菜品'
      AND target."copiedFromDishId" IS NULL
      AND (
        SELECT COUNT(1)
        FROM "Dish" AS source
        WHERE source."sourceType" = 'system_sync'
          AND source."name" = target."name"
          AND source."category" = target."category"
      ) = 1
  `)
}

export async function ensureDatabase(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }
  await ensureUserColumns(prisma)
  await seedCategories(prisma)
  await rebuildDishTableIfNeeded(prisma)
  await backfillCopiedFromDishId(prisma)
  await ensureIndexes(prisma)
}
