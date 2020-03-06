import LRUCache from 'lru-cache'
import { Constructor } from './meta'

export enum Scope {
  Singleton = 'application',
  Session = 'session'
}

export type ScopeString = 'application' | 'session'

export type InjectionOptions = {
  name?: string
  scope: Scope
}

export type Snapshot = {
  [propName: string]: any
}

export type Entry<K, V> = {
  k: K
  v: V
  e?: number
}

export interface IContainer<K, V> {
  set(key: K, value: V): boolean

  get(key: K): V | undefined

  del(key: K): V | undefined

  dump(): Array<Entry<K, V>>

  keys(): Array<string>

  load(cacheEntries: ReadonlyArray<Entry<K, V>>): void
}

export default class Injector {
  private readonly container: IContainer<string, any>

  private constructor(container?: IContainer<string, any>) {
    this.container = container || new LRUCache<string, any>()
  }

  static newInstance(container?: IContainer<string, any>) {
    return new Injector(container)
  }

  _getContainer() {
    return this.container
  }

  del(name: string) {
    const { container } = this
    container.del(name)
  }

  get<T>(InjectedStoreClass: Constructor<T>, options: InjectionOptions, ...args: any[]): T {
    const { scope, name } = options
    const { container } = this

    let instance

    switch (scope) {
      // 全局单利
      case Scope.Singleton:
        if (name) {
          instance = container.get(name)
          if (!instance) {
            instance = new InjectedStoreClass(...args)
            // only application injection will be stored
            container.set(name, instance)
          }
          break
        }
        throw new SyntaxError('A application injection must have a name!')

      // 页面单例
      // 做法是其他和单例一样, 记住第一个调用者,当页面组件,销毁这个store也要随之销毁
      case Scope.Session:
        if (name) {
          instance = container.get(name)
          if (!instance) {
            instance = new InjectedStoreClass(...args)
            // only application injection will be stored
            container.set(name, instance)
          }
          break
        }
        throw new SyntaxError('A application injection must have a name!')

      default:
        throw new SyntaxError('You must set injected class as a mmlpx recognized model!')
    }

    return instance
  }
}
