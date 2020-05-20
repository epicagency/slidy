import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

describe('templated controls', () => {
  test('DOM', () => {
    const slider = new Slidy(list, {
      // eslint-disable-next-line no-template-curly-in-string
      controls: '<div>${label}</div>',
      transition,
    })

    slider.init()

    const { outer } = slider
    const controls = outer.lastElementChild
    const [prev, next] = controls.children

    expect(prev.textContent).toBe('previous slide')
    expect(next.textContent).toBe('next slide')
  })
})
