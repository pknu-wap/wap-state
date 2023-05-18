import { useCallback, useSyncExternalStore } from 'react';

type Listener = () => void;

export const createStore = <T>(initialState: T) => {
  let state = initialState;
  const getState = (): T => state;
  const listeners = new Set<Listener>();
  const setState = (fn: (state: T) => T) => {
    state = fn(state);
    listeners.forEach((l) => l());
  };
  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
};

export const useStore = <T>(
  store: { getState: () => T; subscribe: (listener: Listener) => () => void },
  selector: (state: T) => any,
) => {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
  );
};
