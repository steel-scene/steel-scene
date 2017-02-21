export type IDictionary<T> = { [name: string]: T};

export interface IAnimationEngine {
  set(toState: ITarget[]): void;
  setPlayState(state: 'paused' | 'running'): void;
  setup(unicorn: IBlueUnicorn): void;
  transition(transitions: ITransition[]): void;
  teardown(unicorn: IBlueUnicorn): void;
}

export interface IBlueUnicorn {
  load(options: Element | string, reset?: boolean): this;
  loadJSON(layers: IDictionary<ILayer>, reset?: boolean): this;
  reset(): this;
  set(layerName: string, toStateName: string): this;
  setPlayState(state: 'paused' | 'running'): this;
  transition(layerName: string, toStateName: string): this;
  use(animationEngine: IAnimationEngine): this;
}

export interface ILayer {
  state: string;
  states: IDictionary<ITarget[]>;
  curves: ICurve[];
}

export interface ICurve {
  duration: number | undefined;
  easing?: string | undefined;
  state1: string;
  state2: string;
  isDefault?: boolean | undefined;
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
