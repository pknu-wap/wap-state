// # useSyncExternalStore을 사용하는 이유!!
//
// concurrent feature에서 발생하는 tearing을 해결하기 위함이다.
// concurrent feature는 렌더링 도중 들어오는 유저 인터렉션에 대해 기존 렌더링을 중지하고 인터렉션에 대한 UI를 먼저 렌더링 한다.
// 그래서 기존 렌더링이 완료되지 않은 상태에서 새로운 렌더링이 시작되는데, 이 때 기존 렌더링이 완료되지 않은 상태에서 인터렉션에 대한 UI를 렌더링한다.
// useSyncExternalStore은 external state의 변경사항을 관찰하고 있다가 tearing이 발생하지 않도록 상태 변경이 관찰되면 다시 렌더링을 시작한다.

import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import type { ExtractState, StoreApi } from '../types';
import { shallowEqual } from '../lib/shallowEqual';

export function useStore<TState>(api: TState): ExtractState<TState>;

export function useStore<TState, U>(
  api: TState,
  selector: (state: ExtractState<TState>) => U,
  isEqual?: (obj1: U, obj2: U) => boolean,
): U;

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (state: TState) => StateSlice = api.getState as any,
  isEqual?: (obj1: StateSlice, obj2: StateSlice) => boolean,
) {
  const { getState, subscribe } = api;

  if (!selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const slice = useSyncExternalStore(subscribe, getState, getState);
    return slice;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const slice = useSyncExternalStoreWithSelector(
    subscribe,
    getState,
    getState, // getServerSnapshot,
    selector,
    isEqual ?? shallowEqual,
  );

  return slice;
}
