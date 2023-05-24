import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type { ExtractState, StoreApi } from './types';
import { shallowEqual } from './shallowEqual';

// 이 경우는 selector가 없는 경우
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

  if (!selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useSyncExternalStore(subscribe, getState, getState);

    return state;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const state = useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getState,
    selector,
    isEqual ?? shallowEqual,
  );

  return state;
}
