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
  constructor(private readonly matchRepo: IMatchRepository) {}

  async execute(request: CalculateMatchRequest): Promise<CalculateMatchResponse> {
    // 1. Evitar duplicados
    const existing = await this.matchRepo.findBetweenUsers(
      request.userAId,
      request.userBId
    );

    if (existing) {
      return { match: existing };
    }

    // 2. Validar score con Value Object
    const scoreVO = new MatchScore(request.score);

    // 3. Crear y persistir (Prisma genera id y createdAt)
    const match = await this.matchRepo.create(
      request.userAId,
      request.userBId,
      scoreVO.getScore()
    );

    return { match };
  }
}
