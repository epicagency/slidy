import Slidy from '../src'
import { list, transition } from '../__mocks__/basics'

describe('new', () => {
  test('error without element', () => {
    global.console.error = jest.fn()

    const slider = new Slidy('.unknown', { transition })

    // eslint-disable-next-line dot-notation
    expect(slider['_hasErrors']).toBeTruthy()
    expect(global.console.error).toHaveBeenCalled()
  })

  test('warning wit multiple elements', () => {
    global.console.warn = jest.fn()

    const slider = new Slidy('li', { transition })
    const { el } = slider

    expect(el).toBe(list.children[0])
    expect(global.console.warn).toHaveBeenCalled()
  })

  test('error without transition', () => {
    global.console.error = jest.fn()

    const slider = new Slidy(list, {})

    // eslint-disable-next-line dot-notation
    expect(slider['_hasErrors']).toBeTruthy()
    expect(global.console.error).toHaveBeenCalled()
  })

  test('new', () => {
    const slider = new Slidy(list, { transition })

    const {
      el,
      context,
      data,
      currentIndex,
      newIndex,
      group,
      currentGroup,
      newGroup,
    } = slider

    expect(el).toBe(list)
    expect(context).toBeNull()
    expect(data).toBeNull()
    expect(currentIndex).toBe(0)
    expect(newIndex).toBe(0)
    expect(group).toBe(1)
    expect(currentGroup).toBe(0)
    expect(newGroup).toBe(0)
  })

  test('new with options', () => {
    const i = 2
    const g = 2
    const c = 1
    const ctx = 'context'
    const d = 'data'
    const slider = new Slidy(
      list,
      { transition, index: i, group: () => g },
      ctx,
      d
    )

    const {
      el,
      context,
      data,
      currentIndex,
      newIndex,
      group,
      currentGroup,
      newGroup,
    } = slider

    expect(el).toBe(list)
    expect(context).toBe(ctx)
    expect(data).toBe(d)
    expect(currentIndex).toBe(i)
    expect(newIndex).toBe(i)
    expect(group).toBe(g)
    expect(currentGroup).toBe(c)
    expect(newGroup).toBe(c)
  })
})

describe('getters', () => {
  test('options', () => {
    const slider = new Slidy(list, { transition })

    expect(slider.options.transition).toBe(transition)
  })

  test('namespace', () => {
    const namespace = 'ns'
    const slider = new Slidy(list, { namespace, transition })

    expect(slider.namespace).toBe(namespace)
  })
})
