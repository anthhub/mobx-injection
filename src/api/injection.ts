import 'reflect-metadata'

import { getInjector } from '../core/instantiate'
import { Constructor, storeScopeTypeSymbol, storesQueueSymbol, PlainObject } from '../core/meta'
import { Scope } from '../core/Injector'

import { getClassHashName } from '../utils'
const injector = getInjector()

export default <T>(
  InjectedStoreClass: Constructor<T>,
  arg: ((props: any) => PlainObject) | PlainObject = {}
): any =>
  function(this: any, target: any, property: string) {
    if (!InjectedStoreClass) {
      InjectedStoreClass = Reflect.getMetadata('design:type', target, property)
      /* istanbul ignore next */
      if (!InjectedStoreClass) {
        throw new SyntaxError(
          'You must pass a Class for injection while you are not using typescript!' +
            'Or you may need to add "emitDecoratorMetadata: true" configuration to your tsconfig.json'
        )
      }
    }

    let constructorParam = arg

    if (typeof arg === 'function') {
      constructorParam = arg(this)
    }

    const propertySymbol = Symbol(property)
    const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol] || 'application'
    const name = getClassHashName(InjectedStoreClass.toString())

    return {
      enumerable: true,
      configurable: true,
      get(this: any) {
        if (!this[propertySymbol]) {
          const store = injector.get(InjectedStoreClass, name, constructorParam)
          this[propertySymbol] = store
          // 加入到组件队列中

          let storesQueue = this[storesQueueSymbol]

          if (storesQueue && storesQueue.length) {
            storesQueue.push({ firstRefSymbol: Symbol(name), name, scope, store })
          } else {
            storesQueue = [{ name, scope, store }]
          }
          this[storesQueueSymbol] = storesQueue

          return store
        } else {
          return this[propertySymbol]
        }
      },
      // @formatter:off
      // tslint:disable-next-line
      set() {}
      // @formatter:on
    }
  }
