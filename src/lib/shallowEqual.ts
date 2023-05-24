export const shallowEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  )
    return false;

  // Compare Map
  const isMap1 = obj1 instanceof Map;
  const isMap2 = obj2 instanceof Map;

  if (isMap1 || isMap2) {
    if (!isMap1 || !isMap2 || obj1.size !== obj2.size) return false;

    for (const [key, value] of obj1) {
      if (!obj2.has(key) || obj2.get(key) !== value) return false;
    }

    return true;
  }

  // Compare Set
  const isSet1 = obj1 instanceof Set;
  const isSet2 = obj2 instanceof Set;

  if (isSet1 || isSet2) {
    if (!isSet1 || !isSet2 || obj1.size !== obj2.size) return false;

    for (const value of obj1) {
      if (!obj2.has(value)) return false;
    }

    return true;
  }

  // Compare Properties
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (
      !Object.prototype.hasOwnProperty.call(obj2, key as string) ||
      !Object.is(obj1[key as keyof T], obj2[key as keyof T])
    )
      return false;
  }

  return true;
};
