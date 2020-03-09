import { hashCode, isFunction, flatten, getClassHashName } from '../index'

describe('utils functions', () => {
  describe('isFunction', () => {
    test('should validate fuction', () => {
      expect(isFunction(() => 1)).toBeTruthy()
      expect(isFunction(Object)).toBeTruthy()
      expect(isFunction(Date)).toBeTruthy()

      expect(isFunction(new Date())).toBeFalsy()
      expect(isFunction({})).toBeFalsy()
      expect(isFunction([])).toBeFalsy()
    })
  })

  describe('flatten', () => {
    test('should flatten array to 1 dimensional array ever', () => {
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
      expect(flatten([[1], [2], 3])).toEqual([1, 2, 3])
      expect(flatten([[[1]], [2], 3])).toEqual([1, 2, 3])
    })
  })

  describe('hashCode', () => {
    test('should generate unique hashCode for unique string', () => {
      expect(hashCode(``)).toBe(hashCode(``))
      expect(hashCode(`   `)).not.toBe(hashCode(``))
      expect(hashCode(`123`)).not.toBe(hashCode(`124`))
    })
  })

  describe('getClassHashName', () => {
    test(`should get a string spliced by class name and it's hashCode`, () => {
      class A {}
      expect(getClassHashName(A.toString()).includes('A')).toBeTruthy()
      expect(
        getClassHashName(A.toString())
          .split('A')
          .join('')
      ).toBe(String(hashCode(A.toString())))
    })
  })
})
