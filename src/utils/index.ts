export const hashCode = (str: string) => {
  if (Array.prototype.reduce) {
    return str.split('').reduce(function(a, b) {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
  }
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const character = str.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export const getClassHashName = (classStr: string) => {
  const hash = hashCode(classStr)

  const [, name1] = classStr.match(/class\s*(\w*)\s*{/) || []

  const [, name2] = classStr.match(/function\s*([^(]*)\(/) || []

  return (name1 || name2 || '') + hash
}

export const isFunction = (fn: any) => {
  return typeof fn === 'function'
}

export const flatten = (arr: any[]) => {
  return arr.flat(Infinity)
}
