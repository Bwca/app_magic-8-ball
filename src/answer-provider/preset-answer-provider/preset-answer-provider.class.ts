import { AbstractAnswerProvider } from '../../shared/models/abstract-answer-provider';
import { Answer } from '../../shared/models/answer.model';
import { getRandomItem } from '../../shared/utils/get-random-item.function';

export class PresetAnswerProvider implements AbstractAnswerProvider {
  constructor(private readonly answers: Readonly<Answer[]>) {}

  public async getAnswer(): Promise<Answer> {
    return getRandomItem(this.answers);
  }
}
