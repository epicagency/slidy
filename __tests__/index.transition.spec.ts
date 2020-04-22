import Slidy from '../src'
import { list } from '../__mocks__/basics'
import { tick, infos } from './utils'
import { TransitionInfos } from '../src/defs'

const log = jest.fn()
const transition = (...args) =>
  new Promise(resolve => {
    log(...args)
    resolve()
  })

describe('transition', () => {
  test('single', async () => {
    const slider = new Slidy(list, { transition })

    slider.init()
    slider.slideNext('click')

    const { items } = slider

    await tick()

    expect(log).toHaveBeenCalledWith(items[0], items[1], infos(), slider, null)
  })

  test('group', async () => {
    const slider = new Slidy(list, { transition, group: () => 2 })

    slider.init()
    slider.slideNext('click')

    await tick()

    const { items } = slider

    expect(log).toHaveBeenCalledWith(
      items.slice(0, 2),
      items.slice(2, 4),
      infos(0, 1, { newIndex: 2, newGroup: 1 } as TransitionInfos),
      slider,
      null
    )
  })
})
