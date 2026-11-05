import { isChromeAiAvailable, makeAnswerProvider } from './answer-provider';
import { obtainConfiguration } from './configuration';
import { createMotionDetector } from './create-motion-detector';
import { createShowAnswer } from './create-show-answer';
import { initPwa } from './init-pwa.function';
import { makeRenderer } from './renderer';
import { createSettingsMenu, readAiAnswersEnabled, writeAiAnswersEnabled } from './settings-menu';
import { AnswerProviderType } from './shared/models/answer-provider-type';

document.addEventListener('DOMContentLoaded', main);

async function main(): Promise<void> {
  const isOpenedInIframe = window.location !== window.parent.location;
  if (!isOpenedInIframe) {
    initPwa();
  }
  const { answers, color, rendererType } = obtainConfiguration();

  const sceneRenderer = await makeRenderer(rendererType, color);
  sceneRenderer.showBall(document.body);

  const isAiAvailable = await isChromeAiAvailable();
  const toProviderType = (isAiEnabled: boolean): AnswerProviderType => (isAiAvailable && isAiEnabled ? 'CHROME_AI' : 'PRESET');

  let answerProviderType = toProviderType(readAiAnswersEnabled());
  let answerProvider = await makeAnswerProvider(answerProviderType, answers);

  if (isAiAvailable) {
    createSettingsMenu(document.body, {
      isAiEnabled: answerProviderType === 'CHROME_AI',
      onAiEnabledChange: async (isAiEnabled) => {
        writeAiAnswersEnabled(isAiEnabled);
        const requestedType = (answerProviderType = toProviderType(isAiEnabled));
        const provider = await makeAnswerProvider(requestedType, answers);
        // Ignore stale results if the toggle was flipped again while the provider was loading.
        if (requestedType === answerProviderType) {
          answerProvider = provider;
        }
      },
    });
  }

  const showAnswer = createShowAnswer(sceneRenderer, () => answerProvider);
  const showAnswerOnShake = createMotionDetector(() => sceneRenderer.hideAnswer(), showAnswer);

  document.addEventListener('click', showAnswer);
  window.addEventListener('devicemotion', showAnswerOnShake);
}
