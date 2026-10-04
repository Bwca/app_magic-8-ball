import { AbstractRenderer } from '../../shared/models/abstract-renderer';
import { RendererType } from '../../shared/models/renderer-type';

export async function makeRenderer(type: RendererType, ballColor: string | number): Promise<AbstractRenderer> {
  switch (type) {
    case 'HTML':
      return makeHtmlRenderer();
    case 'THREE':
      return makeTHREERenderer(ballColor);
    default:
      throw new Error('No renderer type specified!');
  }
}

/** TODO: implement canvas renderer */
async function makeCanvasRenderer(): Promise<AbstractRenderer> {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('NO CANVAS FOUND');
  }
  return import('../canvas-renderer/canvas-renderer').then(({ CanvasRenderer }) => new CanvasRenderer(canvas));
}

async function makeHtmlRenderer(): Promise<AbstractRenderer> {
  return import('../html-renderer/html-renderer').then(({ HtmlRenderer }) => new HtmlRenderer());
}

async function makeTHREERenderer(ballColor: string | number): Promise<AbstractRenderer> {
  const fov = outerWidth >= 600 ? 60 : 37;
  return import('../three-renderer/three-ball-8-renderer.class').then(({ THREEBall8Renderer }) => new THREEBall8Renderer(ballColor, fov));
}
