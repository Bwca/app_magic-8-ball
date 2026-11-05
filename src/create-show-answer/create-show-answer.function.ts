import { LINEBREAK_SYMBOL } from '../shared/constants/line-brean-symbol';
import { AbstractAnswerProvider } from '../shared/models/abstract-answer-provider';
import { AbstractRenderer } from '../shared/models/abstract-renderer';

export function createShowAnswer(
  renderer: AbstractRenderer,
  getAnswerProvider: () => AbstractAnswerProvider
): (event?: MouseEvent | undefined) => void {
  let isObtainingAnswer = false;

  return (event?: MouseEvent): void => {
    if (isObtainingAnswer) {
      return;
    }
    isObtainingAnswer = true;
    getAnswerProvider()
      .getAnswer()
      .then(({ text: answer }) => {
        renderer.showAnswer({
          answer,
          event,
          lineSeparator: LINEBREAK_SYMBOL,
        });
      })
      .finally(() => {
        isObtainingAnswer = false;
      });
  };
}
