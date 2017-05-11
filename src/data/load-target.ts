import { Dictionary, ITargetOptions, ISteelAction, ISteelState } from '../types'
import { _, assign, getAttributes, findElements, isElement, isString, NAME, resolveElement, S_STATE, SELECT, STATES } from '../utils'

const targetAttributeBlackList = [STATES, SELECT]

export const LOAD_TARGET = 'LOAD_TARGET'

export interface ILoadTargetAction extends ISteelAction<'LOAD_TARGET'> {
  id: string
  options: ITargetOptions | string | Element
}

export const elementToTarget = ($target: Element): ITargetOptions => {
  const states: Dictionary<any> = {}
  const elements = findElements(S_STATE, $target)
  for (let i = 0, ilen = elements.length; i < ilen; i++) {
    const attributes = getAttributes(elements[i], _)
    // tslint:disable-next-line:no-string-literal
    states[attributes[NAME]] = attributes
  }

  // read all "state" elements
  // assemble state elements and properties and to the list
  const props = getAttributes($target, _) as ITargetOptions
  props.states = states
  return props
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
  return { options, id, type: LOAD_TARGET }
}

