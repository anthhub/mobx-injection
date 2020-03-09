import React from 'react'
import { storesQueueSymbol } from '../core/meta'

import { getInjector, hasUsedMap } from '../core/instantiate'
import { isFunction } from '../utils'

const injector = getInjector()

export default <T extends new (...args: any[]) => React.Component>(WrappedComponent: T) => {
  return class extends WrappedComponent {
    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }

      const stores: any[] = (this as any)[storesQueueSymbol] || []

      stores.forEach(({ name, firstRefSymbol }) => {
        if (!hasUsedMap.get(name)) {
          hasUsedMap.set(name, true)
          ;(this as any)[firstRefSymbol] = true
        }
      })
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }

      const stores: any[] = (this as any)[storesQueueSymbol] || []

      stores.forEach(({ name, store, firstRefSymbol, scope }) => {
        // 只有 application 不需要注销流程
        if (scope === 'application') {
          return
        }

        // 第一次注入的组件最后注销掉store
        if ((this as any)[firstRefSymbol]) {
          ;(this as any)[firstRefSymbol] = false
          hasUsedMap.set(name, false)

          // 调用销毁方法
          const __destroy = store.__destroy
          if (__destroy && isFunction(__destroy)) {
            __destroy()
          }

          injector.del(name)
          console.log('%c%s', 'color: #ac49da', `${name} has be destroyed`)
        }
      })
    }
  }
}
