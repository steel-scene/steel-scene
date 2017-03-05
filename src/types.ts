export type IDictionary<T> = { [name: string]: T };
export interface IList<T> { [key: number]: T; length: number; };

export interface ISteelScene {
  exportHTML(): Element;
  exportJSON(): IDictionary<ISceneJSON>;
  importHTML(el: Element, reset?: boolean): this;
  importJSON(scenes: IDictionary<ISceneJSON>, reset?: boolean): this;
  reset(): this;
  set(sceneName: string, toStateName: string): this;
  transition(sceneName: string, ...states: string[]): this;
  use(animationEngine: IAnimationEngine): this;
}

export interface IAnimationEngine {
  set(to: ISetOperation[]): void;
  transition(to: ITweenOperation[][], onStateChange: (stateName: string) => void): void;
}

export interface ISetOperation {
  targets: string;
  set: IDictionary<any>;
}

export interface ITweenOperation {
  targets: string;
  duration: number | undefined;
  easing: string | undefined;
  name: string;
  keyframes: IDictionary<any>[];
}

export interface IScene {
  defaultTransition?: ITransition;
  defaultState: IState;
  currentState: string;
  states: IDictionary<IState>;
  transitions: IDictionary<ITransition>;
}

export interface IState {
  duration: number | undefined;
  easing: string | undefined;
  name: string;
  targets: ITarget[];
  transition: ITransition | undefined;
  props: IDictionary<any>;
}


export interface ITransition {
  duration: number | undefined;
  easing: string | undefined;
  name: string | undefined;
}

export interface ITarget {
  ref: string;
  [name: string]: string | number;
}

export interface ISceneJSON {
  states: IDictionary<IStateJSON>;
  transitions: IDictionary<ITransitionJSON>;
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
