import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

type El = HTMLElement | HTMLElement[]
const slider = new Slidy(list, {
  transition,
  controls: true,
  nav: true,
  pagination: true,
})
const hasClass = (el: El, name: string) => {
  const items = Array.isArray(el) ? el : [el]

  return items.every(i => i.classList.contains(name))
}

slider.init()

describe('destroy', () => {
  test('works', () => {
    const { el, items, outer } = slider

    expect(hasClass(el.parentNode as HTMLElement, 'slidy-outer')).toBeTruthy()
    expect(el.parentNode).toBe(outer)

    expect(hasClass(el, 'slidy')).toBeTruthy()

    expect(hasClass(items, 'slidy__item')).toBeTruthy()

    slider.destroy()

    expect(hasClass(el.parentNode as HTMLElement, 'slidy-outer')).toBeFalsy()
    expect(el.parentNode).not.toBe(outer)

    expect(hasClass(el, 'slidy')).toBeFalsy()
    expect(el.hasAttribute('role')).toBeFalsy()
    expect(el.hasAttribute('aria-valuemin')).toBeFalsy()
    expect(el.hasAttribute('aria-valuemax')).toBeFalsy()
    expect(el.hasAttribute('aria-valuenow')).toBeFalsy()

    expect(hasClass(items, 'slidy__item')).toBeFalsy()
    expect(hasClass(items, 'is-active')).toBeFalsy()
  })
})
