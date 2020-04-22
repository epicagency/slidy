import { TransitionInfos } from '../src/defs'

export const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 0)
  })

export const infos = (
  c = 0,
  n = 1,
  opts: TransitionInfos = {} as TransitionInfos
) => ({
  animate: true,
  direction: 'next',
  trigger: 'click',
  currentIndex: c,
  currentGroup: c,
  newIndex: n,
  newGroup: n,
  ...opts,
})
