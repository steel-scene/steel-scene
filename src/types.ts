export type Dictionary<T> = {
  [name: string]: T
};

export interface ILayer {
  name: string;
  state: string;
  states: Dictionary<IState>;
  curves: ICurve[];
}

export interface ICurve {
  duration?: number | undefined;
  easing?: string | undefined;
  state1: string;
  state2: string;
}

export interface IState {
  name: string;
  targets: ITarget[];
}

export interface ITarget {
  ref: string;
  [name: string]: string;
}


