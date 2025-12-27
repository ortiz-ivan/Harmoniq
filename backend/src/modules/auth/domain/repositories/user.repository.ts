import { User } from "../entities/user.entity";

export interface IUserRepository {
    findBySpotifyId(spotifyId: string): Promise<User | null>;
    create(user: User): Promise<User>;
    updateTokens(userId: string, accessToken: string, refreshToken: string): Promise<void>;
}