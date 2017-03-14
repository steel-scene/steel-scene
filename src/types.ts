// types used by the plugin system
export interface IAnimationEngine {
  set(to: ISetOperation[]): void;
  transition(to: ITimelineTween, onStateChange: (stateName: string) => void): void;
}

export interface ISetOperation {
  targets: any[];
  props: Dictionary<any>;
}

export interface ITimelineTween {
  id: string;
  states: IStateTween[]
}

export interface IStateTween {
  stateName: string;
  tweens: ITargetTween[];
}

export interface ITargetTween {
  targets: any[];
  keyframes: Dictionary<any>[];
  duration: number;
  easing: string | undefined;
}


// common types
/** set of key/value pairs, an object literal essentially */
export type Dictionary<T> = {
  [name: string]: T
};

/** an array-like structure such as an array, arguments, NodeList, or string */
export type List<T> = {
  [key: number]: T;
  length: number;
};

/** returns true for a single item, used for filters */
export type Predicate<T> = {
  (t: T): boolean;
};

/** translates one type into another  */
export type Func<TInput, TOutput> = {
  (item: TInput): TOutput;
};
