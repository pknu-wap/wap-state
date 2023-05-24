/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoreApi, StateCreator } from '../types';
import { produce } from 'immer';

type CreateStoreImpl = <T>(initializer: StateCreator<T>) => StoreApi<T>;

type CreateStore = {
  // set
  <T>(initializer: StateCreator<T>): StoreApi<T>;

  // get
  <T>(): (initializer: StateCreator<T>) => StoreApi<T>;
};

export const createStoreImpl: CreateStoreImpl = (createState) => {
  type TState = ReturnType<typeof createState>;
  type Listener = () => void;

  let state: TState;
  const listeners: Set<Listener> = new Set();

  const getState: StoreApi<TState>['getState'] = () => state;

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState = (
      typeof partial === 'function' ? produce(partial as any)(state) : partial
    ) as ((s: TState) => TState) | TState | Partial<TState>;

    if (Object.is(nextState, state)) return;

    // replace가 true이거나 nextState가 객체가 아닌 경우
    if (replace ?? typeof nextState !== 'object') {
      state = nextState as TState; // ex) { name: 'hello' }
    } else {
      state = Object.assign({}, state, nextState); // ex) { ...state, name: 'hello' }
    }
    listeners.forEach((listener) => listener());
  };

  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState);
  return api as any;
};

export const createStore = ((createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl) as CreateStore;
