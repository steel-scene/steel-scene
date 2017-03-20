import { head } from '../utils/lists'
import { getAttributes, isElement, resolveElement } from '../utils/elements'
import { guid } from '../utils/guid'
import { assign, isString } from '../utils/objects'
import { _, DEFAULT, DURATION, EASING, NAME } from '../utils/constants'
import { missingArg } from '../utils/errors'

const transitionAttributeWhitelist = [DEFAULT, DURATION, EASING, NAME]
const _transitions: Transition[] = []

export const elementToTransition = (el: Element): ITransitionOptions => {
  return getAttributes(el, transitionAttributeWhitelist)
}

export class Transition {
  readonly id: string = guid()

  name: string
  duration: number
  easing: string

  constructor(name: string) {
    const self = this;
    self.name = name || self.id
  }

  load(options: Element | string | ITransitionOptions): this {
    const self = this
    if (!options) {
      throw missingArg('json')
    }

    if (isString(options) || isElement(options)) {
      options = elementToTransition(
        resolveElement(
          options as (string | Element),
          true
        )
      )
    }

    return assign(self, _, options)
  }
}

export interface ITransitionOptions {
  default?: boolean
  name?: string
  duration?: number
  easing?: string
}

export function transition(name?: string, options?: Element | string | ITransitionOptions): Transition {
    // if transition has a name try to locate an existing scene
    let t: Transition = name ? head(_transitions, t2 => t2.name === name) : _
    if (!t) {
      t = new Transition(name)
      _transitions.push(t)
    }
    if (options) {
      t.load(options)
    }
    return t
}
