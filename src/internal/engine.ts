import { IAnimationEngine } from '../types'

let engine: IAnimationEngine

export const setEngine = (animationEngine: IAnimationEngine): void => { engine = animationEngine }
export const getEngine = (): IAnimationEngine => engine
