import { getInjector, hasUsedMap } from '../instantiate'

describe('Injector instantiate', () => {
  describe('hasUsedMap', () => {
    test('should be Map instance', () => {
      expect(hasUsedMap instanceof Map).toBeTruthy()
    })
  })

  describe('getInjector', () => {
    test('Injector should be singleton', () => {
      expect(getInjector()).toEqual(getInjector())
    })
  })
})
