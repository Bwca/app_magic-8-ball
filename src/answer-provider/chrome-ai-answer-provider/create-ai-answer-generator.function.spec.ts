import { expect, Test, TestSuite } from 'testyts';

import { createAiAnswerGenerator, MAX_AI_ATTEMPTS } from './create-ai-answer-generator.function';

const REQUEST = { tone: 'affirmative', maxLength: 12, examples: ['Yes'] };

/** Installs a fake `LanguageModel` global replying with the given responses (strings, or Errors to throw). */
function installFakeLanguageModel(responses: (string | Error)[]): { prompts: string[] } {
  const prompts: string[] = [];
  const session = {
    prompt: async (input: string) => {
      prompts.push(input);
      const response = responses.shift();
      if (response instanceof Error || response === undefined) {
        throw response ?? new Error('no more responses');
      }
      return response;
    },
    clone: async () => session,
    destroy: () => undefined,
  };
  (globalThis as any).self = globalThis;
  (globalThis as any).LanguageModel = { availability: async () => 'available', create: async () => session };
  return { prompts };
}

@TestSuite()
export class CreateAiAnswerGeneratorTestSuite {
  @Test()
  async returnsAnswerThatFitsTheLimit() {
    installFakeLanguageModel(['"Fate agrees."']);
    expect.toBeEqual(await createAiAnswerGenerator()(REQUEST), 'Fate agrees');
  }

  @Test()
  async reTasksWhenAnswerIsTooLong() {
    // 'Stars say yes' is 13 chars, still over the 12 char limit; the third answer fits.
    const { prompts } = installFakeLanguageModel(['The cosmos smiles upon you', 'Stars say yes', 'Surely so']);
    expect.toBeEqual(await createAiAnswerGenerator()(REQUEST), 'Surely so');
    expect.toBeEqual(prompts.length, 3);
  }

  @Test()
  async tooLongRetryPromptMentionsTheLimit() {
    const { prompts } = installFakeLanguageModel(['The cosmos smiles upon you', 'Surely so']);
    await createAiAnswerGenerator()(REQUEST);
    expect.toBeEqual(prompts.length, 2);
    expect.toBeTrue(prompts[1].includes('exceeds the limit of 12 characters'));
  }

  @Test()
  async givesUpAfterMaxAttempts() {
    const { prompts } = installFakeLanguageModel(['Way too long of an answer', new Error('boom'), '', 'Never asked']);
    expect.toBeEqual(await createAiAnswerGenerator()(REQUEST), null);
    expect.toBeEqual(prompts.length, MAX_AI_ATTEMPTS);
  }

  @Test()
  async returnsNullWhenChromeAiIsMissing() {
    (globalThis as any).self = globalThis;
    delete (globalThis as any).LanguageModel;
    expect.toBeEqual(await createAiAnswerGenerator()(REQUEST), null);
  }
}
