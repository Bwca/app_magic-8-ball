import { expect, Test, TestSuite } from 'testyts';

import { DEFAULT_ANSWERS } from '../../configuration/default-answers.const';
import { AnswerTypes } from '../../shared/enums/answer-types.enum';
import { getMaxAnswerLength } from './get-max-answer-length.function';
import { getPlainAnswerText } from './get-plain-answer-text.function';
import { sanitizeAiAnswer } from './sanitize-ai-answer.function';

@TestSuite()
export class ChromeAiHelpersTestSuite {
  @Test()
  plainTextRemovesLineBreakSymbols() {
    expect.toBeEqual(getPlainAnswerText('|Concentrate|and ask|again'), 'Concentrate and ask again');
    expect.toBeEqual(getPlainAnswerText('1234567890|x'), '1234567890 x');
  }

  @Test()
  maxLengthOfDefaultAnswersIsTheLongestPreset() {
    expect.toBeEqual(getMaxAnswerLength(DEFAULT_ANSWERS), 'Concentrate and ask again'.length);
  }

  @Test()
  maxLengthRespectsTheActiveAnswerSet() {
    const negativeOnly = DEFAULT_ANSWERS.filter(({ type }) => type === AnswerTypes.Negative);
    expect.toBeEqual(getMaxAnswerLength(negativeOnly), 'Outlook not so good'.length);
  }

  @Test()
  sanitizeStripsQuotesTrailingStopAndExtraLines() {
    expect.toBeEqual(sanitizeAiAnswer('  "The stars say yes."  \nHope this helps!'), 'The stars say yes');
    expect.toBeEqual(sanitizeAiAnswer('**Fate|is kind**'), 'Fate is kind');
    expect.toBeEqual(sanitizeAiAnswer('\n\n  '), '');
    expect.toBeEqual(sanitizeAiAnswer("Don't bet on it"), "Don't bet on it");
  }
}
