import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

const slider = new Slidy(list, { transition })

slider.init()
slider.slide = jest.fn()

describe('slide', () => {
  test('next', () => {
    slider.slideNext('click')

    expect(slider.slide).toHaveBeenCalledWith({
      move: 'next',
      trigger: 'click',
    })
  })

  test('prev', () => {
    slider.slidePrev('click')

    expect(slider.slide).toHaveBeenCalledWith({
      move: 'prev',
      trigger: 'click',
    })
  })

  test('to', () => {
    slider.slideTo(1, 'click')

    expect(slider.slide).toHaveBeenCalledWith({
      move: 'to',
      trigger: 'click',
      index: 1,
      animate: true,
    })
  })
})
