import 'reflect-metadata'

import { getInjector } from '../instantiate'
import { Constructor, storeScopeTypeSymbol, storesQueueSymbol } from '../meta'
import { Scope } from '../Injector'

import { getHashedName, isFunction, flatten } from '../../utils'

export default <T>(InjectedStoreClass?: Constructor<T>, ...args: any[]): any =>
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

    let constructorParams = args

    // if the first argument is a function, we can initialize it with the invoker instance `this`
    if (isFunction(args[0])) {
      constructorParams = flatten([args[0].call(this, this)])
    }

    const propertySymbol = Symbol(property)

    const injector = getInjector()

    const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol] || 'application'

    const name = getHashedName(InjectedStoreClass.toString())

    return {
      enumerable: true,
      configurable: true,
      get(this: any) {
        if (!this[propertySymbol]) {
          const store = injector.get(
            InjectedStoreClass as any,
            { scope, name },
            ...constructorParams
          )
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
