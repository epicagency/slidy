/* eslint-disable dot-notation */
import Slidy from '../src'
import { Controls } from '../src/modules/Controls'
import { Nav } from '../src/modules/Nav'
import { Pagination } from '../src/modules/Pagination'
import { list, transition } from '../__mocks__/basics'

const height = 100
const slider = new Slidy(list, {
  transition,
  click: false,
  controls: true,
  nav: true,
  pagination: true,
  height,
})

slider.init()

const { el } = slider

describe('options', () => {
  test('click', () => {
    expect(el.style.cursor).toBe('')
  })

  test('controls', () => {
    expect(slider['_controls']).toBeInstanceOf(Controls)
  })

  test('nav', () => {
    expect(slider['_nav']).toBeInstanceOf(Nav)
  })

  test('pagination', () => {
    expect(slider['_pagination']).toBeInstanceOf(Pagination)
  })

  test('height', () => {
    expect(el.style.height).toBe(`${height}px`)
  })
})
