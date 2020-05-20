import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'
import { tick } from './utils'

describe('default controls', () => {
  test('DOM', () => {
    const slider = new Slidy(list, { controls: true, transition })

    slider.init()

    const { outer } = slider

    expect(outer.children.length).toBe(2)

    const controls = outer.lastElementChild
    const [prev, next] = controls.children

    expect(controls.classList.contains('slidy-controls')).toBeTruthy()
    expect(controls.children.length).toBe(2)

    expect(prev.classList.contains('slidy-controls__item--prev')).toBeTruthy()
    expect(prev.textContent).toBe('<')

    expect(next.classList.contains('slidy-controls__item--next')).toBeTruthy()
    expect(next.textContent).toBe('>')
  })

  test('[dis/en]abled', async () => {
    const slider = new Slidy(list, { controls: true, loop: false, transition })

    slider.init()

    const { outer } = slider

    expect(outer.children.length).toBe(2)

    const controls = outer.lastElementChild
    const [prev, next] = (controls.children as unknown) as NodeListOf<
      HTMLButtonElement
    >

    expect(prev.disabled).toBeTruthy()
    expect(next.disabled).toBeFalsy()

    slider.slideTo(4, 'click')

    await tick()

    expect(prev.disabled).toBeFalsy()
    expect(next.disabled).toBeTruthy()
  })
})
