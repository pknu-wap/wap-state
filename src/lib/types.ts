import type { Get } from './util-types';

/**

type User = {
  name: string;
  age: number;
};

const setState: SetStateInternal<User> = (partial, replace) => {
  // Set the state of User object based on the partial input
  // and the replace flag.
};

// Example 1: Update the name property of the user
setState({ name: 'John' });

Example 2: Update both the name and age properties of the user
setState({ name: 'Jane', age: 25 });

Example 3: Update the state using a callback function
setState((state) => ({ ...state, age: state.age + 1 }));

Example 4: Replace the entire state with a new object
setState({ name: 'Sam' }, true);

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

// Mutate를 이용하여 S를 변형할 때, Mutator의 인자를 추론하기 위해서 사용한다.
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
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

/**

S 객체가 { getState: () => infer T } 유형에 할당 가능한지 확인합니다.
만약 S 객체가 getState 메서드를 갖는다면, T를 반환합니다. 이는 S 객체의 getState 메서드의 반환 유형을 추론합니다.
만약 S 객체가 getState 메서드를 갖지 않는다면, never를 반환합니다.

Utity Type인 Extract Type과 유사하다.

 */
export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

// ReadonlyStoreApi는 getState와 subscribe 함수만을 가지는 StoreApi 타입입니다.
// Omit<StoreApi<T>, 'setState'>와 비슷하다.
export type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'subscribe'>;

// 스토어를 사용할 때, 상태 값을 가져오는 간단한 방법과 선택적으로 값을 선택하고 변경 여부를 판단하는 방법을 제공합니다.
export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean,
  ): U;
} & S;
