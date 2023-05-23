// Person interface에서 key의 타입을 추출한다. K가 T에 없을 경우 F타입을 반환한다.
// ex) Get<Person, 'name', string> => string
//
// interface Person {
//   name: string;
//  age: number;
// }
export type Get<T, K, F> = K extends keyof T ? T[K] : F;
