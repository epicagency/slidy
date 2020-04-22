/* eslint-disable @typescript-eslint/no-empty-function, no-empty-function */
import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'
import { tick, infos } from './utils'

const slider = new Slidy(list, { transition })

let c = 0
let n = 1

describe('hooks', () => {
  test('init', async () => {
    const bi = jest.fn()
    const ai = jest.fn()
    const bs = jest.fn()
    const as = jest.fn()

    slider.on('beforeInit', bi)
    slider.on('afterInit', ai)
    slider.on('beforeSlide', bs)
    slider.on('afterSlide', as)
    slider.init()

    const { el } = slider

    expect(bi).toHaveBeenCalledWith(el)
    expect(ai).toHaveBeenCalledWith(el)

    slider.slideNext('click')

    await tick()

    expect(bs).toHaveBeenCalledWith(infos(c, n), slider, null)
    expect(as).toHaveBeenCalledWith(infos(c, n), slider, null)

    slider.slideNext('click')
    c += 1
    n += 1

    await tick()

    expect(bs).toHaveBeenCalledWith(infos(c, n), slider, null)
    expect(as).toHaveBeenCalledWith(infos(c, n), slider, null)
  })
})
