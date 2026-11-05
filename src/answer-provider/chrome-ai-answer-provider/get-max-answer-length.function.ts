import { Answer } from '../../shared/models/answer.model';
import { getPlainAnswerText } from './get-plain-answer-text.function';

/** Length (in characters, ignoring line-break markers) of the longest answer in the given set. */
export function getMaxAnswerLength(answers: Readonly<Answer[]>): number {
  return answers.reduce((max, { text }) => Math.max(max, getPlainAnswerText(text).length), 0);
}
