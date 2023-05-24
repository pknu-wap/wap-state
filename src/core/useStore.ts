import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type { ExtractState, StoreApi } from '../types';
import { shallowEqual } from '../lib/shallowEqual';

export function useStore<TState>(api: TState): ExtractState<TState>;

export function useStore<TState, U>(
  api: TState,
  selector: (state: ExtractState<TState>) => U,
  isEqual?: (a: U, b: U) => boolean,
): U;

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: TState) => StateSlice = api.getState as any,
  isEqual?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const { getState, subscribe } = api;

  if (!selector)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSyncExternalStore(subscribe, getState, getState);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getState,
    selector,
    isEqual ?? shallowEqual,
  );
}
