import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type { ExtractState, StoreApi } from './types';

export function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>;

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  isEqual?: (a: U, b: U) => boolean,
): U;

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: TState) => StateSlice = api.getState as any,
  isEqual?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const { getState, subscribe, getServerState } = api;

  const state = useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getServerState || getState,
    selector,
    isEqual,
  );

  return state;
}
