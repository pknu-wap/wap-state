import type { ExtractState, StoreApi, WithReact } from './types';
import { useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

export function useStore<S extends WithReact<StoreApi<unknown>>>(
  api: S,
): ExtractState<S>;

export function useStore<S extends WithReact<StoreApi<unknown>>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean,
): U;

export function useStore<TState, StateSlice>(
  api: WithReact<StoreApi<TState>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn,
  );

  // useDebugValue는 React DevTools에서 해당 값이 어떤 의미를 가지는지 표시해줍니다.
  useDebugValue(slice);
  return slice;
}
