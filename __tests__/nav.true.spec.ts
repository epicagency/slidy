import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

describe('default nav', () => {
  test('DOM', () => {
    const slider = new Slidy(list, { nav: true, transition })

    slider.init()

    const { outer } = slider

    expect(outer.children.length).toBe(2)

    const nav = outer.lastElementChild

    expect(nav.classList.contains('slidy-nav')).toBeTruthy()
    expect(nav.children.length).toBe(5)
    expect(
      nav.firstElementChild.classList.contains('slidy-nav__item')
    ).toBeTruthy()
  })
})
