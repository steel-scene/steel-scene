import { Dictionary, IAnimationEngine, ISetOperation, ITargetTimeline } from '../types'

let engine: IAnimationEngine

let timelineEnqueued = false
let timelineQueue: Dictionary<ITargetTimeline> = {}

let setEnqueued = false
let setQueue: ISetOperation[]

const scheduleTweens = () => {
  const nextTweens = timelineQueue
  const tweens: ITargetTimeline[] = []

  for (const id in nextTweens) {
    const tween = nextTweens[id]

    // make sure it isn't undefined
    if (tween) {
      // add tween to list of tweens to be processed
      tweens.push(tween)
    }
  }

  timelineQueue = {}
  timelineEnqueued = false

  if (tweens.length) {
    engine.transition(tweens)
  }
}

const scheduleOperations = () => {
  const operations = setQueue
  setQueue = []
  setEnqueued = false

  engine.set(operations)
}

export const setEngine = (animationEngine: IAnimationEngine) => {
  engine = animationEngine
}

export const queueTransition = (tween: ITargetTimeline) => {
  timelineQueue[tween.targetId] = tween

  // enqueue tweens to be sent to animation engine
  if (!timelineEnqueued) {
    setTimeout(scheduleTweens, 16)
    timelineEnqueued = true
  }
}

export const queueSet = (operation: ISetOperation) => {
  setQueue.push(operation)

  // enqueue tweens to be sent to animation engine
  if (!setEnqueued) {
    setTimeout(scheduleOperations, 0)
    setEnqueued = true
  }
}
