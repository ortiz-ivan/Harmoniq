import { Match } from "../entities/match.entity";

export interface IMatchRepository {
    create(
        userAId: string,
        userBId: string,
        score: number,
    ): Promise<Match>;

    findBetweenUsers(
        userAId: string,
        userBId: string
    ): Promise<Match | null>;
}