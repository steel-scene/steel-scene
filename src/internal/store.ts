import { IReducer, ISteelState, IStoreNotifier, IStoreListener } from '../types'

// timespan to wait for additional reducers after a new reducers is received
const interval = 1000 / 60

// queue variables
let isEnqueued = false
let queue: IReducer[] = []

class Notifier implements IStoreNotifier {
  _updates: string[] = []
  _subscribers: IStoreListener[] = []
  public dirty = (id: string) => {
    const { _updates } = this
    if (_updates.indexOf(id) === -1) {
      _updates.push(id)
    }
  }

  public publish = (nextState: ISteelState) => {
    const self = this
    const { _updates, _subscribers } = self
    if (!_updates.length) {
      return
    }

    for (let i = 0, len = _subscribers.length; i < len; i++) {
      _subscribers[i](nextState, _updates)
    }

    // clear updates
    _updates.splice(0, _updates.length)
  }
  public subscribe = (subscriber: IStoreListener) => {
    const { _subscribers } = this
    if (_subscribers.indexOf(subscriber) === -1) {
      _subscribers.push(subscriber)
    }
  }
  public unsubscribe = (subscriber: IStoreListener) => {
    const { _subscribers } = this
    const index = _subscribers.indexOf(subscriber)
    if (index !== -1) {
      _subscribers.splice(index, 1)
    }
  }
}

const notifier = new Notifier()

// initial state
let currentState: ISteelState = {
  scenes: {},
  targets: {}
}

// handles resolving new state from the queued reducers
const resolveState = () => {
  let nextState = currentState

  for (let i = queue.length - 1; i > -1; i--) {
    nextState = queue.pop()(nextState, notifier) || nextState
  }

  isEnqueued = false
  currentState = nextState

  notifier.publish(nextState)
}

/** returns the current state of the store */
export const getState = () => currentState

/** dispatches a reducer to resolved a new state */
export const dispatch = (reducer: IReducer) => {
  queue.splice(0, 0, reducer)

  if (!isEnqueued) {
    isEnqueued = true
    setTimeout(resolveState, interval)
  }
}

export const { subscribe, unsubscribe } = notifier
