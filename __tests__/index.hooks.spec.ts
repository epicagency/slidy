/* eslint-disable @typescript-eslint/no-empty-function, no-empty-function */
import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

const slider = new Slidy(list, { transition })
const hookName = 'beforeInit'
const cb = jest.fn()

describe('hooks', () => {
  test('on', () => {
    slider.hooks.add = jest.fn()

    slider.on(hookName, cb)
    expect(slider.hooks.add).toHaveBeenCalledWith(hookName, cb)
  })

  test('off', () => {
    slider.hooks.remove = jest.fn()

    slider.off(hookName, cb)
    expect(slider.hooks.remove).toHaveBeenCalledWith(hookName, cb)
  })
})
