import { Type } from '@nestjs/common'

let currentId = 0
const objectIdMap = new WeakMap<object, string>()

export function nextId(): string {
  return (currentId++).toString()
}

export function objectSerializer(o: object): string {
  const cached = objectIdMap.get(o)

  if (cached !== undefined) {
    return cached
  }
  const id = nextId()

  objectIdMap.set(o, id)

  return id
}

export function namedClass<C extends Type<{}>>(base: C, name: string): C {
  const m = {
    [name]: class extends base {},
  }
  return m[name]
}

export function generateNamedClass<C extends Type<{}>>(
  base: C,
  prefix: string = '',
): C {
  return namedClass(base, `${prefix}${nextId()}`)
}
