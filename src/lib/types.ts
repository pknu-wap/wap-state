import { Get } from './util-types';
import type { Draft } from 'immer';

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type SetStateInternal<T> = {
  updateFn(
    partial: T | Partial<T> | ((state: Draft<T>) => void),
    replace?: boolean | undefined,
  ): void;
}['updateFn'];

export interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: () => T;
  subscribe: (listener: () => void) => () => void;
}

export type StateCreator<T> = (
  setState: Get<StoreApi<T>, 'setState', never>,
  getState: Get<StoreApi<T>, 'getState', never>,
) => T;

export type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'subscribe'>;

export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean,
  ): U;
} & S;
