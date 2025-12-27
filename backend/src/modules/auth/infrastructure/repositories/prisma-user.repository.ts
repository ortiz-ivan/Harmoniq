import { IUserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// Inicializamos el adapter para SQLite con path absoluto
const dbPath = path.resolve('./prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

// Inicializamos Prisma con el adapter
const prisma = new PrismaClient({ adapter });

export class PrismaUserRepository implements IUserRepository {
  async findBySpotifyId(spotifyId: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { spotifyId } });
    if (!record) return null;
    return new User(
      record.id,
      record.spotifyId,
      record.displayName,
      record.email,
      record.accessToken,
      record.refreshToken
    );
  }

  async create(user: User): Promise<User> {
    const record = await prisma.user.create({
      data: {
        spotifyId: user.spotifyId,
        displayName: user.displayName,
        email: user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
    return new User(
      record.id,
      record.spotifyId,
      record.displayName,
      record.email,
      record.accessToken,
      record.refreshToken
    );
  }

  async updateTokens(userId: string, accessToken: string, refreshToken: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { accessToken, refreshToken },
    });
  }
}
