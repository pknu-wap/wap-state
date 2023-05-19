import { useCallback, useSyncExternalStore } from 'react';
import { isDraftable, produce, type Draft } from 'immer';

type Fn = () => void;
type UpdateFn<T> = (state: T) => T;

export type ActionRecord<T> = Record<
  string,
  (...params: any[]) => T | Draft<T> | void
>;
type Action<T, A> = A extends ActionRecord<T> ? A : never;
export type Actions<T, A> = (prevState: Draft<T> | T) => Action<T, A>;

const isUpdateFn = <T>(value: any): value is UpdateFn<T> =>
  typeof value === 'function';

export type StoreInstance<T, A> = {
  initialState: T;
  setState: (update: UpdateFn<T> | T) => void;
  getState: () => T;
  subscribe: (listener: Fn) => void;
  actions: Action<T, A> | null;
};

export const createStore = <T, A>(
  initialState: T,
  createActions?: Actions<T, A>,
): StoreInstance<T, A> => {
  let state = initialState;
  const listeners = new Set<Fn>();

  const getState = () => state;
  const setState = (update: UpdateFn<T> | T) => {
    state = isUpdateFn<T>(update) ? update(state) : update;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: Fn) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const actions = (() => {
    if (!createActions) return null;
    type ActionKey = keyof Action<T, A>;
    const record = createActions(initialState);
    const keys = Object.keys(record) as ActionKey[];
    keys.forEach((key) => {
      record[key] = ((...params: any[]) => {
        setState((prevState) => {
          if (!isDraftable(prevState)) {
            const action = createActions(prevState)[key];
            const next = action(...params);
            return next as any;
          }
          const produced = produce(prevState, (draft) => {
            const action = createActions(draft)[key];
            const result = action(...params);
            if (result !== undefined) {
              return result as Draft<T>;
            }
          });
          return produced;
        });
      }) as Action<T, A>[ActionKey];
    });
    return record;
  })();

  return {
    initialState,
    getState,
    setState,
    subscribe,
    actions,
  };
};

export function useStore<T>(store: StoreInstance<T, any>);
export function useStore<T>(
  store: {
    getState: () => T;
    subscribe: (listener: Fn) => () => void;
  },
  selector: (state: T) => T,
) {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
  );
}
