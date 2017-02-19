export type Dictionary<T> = {
  [name: string]: T
};

export interface IAnimationEngine {
  set(toState: ITarget[]): void;
  setPlayState(state: 'paused' | 'running'): this; 
  setup(unicorn: IBlueUnicorn): void;
  transition(fromState: ITarget[], toState: ITarget[], curve: ICurve): void;
  teardown(unicorn: IBlueUnicorn): void;
}

export interface IBlueUnicorn {   
  frolic(elOrSelector: Element | string): this;
  setPlayState(state: 'paused' | 'running'): this; 
  set(layerName: string, toStateName: string): this;
  transition(layerName: string, toStateName: string): this;
  use(animationEngine: IAnimationEngine): this;
}

export interface ILayer {
  state: string;
  states: Dictionary<ITarget[]>;
  curves: ICurve[];
}

export interface ICurve {
  duration?: number | undefined;
  easing?: string | undefined;
  state1: string;
  state2: string;
}

export interface ITarget {
  ref: string;
  [name: string]: string;
}
