import { State } from './state';
import { Transition } from './transition';
import { elementToScene } from './convert-dom';
import { _, missingArg, resolveElement, assign, assignExcept, mapProperties } from '../utils';
import { IAnimationEngine, IDictionary, ISceneJSON, ISetOperation, ITarget, ITweenOperation } from '../types';

export class Scene {
  private states: IDictionary<State>;
  private transitions: IDictionary<Transition>;

  private defaultTransition: string | undefined;
  private defaultState: string;
  private currentState: string;

  constructor(private engine: IAnimationEngine) { }

  public fromJSON(json: ISceneJSON): this {
    const self = this;

    // load transitions into scene
    let defaultTransition: string | undefined;
    const transitions = {};
    for (let transitionName in json.transitions) {
      const transitionJSON = json.transitions[transitionName];
      const transition = new Transition().fromJSON(transitionJSON);
      if (transitionJSON.default) {
        defaultTransition = transitionName;
      }
      transitions[transitionName] = transition;
    }
    self.defaultTransition = defaultTransition;
    self.transitions = transitions;

    // load states into scene
    let defaultState: string | undefined;
    const states = {};
    for (let stateName in json.states) {
      const stateJSON = json.states[stateName];
      const state = new State().fromJSON(stateJSON);

      if (stateJSON.default) {
        defaultState = stateName;
      }
      states[stateName] = state;
    }

    // a starting point is required
    if (!defaultState) {
      throw missingArg('default state');
    }

    self.defaultState = defaultState;
    self.currentState = defaultState;
    self.states = states;
    return self;
  }

  public fromHTML(html: Element | string): this {
    return this.fromJSON(
      elementToScene(
        resolveElement(html, true)
      )
    );
  }

  public reset(): this {
    const self = this;
    return self.set(self.defaultState);
  }

  public set(toStateName: string): this {
    const self = this;
    const toState = self.states[toStateName];

    const operations = toState.targets
      .map((t: ITarget): ISetOperation => ({
        targets: t.ref,
        set: assignExcept({}, assign({}, toState.props, t), ['ref'])
      }));

    // tell animation engine to set the state directly
    self.engine.set(operations);
    self.currentState = toStateName;
    return self;
  }

  public transition(...states: string[]): this {
    const self = this;

    // find a suitable transition between the states
    let fromStateName =  self.currentState;

    const engineTransitions: ITweenOperation[][] = [];

    for (let x = 0, xlen = states.length; x < xlen; x++) {
      const toStateName = states[x];
      const fromState = self.states[fromStateName];
      const toState = self.states[toStateName];
      const transitions = self.transitions;

      // get duration from cascade of durations
      const duration = toState.duration
        || (!!toState.transition && transitions[toState.transition].duration)
        || (!!self.defaultTransition && transitions[self.defaultTransition].duration)
        || _;

      // the engine won't know what to do without a duration
      if (!duration) {
        throw missingArg('duration');
      }

      // get easing from cascade of easings
      const easing: string | undefined = toState.easing
        || (!!toState.transition && transitions[toState.transition].easing)
        || (!!self.defaultTransition && transitions[self.defaultTransition].easing)
        || _;

      // note: might be able to pass without an easing, not sure if good or bad
      if (!easing) {
        throw missingArg('easing');
      }

      const targets = {};

      // group from props by target
      for (let i = 0, len = fromState.targets.length; i < len; i++) {
        const target = fromState.targets[i];
        const allProps = assign({}, fromState.props, target);
        const ref = target.ref;
        let tween = targets[ref];
        if (!tween) {
          targets[ref] = tween = [];
        }
        tween.push(assignExcept({}, allProps, ['ref']));
      }

      // group to props by target
      for (let i = 0, len = toState.targets.length; i < len; i++) {
        const target = toState.targets[i];
        const allProps = assign({}, toState.props, target);
        const ref = target.ref;
        let tween = targets[ref];
        if (!tween) {
          targets[ref] = tween = [];
        }
        tween.push(assignExcept({}, allProps, ['ref']));
      }

      // convert grouping to array of tween operations
      const tweenOptions: ITweenOperation[] = [];
      for (const ref in targets) {
        tweenOptions.push({
          targets: ref,
          keyframes: targets[ref],
          easing,
          duration,
          name: toStateName
        });
      }

      engineTransitions.push(tweenOptions);
      fromStateName = toStateName;
    }

    // tell animation engine to transition
    // need some work on this, possible that this would be called repeatedly
    self.engine.transition(engineTransitions, (stateName: string) => self.currentState = stateName);
    return self;
  }

  public toJSON(): ISceneJSON {
    const self = this;
    return {
      states: mapProperties(self.states, (key, val) => val.toJSON()),
      transitions: mapProperties(self.transitions, (key, val) => val.toJSON())
    }
  }
}
