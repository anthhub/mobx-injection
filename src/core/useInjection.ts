/* eslint-disable react-hooks/exhaustive-deps */

import { Constructor, storeScopeTypeSymbol } from './meta'
import { useEffect, useRef, useMemo } from 'react'
import { getHashedName, flatten, isFunction } from '../utils'
import { getInjector, hasUsedMap } from './instantiate'
import { Scope } from './Injector'

export default function<T>(this: any, InjectedStoreClass: Constructor<T>, ...args: any[]) {
  const firstRef = useRef(false)

  let constructorParams = args

  // if the first argument is a function, we can initialize it with the invoker instance `this`
  if (isFunction(args[0])) {
    constructorParams = flatten([args[0].call(this, this)])
  }

  const injector = getInjector()

  const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol] || 'application'
  const name = getHashedName(InjectedStoreClass.toString())

  const store = useMemo(
    () => injector.get(InjectedStoreClass, { scope, name }, ...constructorParams),
    [InjectedStoreClass, constructorParams, injector, name, scope]
  )

  useEffect(() => {
    // 第一次注入
    if (!hasUsedMap.get(name)) {
      hasUsedMap.set(name, true)
      firstRef.current = true
    }
    return () => {
      // 只有 application 不需要注销流程
      if (scope === 'application') {
        return
      }

      // 第一次注入的组件最后注销掉store
      if (firstRef.current) {
        firstRef.current = false
        hasUsedMap.set(name, false)

        // 调用销毁方法
        const __destroy = (store as any).__destroy

        if (__destroy && isFunction(__destroy)) {
          __destroy()
        }

        injector.del(name)
        console.log('%c%s', 'color: #ac49da', `${name} has be destroyed`)
      }
    }
  }, [])

  return store
}
