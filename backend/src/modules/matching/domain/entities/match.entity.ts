export interface MatchProps {
    userAId: string;
    userBId: string;
    score: number;
}

export class Match {
    public readonly userAId: string;
    public readonly userBId: string;
    public readonly score: number;

    constructor(props: MatchProps) {
        this.userAId = props.userAId;
        this.userBId = props.userBId;
        this.score = props.score;
    }
}