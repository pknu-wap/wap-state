import type { Get } from './util-types';

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type SetStateInternal<T> = {
  updateFn(
    // ex) setState({ count: 1 }), setState((state) => state.count = 1)
    partial: T | Partial<T> | { _(state: T): T | Partial<T> }['_'],
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

// S에는 StoreApi<TState>가 들어온다.
export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  // const { count } = useCounterStore();
  // useCounterStore().count 등을 사용하기 위함.
  (): ExtractState<S>;

  // const { count } = useCounterStore((state) => state.count);를 사용하기 위함.
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean,
  ): U;
} & S; // '& S'를 붙이는 이유는 useCounterStore.getState(), .setState(), .subscribe()를 사용하기 위해서이다.
