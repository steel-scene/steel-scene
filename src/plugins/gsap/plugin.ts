import { toCamelCase } from '../../utils'
import { IAnimationEngine, ISetOperation, ITargetTimeline } from '../../types'

declare const TimelineLite: any
declare const TweenLite: any
declare const EaseLookup: any

const ignoredProperties = ['name', 'easing']
const inProgress: { [key: number]: typeof TimelineLite } = {}

export const plugin: IAnimationEngine = {
  set(setOperations: ISetOperation[]): void {
    for (let i = 0, ilen = setOperations.length; i < ilen; i++) {
      const op = setOperations[i]
      for (let j = 0, jlen = op.targets.length; j < jlen; j++) {
        const target = op.targets[j]
        TweenLite.set(target, op.props)
      }
    }
  },
  transition(timelines: ITargetTimeline[]): void {
    for (let t = 0, tlen = timelines.length; t < tlen; t++) {
      const timeline = timelines[t]
      const id = timeline.targetId

      // cancel any in progress timelines
      let t1 = inProgress[id]
      if (t1) {
        t1.clear()
      }

      // create new timeline
      t1 = new TimelineLite({
        onComplete(): void {
          // remove timeline from in progress
          inProgress[id] = undefined
        },
        onUpdate() {
          // update state here
          // onStateChange
        }
      })

      let position = 0

      for (let a = 0, ilen = timeline.animations.length; a < ilen; a++) {
        const animation = timeline.animations[a]
        const { duration, easing, keyframes, stateName } = animation

        // convert to seconds from milliseconds for GSAP
        const durationInSeconds = +duration * 0.001

        // find gsap easing function
        const easingFn = EaseLookup.find(easing)

        for (let j = 0, jlen = timeline.targets.length; j < jlen; j++) {
          const target = timeline.targets[j]
          const toState = keyframes[keyframes.length - 1]

          const props = {
            onComplete: () => timeline.onStateChange(stateName)
          }

          if (easingFn) {
            // tslint:disable-next-line:no-string-literal
            props['ease'] = easingFn
          }

          for (let prop in toState) {
            if (ignoredProperties.indexOf(prop) === -1) {
              props[toCamelCase(prop)] = toState[prop]
            }
          }

          // todo: figure out how to approximate distance between from and to
          t1.to(target, durationInSeconds, props, position)
        }

        position += durationInSeconds
      }

      // add to list of playing timelines
      inProgress[id] = t1
      t1.play()
    }
  }
}
