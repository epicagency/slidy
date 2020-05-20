import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

describe('default nav', () => {
  test('DOM', () => {
    const slider = new Slidy(list, { pagination: true, transition })

    slider.init()

    const { outer } = slider

    expect(outer.children.length).toBe(2)

    const pagination = outer.lastElementChild
    const [current, sep, total] = pagination.children

    expect(pagination.classList.contains('slidy-pagination')).toBeTruthy()
    expect(pagination.children.length).toBe(3)

    expect(current.classList.contains('slidy-pagination__current')).toBeTruthy()
    expect(current.textContent).toBe('1')

    expect(sep.classList.contains('slidy-pagination__separator')).toBeTruthy()
    expect(sep.textContent).toBe('/')

    expect(total.classList.contains('slidy-pagination__total')).toBeTruthy()
    expect(total.textContent).toBe('5')
  })
})
