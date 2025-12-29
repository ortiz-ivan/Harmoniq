import { FastifyInstance } from "fastify";
import { CalculateMatchUseCase } from "../../application/use-cases/calculate-match.usecase";
import { PrismaMatchRepository } from "../repositories/prisma-match.repository";

export async function matchRoutes(app: FastifyInstance) {
  const matchRepository = new PrismaMatchRepository();
  const calculateMatchUseCase = new CalculateMatchUseCase(matchRepository);

  app.post("/calculate", async (req, reply) => {
    const { userAId, userBId, score } = req.body as {
      userAId: string;
      userBId: string;
      score: number;
    };

    const result = await calculateMatchUseCase.execute({
      userAId,
      userBId,
      score,
    });

    return reply.send(result);
  });
}
