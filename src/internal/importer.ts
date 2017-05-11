import { Dictionary, ISceneOptions, ITargetOptions } from '../types'
import { _, getAttributes, findElements, NAME, S_STATE, S_TARGET } from '../utils'

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

export const sceneElementToTargets = ($scene: Element): ITargetOptions[] => {
  return findElements(S_TARGET, $scene).map(elementToTarget)
}

export const elementToScene = ($scene: Element): ISceneOptions => {
  const sceneOptions = getAttributes($scene, _) as ISceneOptions
  sceneOptions.targets = sceneElementToTargets($scene)
  return sceneOptions
}
