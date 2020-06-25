import Slidy, { Options } from '../src'
import { list, transition } from '../__mocks__/basics'

describe('init', () => {
  test('with errors', () => {
    global.console.error = jest.fn()

    const slider = new Slidy(list, {} as Options)
    const { items } = slider

    slider.init()

    expect(global.console.error).toHaveBeenCalledTimes(2)
    expect(items).toBeUndefined()
  })

  test('DOM', () => {
    const i = 2
    const slider = new Slidy(list, { index: i, transition })
    const beforeInit = jest.fn()
    const beforeInit2 = jest.fn()
    const afterInit = jest.fn()

    slider.on('beforeInit', beforeInit)
    slider.on('beforeInit', beforeInit2)
    slider.on('afterInit', afterInit)
    slider.init()

    const { el, items, outer, itemsMax, groupsMax } = slider

    expect(el).toBe(list)
    expect(items).toEqual(expect.arrayContaining(Array.from(list.children)))
    expect(outer).toBe(list.parentNode)

    expect(outer.classList.contains('slidy-outer')).toBeTruthy()
    expect(el.classList.contains('slidy')).toBeTruthy()
    expect(items[0].classList.contains('slidy__item')).toBeTruthy()
    expect(items[i].classList.contains('is-active')).toBeTruthy()
    expect(el.style.cursor).toBe('pointer')

    expect(el.getAttribute('role')).toBe('slider')
    expect(el.getAttribute('aria-valuemin')).toBe('1')
    expect(el.getAttribute('aria-valuemax')).toBe(
      list.children.length.toString()
    )
    expect(el.getAttribute('aria-valuenow')).toBe((i + 1).toString())

    expect(beforeInit).toHaveBeenCalledWith(el)
    expect(beforeInit2).toHaveBeenCalledWith(el)
    expect(afterInit).toHaveBeenCalledWith(el)

    expect(itemsMax).toBe(list.children.length)
    expect(groupsMax).toBe(list.children.length)
  })
})
