import { createStore } from './createStore';
import { useStore } from './useStore';
import type {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
  UseBoundStore,
} from './types';

type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ): UseBoundStore<Mutate<StoreApi<T>, Mos>>;
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => UseBoundStore<Mutate<StoreApi<T>, Mos>>;
  /**
   * @deprecated Use `useStore` hook to bind store
   */
  <S extends StoreApi<unknown>>(store: S): UseBoundStore<S>;
};

const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  // createState가 function이 아니면 이거는 vanilla store이다.
  // 그니까 이걸 어떻게 해야하지?
  if (typeof createState !== 'function') {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.",
    );
  }
  const api =
    typeof createState === 'function' ? createStore(createState) : createState;

  // useStore를 사용할 때마다 api를 전달하지 않아도 되도록 useBoundStore를 만든다.
  // useBoundStore는 useStore와 같은 기능을 하지만 api를 전달하지 않아도 된다.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (<T>(createState: StateCreator<T, [], []> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create;
