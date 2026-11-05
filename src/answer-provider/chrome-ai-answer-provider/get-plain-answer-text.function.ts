import { LINEBREAK_SYMBOL } from '../../shared/constants/line-brean-symbol';

/** Turns an answer's display text (possibly containing LINEBREAK_SYMBOL wraps) back into a plain one-line string. */
export function getPlainAnswerText(text: string): string {
  return text
    .split(LINEBREAK_SYMBOL)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}
