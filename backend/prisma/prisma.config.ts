import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import path from 'path';


export default {
  schema: 'schema.prisma',
  datasource: {
    url: `file:${path.resolve('./prisma/dev.db')}`,
  },
} satisfies PrismaConfig;
