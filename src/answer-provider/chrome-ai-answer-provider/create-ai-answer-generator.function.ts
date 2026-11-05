import { buildAnswerPrompt, buildEmptyAnswerPrompt, buildTooLongPrompt, SYSTEM_PROMPT } from './build-prompts.function';
import { getLanguageModel, LanguageModelMessage, LanguageModelSession, LANGUAGE_MODEL_OPTIONS } from './language-model.model';
import { sanitizeAiAnswer } from './sanitize-ai-answer.function';

export const MAX_AI_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 15000;
const INITIAL_PROMPTS: LanguageModelMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

export interface AiAnswerRequest {
  /** Tone the answer must have, one of the AnswerTypes present in the active answer set. */
  tone: string;
  /** Hard limit: the answer may not be longer than the longest preset answer. */
  maxLength: number;
}

/** Resolves to the generated answer, or `null` if no acceptable answer was produced within MAX_AI_ATTEMPTS. */
export type AiAnswerGenerator = (request: AiAnswerRequest) => Promise<string | null>;

export function createAiAnswerGenerator(): AiAnswerGenerator {
  let baseSessionPromise: Promise<LanguageModelSession> | null = null;

  const getBaseSession = (): Promise<LanguageModelSession> => {
    if (!baseSessionPromise) {
      const languageModel = getLanguageModel();
      if (!languageModel) {
        return Promise.reject(new Error('Chrome AI (LanguageModel) is not available'));
      }
      baseSessionPromise = languageModel.create({ ...LANGUAGE_MODEL_OPTIONS, initialPrompts: INITIAL_PROMPTS }).catch((error) => {
        baseSessionPromise = null; // allow a later retry
        throw error;
      });
    }
    return baseSessionPromise;
  };

  return async ({ tone, maxLength }) => {
    let session: LanguageModelSession | null = null;
    try {
      const baseSession = await getBaseSession();
      // Each answer gets its own conversation so earlier answers don't pile up in the context window.
      session = baseSession.clone
        ? await baseSession.clone()
        : await getLanguageModel()!.create({
            ...LANGUAGE_MODEL_OPTIONS,
            initialPrompts: INITIAL_PROMPTS,
          });

      let prompt = buildAnswerPrompt(tone, maxLength);
      for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
        let answer = '';
        try {
          answer = sanitizeAiAnswer(await session.prompt(prompt, { signal: createTimeoutSignal(ATTEMPT_TIMEOUT_MS) }));
        } catch (error) {
          // tslint:disable-next-line: no-console
          console.warn(`Chrome AI attempt ${attempt}/${MAX_AI_ATTEMPTS} failed`, error);
          prompt = buildAnswerPrompt(tone, maxLength);
          continue;
        }

        if (answer && answer.length <= maxLength) {
          return answer;
        }
        prompt = answer ? buildTooLongPrompt(answer, maxLength) : buildEmptyAnswerPrompt(maxLength);
      }
      return null;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.warn('Chrome AI session could not be created', error);
      return null;
    } finally {
      session?.destroy();
    }
  };
}

function createTimeoutSignal(ms: number): AbortSignal | undefined {
  const abortSignal = AbortSignal as typeof AbortSignal & { timeout?: (ms: number) => AbortSignal };
  return abortSignal.timeout ? abortSignal.timeout(ms) : undefined;
}
