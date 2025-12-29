import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import path from 'path';

const dbPath = path.resolve('./prisma/dev.db');

export default {
  schema: 'schema.prisma',
  datasource: {
    url: `file:${dbPath}`,
  },
} satisfies PrismaConfig;
