export type Dictionary<T> = {
  [name: string]: T
};

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


