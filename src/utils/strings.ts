const camelCaseRegex = /([a-z])[- ]([a-z])/ig

const camelCaseReplacer = (match: string, p1: string, p2: string) =>  p1 + p2.toUpperCase()

export const toCamelCase = (value: string) => typeof value === 'string'
  ? (value as string).replace(camelCaseRegex, camelCaseReplacer)
  : ''

/** returns a unique identifier for this combination of state names */
export const getStateHash = (stateNames: string[]) => {
  // doing a join of all state names gives us a reliable way to detect if the state and the order of the statenames has changed.
  // nothing more complicated is needed at the moment. Hopefully people aren't using unicorns in their state names, but I wouldn't
  // fault them if they did
  return stateNames.join('💙🦄')
}

