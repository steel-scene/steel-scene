import { ISteelAction } from '../types'

export class Store<T> {

  _reducers: { [type: string]: (s: T, a: ISteelAction, dispatcher: (action: ISteelAction) => void) => T } = {}

  constructor(private _store: T) { }
  getState = () => this._store
  dispatch = (action: ISteelAction) => {
    const self = this
    const reducer = self._reducers[action.type]
    const store = self._store
    self._store = (reducer && reducer(store, action, this.dispatch)) || store
  }
  register = (type: number, reducer: (s: T, a: ISteelAction, dispatcher: (action: ISteelAction) => void) => T): this => {
    this._reducers[type] = reducer
    return this
  }
}
