import 'reflect-metadata'

import { Constructor, storeScopeTypeSymbol, storesQueueSymbol, PlainObject } from '../core/meta'
import { Scope, getInjector, storeCreaterMap } from '../core/Injector'

const injector = getInjector()

export default <T>(
  InjectedStoreClass?: Constructor<T>,
  args: ((props: any) => PlainObject) | PlainObject = {}
): any =>
  function(this: any, target: any, property: string) {
    const selfScope = target[storeScopeTypeSymbol]

    if (selfScope && selfScope === 'session') {
      throw Error(`session store forbid to be inject into session store!`)
    }

    if (!InjectedStoreClass) {
      InjectedStoreClass = Reflect.getMetadata('design:type', target, property)
    }

    // tslint:disable-next-line: no-unnecessary-type-assertion
    const clazz = InjectedStoreClass as any

    if (target instanceof clazz) {
      throw Error(`injection decorator can't be use to self!`)
    }

    const propertySymbol = Symbol(property)
    const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol]

    return {
      enumerable: true,
      configurable: true,
      get(this: any) {
        if (!this[propertySymbol]) {
          if (!storeCreaterMap.get(clazz)) {
            const selfRef = {}

            storeCreaterMap.set(clazz, selfRef)

            const storesQueue = this[storesQueueSymbol] || []
            storesQueue.push({ InjectedStoreClass, scope, selfRef })
            this[storesQueueSymbol] = storesQueue
          }

          let params = args

          if (typeof args === 'function') {
            params = args(this)
          }

          const store = injector.get(clazz, scope, params)
          this[propertySymbol] = store

          // 加入到组件队列中
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
