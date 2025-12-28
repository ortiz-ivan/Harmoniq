import { IMatchRepository } from "../../domain/repositories/match.repository";
import { Match } from "../../domain/entities/match.entity";

export class PrismaMatchRepository implements IMatchRepository {
    async save(match: Match): Promise<void> {
        //  TODO: implementar persistencia con prisma
        console.log("Saving match:", match);
    }

    async findMatchesForUser(userId: string): Promise<Match[]> {
        // TODO: Implementar query con Prisma
        return [];
    }
}