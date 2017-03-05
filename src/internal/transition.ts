import { _, resolveElement } from '../utils';
import { elementToTransition } from './convert-dom';
import { ITransitionJSON } from '../types';

export class Transition {
  public duration: number | undefined;
  public easing: string | undefined;

  public fromJSON(json: ITransitionJSON): this {
    const self = this;
    self.duration = json.duration;
    self.easing = json.easing;
    return self;
  }

  public fromHTML(html: Element | string): this {
    return this.fromJSON(
      elementToTransition(
        resolveElement(html, true)
      )
    );
  }

  public toJSON(): ITransitionJSON {
    const self = this;
    return {
      default: _,
      duration: self.duration,
      easing: self.easing
    }
  }
}
