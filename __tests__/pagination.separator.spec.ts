import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

describe('default nav', () => {
  test('DOM', () => {
    const slider = new Slidy(list, { pagination: '|', transition })

    slider.init()

    const { outer } = slider
    const pagination = outer.lastElementChild
    const [, sep] = pagination.children

    expect(sep.textContent).toBe('|')
  })
})
