export const storeSymbol = Symbol('Store')
export const storeScopeTypeSymbol = Symbol('storeScopeType')
export const storesQueueSymbol = Symbol('storesQueue')

export type Constructor<T> = new (...args: any[]) => T
