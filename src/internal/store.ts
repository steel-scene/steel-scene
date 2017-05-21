import { IReducer, ISteelState } from '../types'
import { observe } from './observe'

// timespan to wait for additional reducers after a new reducers is received
const interval = 1000 / 60

// queue variables
let isEnqueued = false
let queue: IReducer<ISteelState>[] = []

const observer = {
  notify(obj: any, key: any, newVal: any, oldVal: any) {
    console.table([obj.key, newVal, oldVal])
  }
}

// initial state
let currentState: ISteelState = {
  scenes: {},
  targets: {}
}

observe(
  currentState,
  observer,
  () => console.log('changed')
)

// handles resolving new state from the queued reducers
const resolveState = () => {
  let nextState = currentState

  for (let i = queue.length - 1; i > -1; i--) {
    nextState = queue.pop()(nextState) || nextState
  }

  isEnqueued = false
  currentState = nextState
}

/** returns the current state of the store */
export const getState = () => currentState

/** dispatches a reducer to resolved a new state */
export const dispatch = (reducer: IReducer<ISteelState>) => {
  queue.splice(0, 0, reducer)

  if (!isEnqueued) {
    isEnqueued = true
    setTimeout(resolveState, interval)
  }
}
