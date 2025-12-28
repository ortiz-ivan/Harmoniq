import { Match } from "../entities/match.entity";

export interface IMatchRepository {
    save(match: Match): Promise<void>;
    findMatchesForUser(userId: string): Promise<Match[]>;
}