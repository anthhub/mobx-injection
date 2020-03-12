/* eslint-disable react-hooks/exhaustive-deps */

import { Constructor, PlainObject, storeScopeTypeSymbol } from '../core/meta'
import { useMemo } from 'react'

import { Scope, getInjector } from '../core/Injector'
import { useLocation } from 'react-router-dom'

const useInjection = <T>(
  InjectedStoreClass: Constructor<T>,
  args: (() => PlainObject) | PlainObject = {}
) => {
  const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol]

  const { pathname = '' } = useLocation() || {}

  return useMemo(() => {
    let params = args

    if (typeof args === 'function') {
      params = args()
    }
    const injector = getInjector()
    return injector.get(InjectedStoreClass, scope, params)
  }, [pathname])
}

export default useInjection
