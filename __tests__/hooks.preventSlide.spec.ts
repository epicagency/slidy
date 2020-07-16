/* eslint-disable @typescript-eslint/no-empty-function, no-empty-function */
import Slidy, { Action } from '../src'
import { list, transition } from '../__mocks__/basics'
import { Manager } from '../src/modules'

const slider = new Slidy(list, { transition })
const cbTrue = (action: Action, ctx: Manager) => {
  ctx.shouldPrevent = true
}
const cbFalse = (action: Action, ctx: Manager) => {
  ctx.shouldPrevent = false
}

describe('preventSlide', () => {
  test('prevent', () => {
    slider.on('preventSlide', cbTrue)
    slider.init()
    // eslint-disable-next-line dot-notation
    slider['_manager']['_play'] = jest.fn()

    slider.slideNext('click')

    // eslint-disable-next-line dot-notation
    expect(slider['_manager']['_play']).not.toHaveBeenCalled()
  })

  test('allow', () => {
    slider.off('preventSlide', cbTrue)
    slider.on('preventSlide', cbFalse)
    slider.init()
    // eslint-disable-next-line dot-notation
    slider['_manager']['_play'] = jest.fn()

    slider.slideNext('click')

    // eslint-disable-next-line dot-notation
    expect(slider['_manager']['_play']).toHaveBeenCalled()
  })

  test('complex prevent', () => {
    slider.off('preventSlide', cbFalse)
    slider.on('preventSlide', cbFalse)
    slider.on('preventSlide', cbTrue)
    slider.init()
    // eslint-disable-next-line dot-notation
    slider['_manager']['_play'] = jest.fn()

    slider.slideNext('click')

    // eslint-disable-next-line dot-notation
    expect(slider['_manager']['_play']).not.toHaveBeenCalled()
  })

  test('complex allow', () => {
    slider.off('preventSlide', cbFalse)
    slider.on('preventSlide', cbTrue)
    slider.on('preventSlide', cbFalse)
    slider.init()
    // eslint-disable-next-line dot-notation
    slider['_manager']['_play'] = jest.fn()

    slider.slideNext('click')

    // eslint-disable-next-line dot-notation
    expect(slider['_manager']['_play']).toHaveBeenCalled()
  })
})
