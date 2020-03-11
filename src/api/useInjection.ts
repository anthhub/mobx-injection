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

  let params = args

  if (!storeCreaterMap.get(InjectedStoreClass)) {
    storeCreaterMap.set(InjectedStoreClass, selfRef.current)

    if (typeof args === 'function') {
      params = args()
    }
  }

  const store = injector.get(InjectedStoreClass, scope, params)

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
