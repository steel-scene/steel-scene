import { Dictionary } from '../types';
import {
  _, convertToFloat, createElement, defaultAttr, defaultName, durationAttr, easingAttr,
  findElements, getAttribute, nameAttr, resolveElement, setAttribute, transitionSelector
} from '../utils';

export const elementToTransition = ($transition: Element): ITransitionJSON =>  {
  return {
    default: $transition.hasAttribute(defaultAttr),
    duration: convertToFloat(getAttribute($transition, durationAttr)),
    easing: getAttribute($transition, easingAttr) || _
  };
}

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

export const transitionToElement = (transition: ITransitionJSON): Element => {
  const $transition = createElement(transitionSelector);
  if (transition.duration) {
    setAttribute($transition, durationAttr, transition.duration.toString());
  }
  if (transition.easing) {
    setAttribute($transition, easingAttr, transition.easing);
  }
  if (transition.default) {
    setAttribute($transition, defaultAttr, '');
  }
  return $transition;
}


export interface ITransitionJSON {
  default?: boolean | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
}
