import { getInjector, storeCreaterMap } from '../Injector'

describe('Injector', () => {
  const injector = getInjector()

  class Clazz {
    count = 1
  }

  class Klazz {
    name = 'Jack'
  }

  test('the initial parameters should works and just works once', () => {
    expect(new Clazz().count).toBe(1)
    expect(injector.get(Clazz, 'application', { count: 100 }).count).toBe(100)
    expect(injector.get(Clazz, 'application', { count: 0 }).count).toBe(100)

    let ref: any = {}
    storeCreaterMap.set(Klazz, ref)
    expect(new Klazz().name).toBe('Jack')
    expect(injector.get(Klazz, 'session', { name: 'Jerrey' }).name).toBe('Jerrey')
    expect(injector.get(Klazz, 'session', { name: 'Joker' }).name).toBe('Jerrey')
  })

  test('the application scope store should be a singleton', () => {
    expect(injector.get(Clazz)).toEqual(injector.get(Clazz))
  })

  test('the session scope store should be a singleton only when ref is destroyed', () => {
    let ref: any = {}
    storeCreaterMap.set(Clazz, ref)
    expect(injector.get(Clazz, 'session')).toEqual(injector.get(Clazz, 'session'))
    storeCreaterMap.delete(Clazz)
    ref = null
  })
})
