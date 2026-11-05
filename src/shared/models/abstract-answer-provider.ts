import { Answer } from './answer.model';

export abstract class AbstractAnswerProvider {
  public abstract getAnswer(): Promise<Answer>;
}
