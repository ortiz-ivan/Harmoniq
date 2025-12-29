import { IMatchRepository } from "../../domain/repositories/match.repository";
import { Match } from "../../domain/entities/match.entity";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Inicializamos el adapter para SQLite con path absoluto (MISMO patrón que User)
const dbPath = path.resolve("./prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

// Inicializamos Prisma con el adapter
const prisma = new PrismaClient({ adapter });

export class PrismaMatchRepository implements IMatchRepository {
  async create(
    userAId: string,
    userBId: string,
    score: number
  ): Promise<Match> {
    const record = await prisma.match.create({
      data: {
        userAId,
        userBId,
        score,
      },
    });

    return new Match(
      record.id,
      record.userAId,
      record.userBId,
      record.score,
      record.createdAt
    );
  }

  async findBetweenUsers(
    userAId: string,
    userBId: string
  ): Promise<Match | null> {
    const record = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId, userBId },
          { userAId: userBId, userBId: userAId },
        ],
      },
    });

    if (!record) return null;

    return new Match(
      record.id,
      record.userAId,
      record.userBId,
      record.score,
      record.createdAt
    );
  }
}
