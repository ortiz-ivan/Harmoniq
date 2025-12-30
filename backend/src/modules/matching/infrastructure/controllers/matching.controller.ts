import { FastifyInstance } from "fastify";
import { CalculateMatchUseCase } from "../../application/use-cases/calculate-match.usecase";
import { PrismaMatchRepository } from "../repositories/prisma-match.repository";
import { PrismaUserRepository } from "../../../auth/infrastructure/repositories/prisma-user.repository";

export async function matchRoutes(app: FastifyInstance) {
  const matchRepository = new PrismaMatchRepository();
  const userRepository = new PrismaUserRepository();
  const calculateMatchUseCase = new CalculateMatchUseCase(matchRepository, userRepository);

  app.post("/calculate", async (req, reply) => {
    try {
      const { userAId, userBId, score } = req.body as {
        userAId: string;
        userBId: string;
        score: number;
      };

      // Validar que los IDs de usuario fueron proporcionados
      if (!userAId || !userBId) {
        return reply.status(400).send({ error: "Faltan IDs de usuario" });
      }

      // Ejecutar use-case
      const result = await calculateMatchUseCase.execute({
        userAId,
        userBId,
        score,
      });

      return reply.send(result);

    } catch (err: any) {
      // Manejo de errores específicos de Prisma
      if (err.code === "P2003") {
        return reply.status(400).send({
          error: "No se puede crear el match: uno de los usuarios no existe",
        });
      }

      // Errores generales
      return reply.status(500).send({ error: err.message });
    }
  });
}
