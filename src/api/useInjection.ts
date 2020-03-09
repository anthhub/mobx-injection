/* eslint-disable react-hooks/exhaustive-deps */

import { Constructor, PlainObject, storeScopeTypeSymbol } from '../core/meta'
import { useEffect, useRef, useMemo } from 'react'
import { getClassHashName } from '../utils'
import { getInjector, hasUsedMap } from '../core/instantiate'
import { Scope } from '../core/Injector'

const injector = getInjector()

export default <T>(
  InjectedStoreClass: Constructor<T>,
  arg: (() => PlainObject) | PlainObject = {}
) => {
  const firstRef = useRef(false)

  const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol] || 'application'
  const name = getClassHashName(InjectedStoreClass.toString())

  const store = useMemo(() => {
    let constructorParam = arg
    if (typeof arg === 'function') {
      constructorParam = arg()
    }

    return injector.get(InjectedStoreClass, name, constructorParam)
  }, [])

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

        if (__destroy && typeof __destroy === 'function') {
          __destroy()
        }

        injector.del(name)
        console.log('%c%s', 'color: #ac49da', `${name} has be destroyed`)
      }
    }
  }, [])

  return store
}
