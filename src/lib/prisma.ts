// db.ts
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


function getPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Enlazar el pool con el Driver Adapter de Prisma v7
  const adapter = new PrismaPg(pool);

  // 3. Pasar el adaptador al inicializar PrismaClient
  return new PrismaClient({ adapter });
}

declare global {
  var prisma: ReturnType<typeof getPrismaClient> | undefined;
}

const prisma = global.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;