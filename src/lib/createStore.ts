import type {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from './types';

// CreateStoreImpl은 주어진 초기화 함수를 사용하여 상태와 상태 변경 함수들을 관리하는 상태 저장소(store)를 생성하는 함수 타입입니다.
type CreateStoreImpl = <
  T,
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, [], Mos>,
) => Mutate<StoreApi<T>, Mos>;

// 함수 호출 시그니처 or 함수 호출 시그니처를 반환하는 함수를 반환한다.
// 예를 들어 createStore()()와 같이 사용할 수 있다. 또는 createStore()와 같이 사용할 수 있다.
type CreateStore = {
  // set
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ): Mutate<StoreApi<T>, Mos>;

  // get
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => Mutate<StoreApi<T>, Mos>;
};

const createStoreImpl: CreateStoreImpl = (createState) => {
  type TState = ReturnType<typeof createState>;
  type Listener = (state: TState, prevState: TState) => void;
  let state: TState;
  const listeners: Set<Listener> = new Set();

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: TState) => TState)(state) // ex) (state) => ({ ...state, name: 'hello' })
        : partial; // ex) { name: 'hello' }
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        replace ?? typeof nextState !== 'object' // replace가 true이거나 nextState가 객체가 아닌 경우
          ? (nextState as TState) // ex) { name: 'hello' }
          : Object.assign({}, state, nextState); // ex) { ...state, name: 'hello' }
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState: StoreApi<TState>['getState'] = () => state;

  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return api as any;
};

// createStore는 상태 저장소(store)를 생성하는 함수입니다.
// createStore()() 또는 createStore()와 같이 사용할 수 있습니다.
export const createStore = ((createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl) as CreateStore;
