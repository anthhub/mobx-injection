export const storeSymbol = Symbol('store')
export const storeScopeTypeSymbol = Symbol('storeScopeType')

export type Constructor<T> = new (...args: any[]) => T

export type PlainObject = {
  [propName: string]: any
}
