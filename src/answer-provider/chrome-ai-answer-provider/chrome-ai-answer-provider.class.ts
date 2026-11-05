import { DEFAULT_ANSWERS } from '../../configuration/default-answers.const';
import { insertAnswerLineBreaks } from '../../configuration/insert-answer-line-breaks';
import { AnswerTypes } from '../../shared/enums/answer-types.enum';
import { AbstractAnswerProvider } from '../../shared/models/abstract-answer-provider';
import { Answer } from '../../shared/models/answer.model';
import { getRandomItem } from '../../shared/utils/get-random-item.function';
import { AiAnswerGenerator, createAiAnswerGenerator } from './create-ai-answer-generator.function';
import { getMaxAnswerLength } from './get-max-answer-length.function';
import { getPlainAnswerText } from './get-plain-answer-text.function';

/** Shown when Chrome AI fails to produce an acceptable answer: the "try again later" style presets. */
export const AI_FAILURE_ANSWERS: Readonly<Answer[]> = DEFAULT_ANSWERS.filter(({ type }) => type === AnswerTypes.NonCommittal);

/**
 * Generates answers with Chrome's built-in AI. The tone of each answer is taken from a randomly picked
 * configured answer, and an answer may not be longer than the longest configured one.
 */
export class ChromeAiAnswerProvider implements AbstractAnswerProvider {
  private readonly maxLength: number;

  constructor(
    private readonly answers: Readonly<Answer[]>,
    private readonly generateAiAnswer: AiAnswerGenerator = createAiAnswerGenerator()
  ) {
    this.maxLength = getMaxAnswerLength(answers);
  }

  public async getAnswer(): Promise<Answer> {
    const { type } = getRandomItem(this.answers);
    const examples = this.answers.filter((answer) => answer.type === type).map(({ text }) => getPlainAnswerText(text));

    const aiText = await this.generateAiAnswer({ tone: type, maxLength: this.maxLength, examples });

    return aiText ? insertAnswerLineBreaks({ type, text: aiText }) : getRandomItem(AI_FAILURE_ANSWERS);
  }
}
