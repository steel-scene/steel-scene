import { IReducer, ISteelState } from '../types'

let _store: ISteelState = {
  scenes: {},
  targets: {}
}

export const getState = () => _store

export const dispatch = (reducer: IReducer<ISteelState>) => {
  _store = reducer(_store) || _store
}
