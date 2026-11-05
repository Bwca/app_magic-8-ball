import { AnswerTypes } from '../../shared/enums/answer-types.enum';

/** What an answer of each tone has to mean. Kept terse so there is no instruction phrasing for the model to echo. */
const MEANINGS: Record<string, string> = {
  [AnswerTypes.Affirmative]: 'yes',
  [AnswerTypes.NonCommittal]: 'unclear, ask again later',
  [AnswerTypes.Negative]: 'no',
};

export const SYSTEM_PROMPT = [
  'You are a Magic 8 Ball.',
  'Someone silently asks a yes-or-no question you never see.',
  'You give one short, mysterious answer with the requested meaning.',
  'Output only the answer itself.',
].join(' ');

export function buildAnswerPrompt(tone: string, maxLength: number): string {
  return `Meaning: ${MEANINGS[tone] ?? tone}. At most ${maxLength} characters.`;
}

export function buildTooLongPrompt(answer: string, maxLength: number): string {
  return `Too long: ${answer.length} characters. Same meaning, at most ${maxLength} characters.`;
}

export function buildEmptyAnswerPrompt(maxLength: number): string {
  return `Unusable. Only the answer, at most ${maxLength} characters.`;
}
