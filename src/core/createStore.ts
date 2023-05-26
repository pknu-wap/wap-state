/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoreApi, StateCreator } from '../types';

type CreateStore = {
  // set
  <T>(initializer: StateCreator<T>): StoreApi<T>;

  // get
  <T>(): (initializer: StateCreator<T>) => StoreApi<T>;
};

export const createStore = ((createState) => {
  type TState = ReturnType<typeof createState>;
  type Listener = () => void;

  let state: TState;
  const listeners: Set<Listener> = new Set();

  const getState: StoreApi<TState>['getState'] = () => state;

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState = (
      typeof partial === 'function'
        ? (partial as (state: TState) => TState)(state)
        : partial
    ) as ((s: TState) => TState) | TState | Partial<TState>;

    if (Object.is(nextState, state)) return;

    // replace가 true이거나 nextState가 객체가 아닌 경우
    if (replace ?? typeof nextState !== 'object') {
      state = nextState as TState; // ex) { name: 'hello' }
    } else {
      state = Object.assign({}, state, nextState); // ex) { ...state, name: 'hello' }
    }

    // state가 변경되었을 때, 등록된 listener를 모두 실행한다.
    listeners.forEach((listener) => listener());
  };

  // subscribe의 역할은 listener를 등록하고, 등록된 listener를 삭제하는 함수를 반환한다.
  // listener등록은 state가 변경되었을 때, listener를 실행하기 위함이다.
  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState);

  return api;
}) as CreateStore;
