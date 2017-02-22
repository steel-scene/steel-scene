export type IDictionary<T> = { [name: string]: T};

export interface IAnimationEngine {
  set(toState: ITarget[]): void;
  setPlayState(state: 'paused' | 'running'): void;
  setup(unicorn: IBlueUnicorn): void;
  transition(transitions: ITransition[], onStateChange: (stateName: string) => void): void;
  teardown(unicorn: IBlueUnicorn): void;
}

export interface IBlueUnicorn {
  exportHTML(): Element;
  exportJSON(): IDictionary<ILayer>;
  importHTML(el: Element, reset?: boolean): this;
  importJSON(layers: IDictionary<ILayer>, reset?: boolean): this;
  reset(): this;
  set(layerName: string, toStateName: string): this;
  setPlayState(state: 'paused' | 'running'): this;
  transition(layerName: string, ...states: string[]): this;
  use(animationEngine: IAnimationEngine): this;
}

export interface ILayer {
  curves: ICurve[];
  state: string;
  states: IDictionary<ITarget[]>;
  transitionDuration?: number | undefined;
  transitionEasing?: string | undefined;
}

export interface ICurve {
  duration: number | undefined;
  easing?: string | undefined;
  state1: string;
  state2: string;
}

export interface ITransition {
  curve?: ICurve;
  state1: ITarget[];
  state2: ITarget[];
}

export interface ITarget {
  ref: string;
  [name: string]: string;
}
