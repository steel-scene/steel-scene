import { Dictionary } from '../types';
import { elementToTarget, ITargetJSON, targetToElement } from './index';
import {
  _, appendElement, assign, copyArray, convertToFloat, createElement, defaultName, defaultAttr,
  durationAttr, easingAttr, findElements, getAttribute, nameAttr, resolveElement, setAttribute,
  stateSelector, targetSelector
} from '../utils';


export const elementToState = ($state: Element): IStateJSON => {

  // read all "target" elements
  // assemble target elements and properties and to the list
  const props: IStateJSON = {
    targets: findElements(targetSelector, $state).map(elementToTarget)
  };

  copyArray($state.attributes)
    .forEach(att => {
      const name = att.name;
      if (name === nameAttr) {
        // do nothing
      } else if (name === durationAttr) {
        props.duration = convertToFloat(getAttribute($state, durationAttr));
      } else if (name === defaultAttr) {
        props.default = true;
      } else {
        props[name] = att.value;
      }
    });

  return props;
};


export class State {
  public duration: number | undefined;
  public transition: string | undefined;
  public easing: string | undefined;
  public targets: ITargetJSON[];
  public props: Dictionary<any>;

  public fromJSON(json: IStateJSON): this {
    const self = this;
    self.duration = json.duration;
    self.easing = json.easing;
    self.transition = json.transition;
    self.props = assign({}, ['duration', 'easing', 'name', 'targets', 'transition'], json);
    self.targets = json.targets.slice(0);
    return self;
  }

  public fromHTML(html: Element | string): this {
    return this.fromJSON(
      elementToState(
        resolveElement(html, true)
      )
    );
  }

  public toJSON(): IStateJSON {
    const self = this;
    return {
      duration: self.duration,
      easing: self.easing,
      transition: self.transition,
      targets: self.targets
    }
  }
}

export const sceneElementToStates = ($scene: Element): Dictionary<IStateJSON> => {
  // find all "state" elements
  const states: Dictionary<IStateJSON> = {};

  // assemble all states (nodes)... each ref refers to an element and its
  // properties instruct the animation engine what propertie to set
  findElements(stateSelector, $scene).forEach($state => {
    // read element to pull in state definiton
    const state = elementToState($state);
    const stateName = getAttribute($state, nameAttr) || (state.default ? defaultName : _);

    // skip if no name present and not marked default
    if (!stateName) {
      return;
    }

    states[stateName] = state;
  });

  return states;
}



export const stateToElement = (state: IStateJSON): Element => {
  const $state = createElement(stateSelector);

  if (state.default) {
    setAttribute($state, defaultAttr, '');
  }
  if (state.duration) {
    setAttribute($state, durationAttr, state.duration.toString());
  }
  if (state.easing) {
    setAttribute($state, easingAttr, state.easing);
  }
  if (state.transition) {
    setAttribute($state, easingAttr, state.transition);
  }

  state.targets.forEach(t => appendElement($state, targetToElement(t)))
  return $state;
}

export interface IStateJSON {
  default?: boolean | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
  transition?: string | undefined;
  targets: ITargetJSON[];
  [name: string]: boolean | number | string | ITargetJSON[] | undefined;
}
