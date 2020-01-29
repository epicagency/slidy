import { parseTpl, zeroFill, debounce } from '../src/utils'

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

describe('zeroFill', () => {
  test('is filled', () => {
    expect(zeroFill(2, 1)).toBe('01')
  })

  test('is not filled', () => {
    expect(zeroFill(2, 11)).toBe('11')
  })
})

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
