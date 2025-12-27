export class User {
    constructor(
        public id: string,
        public spotifyId: string,
        public displayName: string,
        public email: string,
        public accessToken: string,
        public refreshToken: string,
    ) {}
}