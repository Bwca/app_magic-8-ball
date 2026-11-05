import { LINEBREAK_SYMBOL } from '../../shared/constants/line-brean-symbol';

/**
 * Normalizes raw model output into an 8-ball style answer: first non-empty line only, no wrapping quotes
 * or markdown emphasis, no LINEBREAK_SYMBOL (renderers treat it as a line break), no trailing full stop.
 */
export function sanitizeAiAnswer(raw: string): string {
  const firstLine = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return '';
  }

  return firstLine
    .split(LINEBREAK_SYMBOL)
    .join(' ')
    .replace(/^[\s"'“”‘’*_`]+|[\s"'“”‘’*_`]+$/g, '')
    .replace(/[.!]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}
