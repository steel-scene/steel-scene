export type AnimationTargetOptions = string | string[] | Element | Element[] | {} | {}[]
export type AnimationTarget = (Element | {})[]

// types used by the plugin system
export interface IAnimationEngine {
  set(to: ISetOperation[]): void
  transition(to: ITargetTimeline[]): void
}

export interface ISetOperation {
  targetId: string
  targets: any[]
  props: {}
}

export interface ITargetTimeline {
  targetId: string
  targets: any[]
  animations: ITargetAnimation[]
  onStateChange: (stateName: string) => void
}

export interface ITargetAnimation {
  stateName: string
  keyframes: Dictionary<any>[]
  duration: number
  easing: string
}


// common types
/** set of key/value pairs, an object literal essentially */
export type Dictionary<T> = {
  [name: string]: T
}

/** an array-like structure such as an array, arguments, NodeList, or string */
export type List<T> = {
  [key: number]: T;
  length: number;
}

/** returns true for a single item, used for filters */
export type Predicate<T> = {
  (t: T): boolean;
}

/** translates one type into another  */
export type Func<TInput, TOutput> = {
  (item: TInput): TOutput;
}

export interface ITargetOptions {
  /** true if used as defaults. false if used as overrides. defaults to false  */
  inherited?: boolean
  /** number of milliseconds to animate the target  */
  duration?: number
  /** easing timing function to use  */
  easing?: string
  /** states to configure */
  states?: Dictionary<Dictionary<any>>
  /** element to select */
  select?: string
  [name: string]: boolean | number | string | Dictionary<any>
}


export interface ITargetState {
  currentState: string
  targets: AnimationTarget
  props: Dictionary<any>
  states: Dictionary<{}>
}


export interface ISceneOptions {
  name?: string
  targets: ITargetOptions[]

  [propName: string]: string | ITargetOptions[]
}

export interface ISteelState {
  targets: Dictionary<ITargetState>
}

export interface ISteelAction<T extends number> {
  type: T
  id: string
}
