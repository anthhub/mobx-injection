import React from 'react'
import { storesQueueSymbol } from '../core/meta'

import { storeCreaterMap } from '../core/Injector'

export default <T extends new (...args: any[]) => React.Component>(WrappedComponent: T) => {
  return class extends WrappedComponent {
    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount()
      }

      const queue: any[] = (this as any)[storesQueueSymbol] || []

      queue.forEach(item => {
        const { InjectedStoreClass, scope, selfRef } = item
        if (storeCreaterMap.get(InjectedStoreClass) === selfRef && scope === 'session') {
          storeCreaterMap.delete(InjectedStoreClass)
          item.selfRef = null
        }
      })
    }
  }
}
