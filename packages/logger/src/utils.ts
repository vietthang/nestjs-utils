let nextId = 0
const objectIdMap = new WeakMap<object, string>()

export function objectSerializer(o: object): string {
  const cached = objectIdMap.get(o)

  if (cached !== undefined) {
    return cached
  }
  const id = (nextId++).toString()

  objectIdMap.set(o, id)

  return id
}
