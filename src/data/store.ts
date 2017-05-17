import { IReducer } from '../types'

export class Store<T> {
  constructor(private _store: T) { }
  getState = () => this._store
  dispatch = (reducer: IReducer<T>) => {
    const self = this
    const store = self._store
    self._store = reducer(store) || store
  }
}
