import { Answer } from '../shared/models/answer.model';
import { RendererType } from '../shared/models/renderer-type';
import { checkDevMode } from './check-dev-mode.function';
import { DEFAULT_ANSWERS } from './default-answers.const';
import { ParamKeys } from './param-keys.enum';

export function obtainConfiguration(): Configuration {
  const params = new URLSearchParams(window.location.search);
  const answers = filterAnswers(params, getAnswers(params));
  const color = params.get(ParamKeys.BallColor) || 'Navy';
  const rendererType = (params.get(ParamKeys.RendererType) || 'THREE') as RendererType;

  if (!checkDevMode()) {
    history.replaceState('', '', window.location.pathname);
  }

  return {
    answers,
    color,
    rendererType,
  };
}

function filterAnswers(params: URLSearchParams, answers: Readonly<Answer[]>): Readonly<Answer[]> {
  if (params.has(ParamKeys.AnswerFilter)) {
    const requiredAnswerType = params.get(ParamKeys.AnswerFilter);
    return answers.filter(({ type }) => type === requiredAnswerType);
  }
  return answers;
}

function getAnswers(params: URLSearchParams): Readonly<Answer[]> {
  if (!params.has(ParamKeys.Answers)) {
    return DEFAULT_ANSWERS;
  }

  try {
    return JSON.parse(params.get(ParamKeys.Answers) as string);
  } catch (e) {
    return DEFAULT_ANSWERS;
  }
}

interface Configuration {
  color: string;
  answers: Readonly<Answer[]>;
  rendererType: RendererType;
}
