import { ISteelAction } from '../'
import { ISteelState } from '../types'
import { onUpdateAllTargets } from './targets'


let state: ISteelState = {
  targets: {}
}

export function getState(): ISteelState {
  return state
}

export function dispatch(action: ISteelAction<string>): ISteelState {
  return state = {
    targets: onUpdateAllTargets(state.targets, action)
  }
}

