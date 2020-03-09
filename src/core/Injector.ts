import { Constructor, PlainObject } from './meta'

export type Scope = 'application' | 'session'

export type InjectionOptions = {
  name: string
  scope: Scope
}

export type Entry<K, V> = {
  k: K
  v: V
  e?: number
}

export default class Injector {
  private readonly container: Map<string, any>

  private constructor(container?: Map<string, any>) {
    this.container = container || new Map<string, any>()
  }

  static newInstance(container?: Map<string, any>) {
    return new Injector(container)
  }

  _getContainer() {
    return this.container
  }

  del(name: string) {
    const { container } = this
    container.delete(name)
  }

  get<T>(InjectedStoreClass: Constructor<T>, name: string, arg: PlainObject = {}): T {
    const { container } = this

    let instance: any

    instance = container.get(name)
    if (!instance) {
      instance = new InjectedStoreClass(arg)
      Object.keys(arg).forEach((key: string) => {
        instance[key] = arg[key]
      })
      container.set(name, instance)
    }
    return instance
  }
}
