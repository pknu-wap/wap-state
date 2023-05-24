export type Get<T, K, F> = K extends keyof T ? T[K] : F;
