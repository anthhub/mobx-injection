import Injector from '../Injector'
import { PlainObject } from '../meta'

describe('Injector', () => {
  const injector = Injector.newInstance()

  class Clazz {
    count = 1
  }

  test('the application scope store should be singleton', () => {
    const clazz1 = injector.get(Clazz, 'Clazz')
    const clazz2 = injector.get(Clazz, 'Clazz')
    expect(clazz1).toEqual(clazz2)
  })

  test('the initial parameters should works and just works once', () => {
    const clazz = new Clazz()
    expect(clazz.count).toBe(1)

    const clazz1 = injector.get(Clazz, 'Clazz', { count: 100 })
    expect(clazz1.count).toBe(100)
    const clazz2 = injector.get(Clazz, 'Clazz', { count: 0 })
    expect(clazz2.count).toBe(100)
  })
})
