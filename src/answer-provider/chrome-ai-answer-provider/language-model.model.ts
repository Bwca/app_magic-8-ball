/**
 * Minimal typings for Chrome's built-in Prompt API (`LanguageModel` global), covering only what this app uses.
 * See https://developer.chrome.com/docs/ai/prompt-api
 */
export type LanguageModelAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available';

export interface LanguageModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LanguageModelExpected {
  type: 'text';
  languages?: string[];
}

export interface LanguageModelCreateOptions {
  initialPrompts?: LanguageModelMessage[];
  expectedInputs?: LanguageModelExpected[];
  expectedOutputs?: LanguageModelExpected[];
  signal?: AbortSignal;
}

export interface LanguageModelSession {
  prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
  clone?(options?: { signal?: AbortSignal }): Promise<LanguageModelSession>;
  destroy(): void;
}

export interface LanguageModelStatic {
  availability(options?: LanguageModelCreateOptions): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

/** Options shared by `availability()` and `create()` so both describe the same model configuration. */
export const LANGUAGE_MODEL_OPTIONS: Readonly<LanguageModelCreateOptions> = {
  expectedInputs: [{ type: 'text', languages: ['en'] }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

export function getLanguageModel(): LanguageModelStatic | undefined {
  return (self as unknown as { LanguageModel?: LanguageModelStatic }).LanguageModel;
}
