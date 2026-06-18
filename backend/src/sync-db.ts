import { PrismaClient } from '@prisma/client'
import { ensureDatabase } from './db-init.js'

const prisma = new PrismaClient()

async function main() {
  await ensureDatabase(prisma)
  console.log('Database schema synchronized with data-preserving updates.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
