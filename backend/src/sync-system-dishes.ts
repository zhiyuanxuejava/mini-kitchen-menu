import { PrismaClient } from '@prisma/client'
import { ensureDatabase } from './db-init.js'
import { syncSystemDishesFromSample } from './system-dishes.js'

const prisma = new PrismaClient()

async function main() {
  await ensureDatabase(prisma)
  const result = await syncSystemDishesFromSample(prisma)
  console.log(
    [
      `System dishes synchronized: ${result.publishedDishCount} published`,
      `${result.archivedDuplicateCount} duplicates archived`,
      `${result.republishedDishCount} canonical dishes republished`,
      `${result.totalSystemDishRows} total system rows`
    ].join(', ')
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
