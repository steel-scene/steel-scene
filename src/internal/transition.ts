import { guid } from '../utils/guid';
import { Dictionary } from '../types';
import {
  _,
  assign,
  defaultAttr,
  defaultName,
  durationAttr,
  easingAttr,
  findElements,
  getAttribute,
  getAttributes,
  isElement,
  isString,
  missingArg,
  nameAttr,
  resolveElement,
  transitionSelector
} from '../utils';

const attributeNames = [defaultAttr, durationAttr, easingAttr];
export const elementToTransition = (el: Element): ITransitionJSON => {
  return getAttributes(el, attributeNames);
}

export class Transition {
  public readonly id: string = guid();

  public duration: number | undefined;
  public easing: string | undefined;
  private _name: string | undefined;

  public name(): string | undefined;
  public name(name: string | undefined): this;
  public name(name?: string): string | undefined | this {
    const self = this;
    if (!arguments.length) {
      return self._name;
    }
    self._name = name;
    return self;
  }

  public load(options: Element | string | ITransitionJSON): this {
    const self = this;
    if (!options) {
      throw missingArg('json');
    }

    if (isString(options) || isElement(options)) {
      return this.load(
        elementToTransition(
          resolveElement(options as (string | Element), true)
        )
      );
    }
    assign(self, _, options);
    return self;
  }

  public toJSON(): ITransitionJSON {
    const {duration, easing, _name } = this;
    return { default: _, duration, easing, name: _name }
  }
}



export const sceneElementToTransitions = ($scene: Element): Dictionary<ITransitionJSON> => {
  // assemble all transitions (the edges between nodes)
  const transitions: Dictionary<ITransitionJSON> = {};

  // find all "transition" elements
  findElements(transitionSelector, $scene).forEach($transition => {
    const transition = elementToTransition($transition as Element);
    const name = getAttribute($transition as Element, nameAttr)
      || (transition.default ? defaultName : _);

    // skip if no name present and not marked default
    if (!name) {
      return;
    }

    // add to list, merge if duplicate
    transitions[name] = transition;
  });

  return transitions;
}

export interface ITransitionJSON {
  default?: boolean | undefined;
  name?: string | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
}

export function transition(name?: string, options?: Element | string | ITransitionJSON): Transition {
  return new Transition()
    .name(name)
    .load(options as ITransitionJSON);
}
