import { LOAD_TARGET } from './actions'
import { ITargetOptions, ISteelAction, ISteelState } from '../types'
import { elementToTarget } from '../internal/importer'
import { assign, isElement, isString, resolveElement, INITIAL, SELECT, STATES, getTargets } from '../utils'

const targetAttributeBlackList = [STATES, SELECT]

export interface ILoadTargetAction extends ISteelAction {
  id: string
  options: ITargetOptions | string | Element
}

export const onLoadTarget = (store: ISteelState, action: ILoadTargetAction) => {
  let options = action.options as ITargetOptions | string | Element
  if (isString(options) || isElement(options)) {
    const element = resolveElement(options as (string | Element), true)
    options = elementToTarget(element)
  }

  const targetOptions = (options || {}) as ITargetOptions

  store.targets[action.id] = {
    currentState: INITIAL,
    props: assign({}, targetAttributeBlackList, targetOptions),
    states: targetOptions.states || {},
    targets: targetOptions.select ? getTargets(targetOptions.select) : []
  }

  return store
}

export const loadTarget = (id: string, options: ITargetOptions | string | Element): ILoadTargetAction => {
  return { options, id, type: LOAD_TARGET }
}
