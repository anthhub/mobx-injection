import { storeScopeTypeSymbol } from '../core/meta'
import { Scope } from '../core/Injector'

export default (scope: Scope = 'application') => <T>(target: T): T => {
  ;(target as any)[storeScopeTypeSymbol] = scope
  return target
}
