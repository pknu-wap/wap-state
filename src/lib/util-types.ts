/** 
 * @Get

interface User {
  name: string;
  age: number;
}

type NameType = Get<Person, 'name', null>; // string
type AgeType = Get<Person, 'age', null>; // number
type AddressType = Get<Person, 'address', null>; // null

 */
export type Get<T, K, F> = K extends keyof T ? T[K] : F;
