/* eslint-disable @typescript-eslint/ban-types */
import { HooksNames } from '../defs'

export class Hooks {
  private _callbacksByName: Map<HooksNames, Set<Function>> = new Map()

  public add(name: HooksNames, cb: Function): void {
    const callbacks = this._callbacksByName.has(name)
      ? this._callbacksByName.get(name)
      : new Set<Function>()

    callbacks.add(cb)
    this._callbacksByName.set(name, callbacks)
  }

  public remove(name: HooksNames, cb: Function): void {
    if (!this._callbacksByName.has(name)) {
      return
    }

    const callbacks = this._callbacksByName.get(name)

    callbacks.delete(cb)

    if (callbacks.size === 0) {
      this._callbacksByName.delete(name)
    } else {
      this._callbacksByName.set(name, callbacks)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public call(name: HooksNames, ctx: any, ...args: any[]): void {
    if (!this._callbacksByName.has(name)) {
      return
    }

    const callbacks = this._callbacksByName.get(name)

    callbacks.forEach(cb => {
      cb.call(ctx, ...args)
    })
  }
}
