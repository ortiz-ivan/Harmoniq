export interface SpotifyLoginInput {
    code: string;
}

export interface SpotifyLoginOutput {
    token: string;
    user: {
        id: string;
        spotifyId: string;
        displayName: string;
        email: string;
    };
}