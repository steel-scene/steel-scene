import { AnimationTargetOptions } from '../'
import { isArray, isObject, isString, toFloat } from './objects'
import { Dictionary } from '../types'
import { _, BOOLEAN, NUMBER} from './constants'
import { each } from './lists'

const htmlTest = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/
const slice = Array.prototype.slice

const propertyTypes = {
  default: BOOLEAN,
  duration: NUMBER
}

export const createElement = (tagName: string, innerHtml?: string): Element => {
  const $el = document.createElement(tagName)
  if (innerHtml) {
    $el.innerHTML = innerHtml
  }
  return $el
}

export const convertFromAttributeValue = (name: string, value: any): any => {
  const type = propertyTypes[name]
  if (type === BOOLEAN) {
    return true
  }
  if (type === NUMBER) {
    return toFloat(value)
  }
  return value
}

export const convertToAttributeValue = (name: string, value: any): any => {
  const type = propertyTypes[name]
  if (type === BOOLEAN) {
    return value === true ? '' : _
  }
  if (type === NUMBER) {
    return value !== _ ? value.toString() : _
  }
  return value
}

/**
 * read a single attribute
 */
export const getAttribute = (el: Element, prop: string): string => {
  return convertFromAttributeValue(prop, el.getAttribute(prop))
}

/**
 * read all attribute pairs into a regular dictionary
 */
export const getAttributes = (el: Element, whitelist?: string[]): Dictionary<any> => {
  const hasWhitelist = whitelist && whitelist.length
  const result = {}
  each(el.attributes, att => {
    if (hasWhitelist && whitelist!.indexOf(att.name) === -1) {
      return
    }
    result[att.name] = convertFromAttributeValue(att.name, att.value)
  })
  return result
}

export const appendElement = (parent: Element, child: Element): void => {
  parent.appendChild(child)
}

export const findElements = (selector: string, parent?: Element): Element[] => {
  if (!parent) {
    const resolvedElement = resolveElement(selector, false)
    if (resolvedElement) {
      return [resolvedElement]
    }
  }
  return slice.call(parent!.querySelectorAll(selector))
}

export const isElement = (el: any): boolean => {
  return el && isString(el.tagName)
}

export function resolveElement(elOrSelector: Element | string, throwIfFalse?: boolean) {
  if (isElement(elOrSelector)) {
    return elOrSelector as Element
  }
  if (htmlTest.test(elOrSelector as string)) {
    return createElement('div', elOrSelector as string)
  }
  const el = document.querySelector(elOrSelector as string) || _
  if (throwIfFalse && !el) {
    throw 'element not found'
  }
  return el
};

export function getTargets(targets: AnimationTargetOptions): (Element | {})[] {
    if (isString(targets)) {
        // if query selector, search for elements
        return slice.call(document.querySelectorAll(targets as string))
    }
    if (isElement(targets)) {
        // if a single element, wrap in array
        return [ targets ] as Element[]
    }
    if (isArray(targets)) {
        // if array or jQuery object, flatten to an array
      const elements: Element[] = []
      for (let i = 0, len = (targets as any[]).length; i < len; i++) {
        const target = targets[i]
        const innerElements = getTargets(target)
        elements.push.apply(elements, innerElements)
      }
      return elements
    }
    if (isObject(targets)) {
        // if it is an actual object at this point, handle it
        return [ targets ] as {}[]
    }

    // otherwise return empty
    return []
}
