export class MatchScore {
    private readonly value: number;

    constructor(value: number) {
        if (value < 0 || value > 100) {
            throw new Error("Match score must be between 0 and 100");
        }
        this.value = value
    }

    getScore(): number {
        return this.value;
    }
}