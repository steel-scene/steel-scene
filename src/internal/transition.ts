import { getAttributes, isElement, resolveElement } from '../utils/elements';
import { guid } from '../utils/guid';
import { assign, isString } from '../utils/objects';
import { _, DEFAULT, DURATION, EASING, NAME } from '../utils/constants';
import { missingArg } from '../utils/errors';

const transitionAttributeWhitelist = [DEFAULT, DURATION, EASING, NAME];
export const elementToTransition = (el: Element): ITransitionOptions => {
  return getAttributes(el, transitionAttributeWhitelist);
}

export class Transition {
  readonly id: string = guid();

  duration: number;
  easing: string;
  _name: string;

  name(): string;
  name(name: string): this;
  name(name?: string): string | this {
    const self = this;
    if (!arguments.length) {
      return self._name;
    }
    self._name = name;
    return self;
  }

  load(options: Element | string | ITransitionOptions): this {
    const self = this;
    if (!options) {
      throw missingArg('json');
    }

    if (isString(options) || isElement(options)) {
      const element = resolveElement(options as (string | Element), true);
      options =  elementToTransition(element);
    }

    assign(self, _, options);
    return self;
  }
}

export interface ITransitionOptions {
  default?: boolean;
  name?: string;
  duration?: number;
  easing?: string;
}

export function transition(name?: string, options?: Element | string | ITransitionOptions): Transition {
  return new Transition()
    .name(name)
    .load(options as ITransitionOptions);
}
