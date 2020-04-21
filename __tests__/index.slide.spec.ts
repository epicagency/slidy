import Slidy from '../src'
import { list } from '../__mocks__/basics'
import { tick } from './utils'
import { TransitionInfos } from '../src/defs'

const b = (i: TransitionInfos) => {
  console.info('BEFORE', i)
}

const t = (c: HTMLElement, n: HTMLElement, i: TransitionInfos) => {
  console.info('T', i)

  return Promise.resolve()
}

const a = (i: TransitionInfos) => {
  console.info('AFTER', i)
}

const slider = new Slidy(list, { transition: t })

slider.on('beforeSlide', b)
slider.on('afterSlide', a)
slider.init()

describe('slide', () => {
  test('fake', async () => {
    slider.slideNext('click')

    await tick()

    expect(slider.currentIndex).toBe(1)
  })
})
