// Person interface에서 key의 타입을 추출한다. 없으면 F 타입을 반환한다.
export type Get<T, K, F> = K extends keyof T ? T[K] : F;
