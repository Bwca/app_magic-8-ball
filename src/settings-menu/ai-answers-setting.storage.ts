const STORAGE_KEY = 'magic-8-ball:chrome-ai-answers-enabled';

export function readAiAnswersEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function writeAiAnswersEnabled(isEnabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(isEnabled));
  } catch {
    // Storage may be unavailable (e.g. blocked); the toggle then only lasts for the current page.
  }
}
