import { storeScopeTypeSymbol } from '../../core/meta'
import { store } from '../..'

describe('store decorator', () => {
  test('the store class decorated should have a static storeScopeTypeSymbol property', () => {
    @store('application')
    class Klass {
      count = 1
    }

    @store()
    class Clazz {
      count = 1
    }
    @store('session')
    class Klazz {
      count = 1
    }

    expect((Klass as any)[storeScopeTypeSymbol]).toBe('application')
    expect((Clazz as any)[storeScopeTypeSymbol]).toBe('application')
    expect((Klazz as any)[storeScopeTypeSymbol]).toBe('session')
  })
})
