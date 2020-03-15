/* eslint-disable react-hooks/exhaustive-deps */

import { Constructor, PlainObject, storeScopeTypeSymbol } from '../core/meta'

import { Scope, getInjector } from '../core/Injector'

const getInjection = <T>(
  InjectedStoreClass: Constructor<T>,
  args: (() => PlainObject) | PlainObject = {}
) => {
  const scope: Scope = (InjectedStoreClass as any)[storeScopeTypeSymbol]

  let params = args

  if (typeof args === 'function') {
    params = args()
  }
  const injector = getInjector()
  return injector.get(InjectedStoreClass, scope, params)
}

export default getInjection
