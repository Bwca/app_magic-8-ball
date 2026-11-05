import { AbstractAnswerProvider } from '../../shared/models/abstract-answer-provider';
import { AnswerProviderType } from '../../shared/models/answer-provider-type';
import { Answer } from '../../shared/models/answer.model';
import { PresetAnswerProvider } from '../preset-answer-provider/preset-answer-provider.class';

export async function makeAnswerProvider(type: AnswerProviderType, answers: Readonly<Answer[]>): Promise<AbstractAnswerProvider> {
  switch (type) {
    case 'PRESET':
      return new PresetAnswerProvider(answers);
    default:
      throw new Error('No answer provider type specified!');
  }
}
