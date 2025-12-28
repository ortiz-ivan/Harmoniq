import { IMatchRepository } from "../../domain/repositories/match.repository";
import { Match } from "../../domain/entities/match.entity";
import { MatchScore } from "../../domain/value-objects/match-score.vo";

interface CalculateMatchRequest {
    userAId: string;
    userBId: string;
    score: number;
}

interface CalculateMatchResponse {
    match: Match;
}

export class CalculateMatchUseCase {
    constructor(private matchRepo: IMatchRepository) {}

    async execute(request: CalculateMatchRequest): Promise<CalculateMatchResponse> {
        const scoreVO = new MatchScore(request.score);
        const match = new Match({
            userAId: request.userAId,
            userBId: request.userBId,
            score: scoreVO.getScore(),
        });

        await this.matchRepo.save(match);

        return { match };
    }
}