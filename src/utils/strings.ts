const camelCaseRegex = /([a-z])[- ]([a-z])/ig

const camelCaseReplacer = (match: string, p1: string, p2: string) =>  p1 + p2.toUpperCase()

export const toCamelCase = (value: string) => typeof value === 'string'
  ? (value as string).replace(camelCaseRegex, camelCaseReplacer)
  : ''
