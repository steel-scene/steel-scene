import { ActionType } from './actions'
import { ITargetOptions, ISteelAction, ISteelState } from '../types'
import { elementToTarget } from '../internal/importer'
import { _, assign, isElement, isString, resolveElement, SELECT, STATES } from '../utils'

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

  store.targets[action.id] = assign(store.targets[action.id], _, {
    currentState: 'initial',
    props: assign({}, targetAttributeBlackList, options as ITargetOptions),
    states: (options && options[STATES]) || {},
    targets: []
  })

  return store
}

export const loadTarget = (id: string, options: ITargetOptions | string | Element): ILoadTargetAction => {
  return { options, id, type: ActionType.LOAD_TARGET }
}

