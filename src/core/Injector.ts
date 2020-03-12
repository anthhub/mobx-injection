import { Constructor, PlainObject } from './meta'

export type Scope = 'application' | 'session'

let cachedInjector: Injector

export const getInjector = () => {
  return cachedInjector || (cachedInjector = Injector.newInstance())
}

class Injector {
  private readonly appContainer = new Map()

  private readonly sessContainer = new Map()

  static newInstance() {
    return new Injector()
  }

  clearSession() {
    this.sessContainer.clear()
  }

  get<T>(
    InjectedStoreClass: Constructor<T>,
    scope: Scope = 'application',
    arg: PlainObject = {}
  ): T {
    let instance: any

    let container = scope === 'session' ? this.sessContainer : this.appContainer

    instance = container.get(InjectedStoreClass)
    if (!instance) {
      instance = new InjectedStoreClass(arg)
      Object.keys(arg).forEach((key: string) => {
        instance[key] = arg[key]
      })
      container.set(InjectedStoreClass, instance)
    }

    return instance
  }
}
