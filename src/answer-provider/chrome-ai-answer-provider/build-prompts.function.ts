import { AnswerTypes } from '../../shared/enums/answer-types.enum';
import { LanguageModelMessage } from './language-model.model';

/** What an answer of each tone has to mean. Kept terse so there is no instruction phrasing for the model to echo. */
const MEANINGS: Record<string, string> = {
  [AnswerTypes.Affirmative]: 'yes',
  [AnswerTypes.NonCommittal]: 'unclear, ask again later',
  [AnswerTypes.Negative]: 'no',
};

/** A random theme per request keeps identical requests from producing identical answers. */
export const THEMES: Readonly<string[]> = [
  'the stars',
  'the moon',
  'the sun',
  'the sea',
  'the wind',
  'thunder',
  'spirits',
  'tarot cards',
  'crystals',
  'shadows',
  'dreams',
  'fate',
  'the cosmos',
  'ravens',
  'cats',
  'mountains',
  'the tides',
  'old bones',
  'smoke',
  'mirrors',
  'a comet',
  'the oracle',
  'clocks',
  'tea leaves',
];

export const SYSTEM_PROMPT = [
  'You are a Magic 8 Ball.',
  'Someone silently asks a yes-or-no question you never see.',
  'You give one short, mysterious answer with the requested meaning, using the requested imagery.',
  'Output only the answer itself.',
].join(' ');

export function buildAnswerPrompt(tone: string, maxLength: number, theme: string): string {
  return `Meaning: ${MEANINGS[tone] ?? tone}. Imagery: ${theme}. At most ${maxLength} characters.`;
}

/**
 * Example exchanges showing the expected format. Deliberately not the preset answers (the model copies those),
 * and themes that are not in THEMES (so they don't get copied either).
 */
export const FEW_SHOT_PROMPTS: Readonly<LanguageModelMessage[]> = [
  { role: 'user', content: buildAnswerPrompt(AnswerTypes.Affirmative, 25, 'rivers') },
  { role: 'assistant', content: 'The river flows to yes' },
  { role: 'user', content: buildAnswerPrompt(AnswerTypes.Negative, 19, 'owls') },
  { role: 'assistant', content: 'The owls say no' },
  { role: 'user', content: buildAnswerPrompt(AnswerTypes.NonCommittal, 25, 'fog') },
  { role: 'assistant', content: 'The fog has not lifted' },
  { role: 'user', content: buildAnswerPrompt(AnswerTypes.Affirmative, 21, 'candles') },
  { role: 'assistant', content: 'Candles burn bright' },
];

export function buildTooLongPrompt(answer: string, maxLength: number): string {
  return `Too long: ${answer.length} characters. Same meaning, at most ${maxLength} characters.`;
}

export function buildEmptyAnswerPrompt(maxLength: number): string {
  return `Unusable. Only the answer, at most ${maxLength} characters.`;
}
