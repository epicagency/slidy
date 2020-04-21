import { debounce, format, parents, parseTpl, touchevents } from '../src/utils'

/**
 * Test Parents
 */

describe('parents', () => {
  const wrapper = document.createElement('div')
  const container = document.createElement('div')

  wrapper.appendChild(container)
  document.body.appendChild(wrapper)

  test('itself', () => {
    const target = document.createElement('div')

    target.setAttribute('class', 'jest-test')
    container.appendChild(target)

    expect(parents(target, 'jest-test')).toBe(target)
  })

  test('ancestor', () => {
    const target = document.createElement('div')

    wrapper.setAttribute('class', 'jest-test')
    container.appendChild(target)

    expect(parents(target, 'jest-test')).toBe(wrapper)
  })

  test('not available', () => {
    const target = document.createElement('div')

    wrapper.removeAttribute('class')
    container.appendChild(target)

    expect(parents(target, 'jest-test')).toBe(null)
  })
})

/**
 * Test touchevents
 */

describe('touchevents', () => {
  test('is false', () => {
    expect(touchevents()).toBeFalsy()
  })
  test('is true', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
    window.ontouchstart = () => {}

    expect(touchevents()).toBeTruthy()
  })
})

/**
 * Test Format
 */

describe('format', () => {
  test('is not needed', () => {
    expect(format(1, 9, true)).toBe('1')
  })

  test('is filled', () => {
    expect(format(1, 10, true)).toBe('01')
  })

  test('is not filled', () => {
    expect(format(1, 10, false)).toBe('1')
  })

  test('is forced', () => {
    expect(format(1, 10, 3)).toBe('001')
  })
})

/**
 * Test ParseTPL
 */

describe('parseTpl', () => {
  test('do nothing with missing value', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(parseTpl('foo-${bar}-baz', {})).toBe('foo-${bar}-baz')
  })

  test('use the fallback with missing value', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(parseTpl('foo-${bar}-baz', {}, '???')).toBe('foo-???-baz')
  })

  test('parse single value', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(parseTpl('foo-${bar}-baz', { bar: '!!!' })).toBe('foo-!!!-baz')
  })

  test('parse multiple values', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(parseTpl('foo-${bar}-baz-${qux}', { bar: '!!!', qux: '???' })).toBe(
      'foo-!!!-baz-???'
    )
  })
})

/**
 * Test Debounce
 */

describe('debounce', () => {
  function waitFor(fn: Function, delay: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        fn()
        resolve()
      }, delay)
    })
  }
  const delay = 10

  test('trigger once', async () => {
    const fn = jest.fn()
    const debounced = debounce(fn, delay)

    // No time to call our debounced function -> +0
    await waitFor(debounced, delay / 2)
    await waitFor(debounced, delay / 2)
    await waitFor(debounced, delay / 2)

    // Wait for debounce effect -> +1
    await new Promise(r => setTimeout(r, delay * 2))

    expect(fn).toHaveBeenCalledTimes(1) // -> = 1
  })

  test('trigger twice', async () => {
    const fn = jest.fn()
    const debounced = debounce(fn, delay)

    await waitFor(debounced, delay / 2)
    // Enough time to call our debounced function -> +1
    await waitFor(debounced, delay * 2)
    await waitFor(debounced, delay / 2)

    // Wait for debounce effect -> +1
    await new Promise(r => setTimeout(r, delay * 2))

    expect(fn).toHaveBeenCalledTimes(2) // -> = 2
  })
})
