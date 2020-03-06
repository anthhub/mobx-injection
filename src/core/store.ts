import { storeScopeTypeSymbol } from './meta'
import { ScopeString } from './Injector'

export default (scope: ScopeString, options?: any) => (target: any) => {
  target[storeScopeTypeSymbol] = scope
  return target
}
