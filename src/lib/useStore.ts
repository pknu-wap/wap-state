import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type { ExtractState, StoreApi } from './types';

export function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>;

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  compare?: (a: U, b: U) => boolean,
): U;

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: TState) => StateSlice = api.getState as any,
  compare?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const { getState, subscribe, getServerState } = api;

  if (!selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useSyncExternalStore(
      subscribe,
      getState,
      getServerState || getState,
    );
    return state;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const state = useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getServerState || getState,
    selector,
    compare,
  );

  return state;
}
