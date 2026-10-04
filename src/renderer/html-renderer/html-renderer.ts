import { AnswerPayload } from 'fork-magic-8-ball';

import { AbstractRenderer } from '../../shared/models/abstract-renderer';
import { HtmlRendererStyle } from './html-renderer.style.enum';
import './html-renderer.style.scss';

export class HtmlRenderer implements AbstractRenderer {
  public ball!: HTMLElement;
  private answerContainer!: HTMLElement;
  private answer!: HTMLElement;
  private isInProgress = false;

  public hideAnswer(): void {
    this.answerContainer.classList.remove(HtmlRendererStyle.IsVisible);
  }

  public showAnswer({ answer, lineSeparator }: AnswerPayload): void {
    if (this.isInProgress) {
      return;
    }
    this.isInProgress = true;
    answer = lineSeparator ? answer.replaceAll(lineSeparator, '\n') : answer;
    this.changeAnswer(answer);
  }

  public showBall(host: HTMLElement) {
    const canvas = document.createElement('section');
    canvas.className = HtmlRendererStyle.Canvas;

    const ball = document.createElement('article');
    ball.className = HtmlRendererStyle.Ball;
    this.ball = ball;
    const answerPortal = document.createElement('div');
    answerPortal.className = HtmlRendererStyle.AnswerPortal;

    const answerContainer = document.createElement('div');
    answerContainer.className = HtmlRendererStyle.AnswerContainer;
    this.answerContainer = answerContainer;

    const answer = document.createElement('div');
    answer.className = HtmlRendererStyle.Answer;
    this.answer = answer;

    answerContainer.appendChild(answer);
    answerPortal.appendChild(answerContainer);

    ball.appendChild(answerPortal);

    canvas.appendChild(ball);

    host.appendChild(canvas);
  }

  private async changeAnswer(answer: string): Promise<void> {
    this.answerContainer.classList.remove(HtmlRendererStyle.IsVisible);
    await this.wait(1000);
    this.answer.textContent = answer;
    this.answerContainer.classList.add(HtmlRendererStyle.IsVisible);
    this.isInProgress = false;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
