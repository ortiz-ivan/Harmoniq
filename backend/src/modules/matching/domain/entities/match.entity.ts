export interface MatchProps {
  id: string;
  userAId: string;
  userBId: string;
  score: number;
  createdAt: Date;
}

export class Match {
  public readonly id: string;
  public readonly userAId: string;
  public readonly userBId: string;
  public readonly score: number;
  public readonly createdAt: Date;

  constructor(props: MatchProps) {
    this.id = props.id;
    this.userAId = props.userAId;
    this.userBId = props.userBId;
    this.score = props.score;
    this.createdAt = props.createdAt;
  }
}
