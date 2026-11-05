import { expect, Test, TestSuite } from 'testyts';

import { DEFAULT_ANSWERS } from '../../configuration/default-answers.const';
import { AnswerTypes } from '../../shared/enums/answer-types.enum';
import { AI_FAILURE_ANSWERS, ChromeAiAnswerProvider } from './chrome-ai-answer-provider.class';
import { AiAnswerRequest } from './create-ai-answer-generator.function';

const NEGATIVE_ANSWERS = DEFAULT_ANSWERS.filter(({ type }) => type === AnswerTypes.Negative);

@TestSuite()
export class ChromeAiAnswerProviderTestSuite {
  @Test()
  async asksAiForConfiguredToneAndLongestAnswerLength() {
    let request: AiAnswerRequest | undefined;
    const provider = new ChromeAiAnswerProvider(NEGATIVE_ANSWERS, async (r) => {
      request = r;
      return 'Fate says no';
    });
    const answer = await provider.getAnswer();
    expect.toBeEqual(answer.type, AnswerTypes.Negative);
    expect.toBeEqual(answer.text, 'Fate says|no');
    expect.toBeEqual(request!.tone, AnswerTypes.Negative);
    expect.toBeEqual(request!.maxLength, 'Outlook not so good'.length);
    expect.toBeTrue(request!.examples.includes('My sources say no'));
  }

  @Test()
  async fallsBackToTryLaterAnswerWhenAiFails() {
    const provider = new ChromeAiAnswerProvider(NEGATIVE_ANSWERS, async () => null);
    const answer = await provider.getAnswer();
    expect.toBeTrue(AI_FAILURE_ANSWERS.includes(answer));
    expect.toBeEqual(answer.type, AnswerTypes.NonCommittal);
  }
}
