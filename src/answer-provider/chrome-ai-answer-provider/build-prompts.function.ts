import { AnswerTypes } from '../../shared/enums/answer-types.enum';

const TONE_DESCRIPTIONS: Record<string, string> = {
  [AnswerTypes.Affirmative]: 'affirmative: it clearly says yes',
  [AnswerTypes.NonCommittal]: 'non-committal: it neither says yes nor no, e.g. evasive or asking to try again',
  [AnswerTypes.Negative]: 'negative: it clearly says no',
};

export const SYSTEM_PROMPT = [
  'You are a Magic 8 Ball.',
  'The person silently asks you a yes-or-no question that you never get to see.',
  'You reply with exactly one short, mystical, fortune-teller style answer that works for any yes-or-no question.',
  'Reply with the answer text only: no quotes, no explanations, no emojis, no line breaks, no trailing full stop.',
].join(' ');

export function buildAnswerPrompt(tone: string, maxLength: number, examples: string[]): string {
  const toneDescription = TONE_DESCRIPTIONS[tone] ?? tone;
  const lines = [
    `Give a new answer whose tone is ${toneDescription}.`,
    `It MUST be at most ${maxLength} characters long, counting spaces.`,
  ];
  if (examples.length) {
    lines.push(`Examples of answers with this tone: ${examples.map((example) => `"${example}"`).join(', ')}.`);
    lines.push('Do not copy the examples, come up with your own.');
  }
  return lines.join('\n');
}

export function buildTooLongPrompt(answer: string, maxLength: number): string {
  return [
    `"${answer}" is ${answer.length} characters long, which exceeds the limit of ${maxLength} characters.`,
    `Give a different, shorter answer with the same tone, at most ${maxLength} characters long.`,
  ].join('\n');
}

export function buildEmptyAnswerPrompt(maxLength: number): string {
  return `That was not a usable answer. Reply with just the answer text, at most ${maxLength} characters long.`;
}
