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

/**  */
export type Func<TInput, TOutput> = {
  (item: TInput): TOutput;
};

// default instance
export interface ISteelScene {
  exportHTML(): Element;
  exportJSON(): Dictionary<ISceneJSON>;
  importHTML(el: Element, reset?: boolean): this;
  importJSON(scenes: Dictionary<ISceneJSON>, reset?: boolean): this;
  reset(): this;
  set(sceneName: string, toStateName: string): this;
  transition(sceneName: string, ...states: string[]): this;
  use(animationEngine: IAnimationEngine): this;
}

// plugin types
export interface IAnimationEngine {
  set(to: ISetOperation[]): void;
  transition(to: ITimelineTween, onStateChange: (stateName: string) => void): void;
}

export interface ISetOperation {
  targets: string;
  set: Dictionary<any>;
}

export interface ITimelineTween {
  id: number;
  states: IStateTween[]
}

export interface IStateTween {
  stateName: string;
  tweens: ITargetTween[];
  duration: number;
  easing: string | undefined;
}

export interface ITargetTween {
  targets: string;
  keyframes: Dictionary<any>[];
}

// export interface IScene {
//   defaultTransition?: ITransition;
//   defaultState: IState;
//   currentState: string;
//   states: IDictionary<IState>;
//   transitions: IDictionary<ITransition>;
// }

// export interface IState {
//   duration: number | undefined;
//   easing: string | undefined;
//   name: string;
//   targets: ITarget[];
//   transition: ITransition | undefined;
//   props: IDictionary<any>;
// }


// export interface ITransition {
//   duration: number | undefined;
//   easing: string | undefined;
//   name: string | undefined;
// }

export interface ISceneJSON {
  states: Dictionary<IStateJSON>;
  transitions: Dictionary<ITransitionJSON>;
}

export interface IStateJSON {
  default?: boolean | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
  transition?: string | undefined;
  targets: ITargetJSON[];
  [name: string]: boolean | number | string | ITargetJSON[] | undefined;
}

export interface ITransitionJSON {
  default?: boolean | undefined;
  duration?: number | undefined;
  easing?: string | undefined;
}

export interface ITargetJSON {
  ref: string;
  [name: string]: string | number;
}

export interface ITarget {
  ref: string;
  [name: string]: string | number;
}
