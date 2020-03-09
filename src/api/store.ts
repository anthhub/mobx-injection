import { storeScopeTypeSymbol } from '../core/meta'
import { Scope } from '../core/Injector'

export default (scope: Scope, options?: any) => (target: any) => {
  target[storeScopeTypeSymbol] = scope
  return target
}
