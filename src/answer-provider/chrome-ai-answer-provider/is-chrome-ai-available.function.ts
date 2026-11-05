import { getLanguageModel, LANGUAGE_MODEL_OPTIONS } from './language-model.model';

/**
 * True only when Chrome's built-in model is ready to use right now.
 * Downloading/enabling the model is left to the user, so 'downloadable' and 'downloading' count as unavailable.
 */
export async function isChromeAiAvailable(): Promise<boolean> {
  const languageModel = getLanguageModel();
  if (!languageModel) {
    return false;
  }
  try {
    return (await languageModel.availability(LANGUAGE_MODEL_OPTIONS)) === 'available';
  } catch {
    return false;
  }
}
