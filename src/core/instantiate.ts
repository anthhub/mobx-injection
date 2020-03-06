import Injector from './Injector'

export const hasUsedMap = new Map()

let cachedInjector: Injector

export function getInjector() {
  return cachedInjector || (cachedInjector = Injector.newInstance())
}

export function setInjector(newInjector: Injector) {
  cachedInjector = newInjector
}
