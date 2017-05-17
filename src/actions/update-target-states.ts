import { Dictionary, ISteelState } from '../types'
import { assign, NAME, SELECT, STATES } from '../utils'

const targetBlackList = [STATES, SELECT, NAME]

export const updateTargetState = (id: string, stateName: string, props: Dictionary<any>) => {
  return (store: ISteelState) => {
    const target = store.targets[id]
    if (target) {
      target.states[stateName] = assign(target.states[stateName], targetBlackList, props)
    }
    return store
  }
}
