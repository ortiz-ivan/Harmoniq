import jwt from "jsonwebtoken"

export class TokenGeneratorService {
    static generate(userId: string): string {
        return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    }
}