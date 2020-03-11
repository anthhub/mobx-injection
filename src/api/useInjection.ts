/* eslint-disable react-hooks/exhaustive-deps */

import { Constructor, PlainObject, storeScopeTypeSymbol } from '../core/meta'
import { useRef, useMemo, useEffect } from 'react'

import { Scope, storeCreaterMap, getInjector } from '../core/Injector'

const injector = getInjector()

export default <T>(
  InjectedStoreClass: Constructor<T>,
  args: (() => PlainObject) | PlainObject = {}
) => {
  const selfRef = useRef<any>({ timestamp: Date.now() })

  const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol]

  if (!storeCreaterMap.get(InjectedStoreClass)) {
    storeCreaterMap.set(InjectedStoreClass, selfRef.current)
  }

  const store = useMemo(() => {
    let params = args
    if (typeof args === 'function') {
      params = args()
    }

    return injector.get(InjectedStoreClass, scope, params)
  }, [])

  useEffect(
    () => () => {
      if (storeCreaterMap.get(InjectedStoreClass) === selfRef.current && scope === 'session') {
        storeCreaterMap.delete(InjectedStoreClass)
        selfRef.current = null
      }
    },
    []
  )

  return store
}
