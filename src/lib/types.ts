/** 

interface User {
  name: string;
  age: number;
}

type NameType = Get<Person, 'name', null>; // string
type AgeType = Get<Person, 'age', null>; // number
type AddressType = Get<Person, 'address', null>; // null

 */
export type Get<T, K, F> = K extends keyof T ? T[K] : F;

/*

interface User {
  name: string;
  age: number;
}

setStateInternal({ name: "Alice", age: 30 }, true); // Entire state is replaced
setStateInternal({ age: 35 }); // Partial state is merged
setStateInternal((state) => ({ ...state, age: state.age + 1 })); // Using update function

 */
export type SetStateInternal<T> = {
  _(
    partial: T | Partial<T> | { _(state: T): T | Partial<T> }['_'],
    replace?: boolean | undefined,
  ): void;
}['_'];

export interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StoreMutators<S, A> {}
/*

interface User {
  name: string;
  age: number;
}

type UserMutators = StoreMutators<User, {
  setName: (name: string) => void;
  setAge: (age: number) => void;
}>;

type UserMutatorIdentifier = keyof UserMutators; // 'setName' | 'setAge'

 */
export type StoreMutatorIdentifier = keyof StoreMutators<unknown, unknown>;

// Mutate는 StoreMutators를 이용하여 S를 변형한다.
// Ms는 Mutator의 배열이다.
// Ms의 각 요소는 [MutatorIdentifier, MutatorArgs]이다.
// Ms의 각 요소를 순회하면서 StoreMutators를 이용하여 S를 변형한다.
export type Mutate<S, Ms> = number extends Ms['length' & keyof Ms] // 가변 타입인지 확인
  ? S
  : Ms extends [] // Ms가 빈 배열인지 확인
  ? S
  : Ms extends [[infer Mi, infer Ma], ...infer Mrs] // Ms의 첫번째 요소가 [MutatorIdentifier, MutatorArgs]인지 확인
  ? Mutate<StoreMutators<S, Ma>[Mi & StoreMutatorIdentifier], Mrs> // Mutate<StoreMutators<S, Ma>[Mi], Mrs>
  : never;

// StateCreator은 상태(state)와 상태 변경 함수들(mutators)을 초기화하고, 해당 상태를 조작하는 함수를 생성하는 타입입니다.
export type StateCreator<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = ((
  setState: Get<Mutate<StoreApi<T>, Mis>, 'setState', never>,
  getState: Get<Mutate<StoreApi<T>, Mis>, 'getState', never>,
  store: Mutate<StoreApi<T>, Mis>,
) => U) & { $$storeMutators?: Mos }; // $$storeMutators는 StoreMutators를 이용하여 S를 변형하는 함수들의 배열이다.

// ExtractState는 S에서 상태(state)를 추출하는 타입입니다.
// getState가 반환하는 타입을 추출합니다. 없을 경우 never를 반환합니다.
export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

// ReadonlyStoreApi는 getState와 subscribe 함수만을 가지는 StoreApi 타입입니다.
// Omit<StoreApi<T>, 'setState'>와 비슷하다.
export type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'subscribe'>;

// WithReact는 React를 사용할 때 사용하는 타입입니다.
// SSR를 위해 getServerState 함수를 추가합니다.
export type WithReact<S extends ReadonlyStoreApi<unknown>> = S & {
  getServerState?: () => ExtractState<S>;
};

// 스토어를 사용할 때, 상태 값을 가져오는 간단한 방법과 선택적으로 값을 선택하고 변경 여부를 판단하는 방법을 제공합니다.
export type UseBoundStore<S extends WithReact<ReadonlyStoreApi<unknown>>> = {
  (): ExtractState<S>;
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean,
  ): U;
} & S;
