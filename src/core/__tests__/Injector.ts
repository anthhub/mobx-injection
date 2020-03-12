import { getInjector } from '../Injector'

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

    expect(new Klazz().name).toBe('Jack')
    expect(injector.get(Klazz, 'session', { name: 'Jerrey' }).name).toBe('Jerrey')
    expect(injector.get(Klazz, 'session', { name: 'Joker' }).name).toBe('Jerrey')
  })

  test('the application scope store should be a singleton', () => {
    expect(injector.get(Clazz)).toBe(injector.get(Clazz))
  })

  test('the session scope store should be a singleton only when ref is destroyed', () => {
    const store = injector.get(Clazz, 'session')
    const store1 = injector.get(Clazz, 'session')
    expect(store).toBe(store1)

    injector.clearSession()

    const store2 = injector.get(Clazz, 'session')

    expect(store2).not.toBe(store1)
    expect(store2).not.toBe(store)
  })
})
