import axios from "axios";

const SPOTIFY_API = "https://accounts.spotify.com/api/token";

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export class SpotifyAdapter {
    static async getToken(code:string, redirectUri: string, clientId: string, clientSecret: string): Promise<SpotifyTokenResponse> {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);

        const response = await axios.post(SPOTIFY_API, params, {
            headers: {
                Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data;
    }

    static async getUserProfile(accessToken: string) {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    }
}