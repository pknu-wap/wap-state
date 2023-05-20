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
  // get
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ): UseBoundStore<Mutate<StoreApi<T>, Mos>>;
  // get
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => UseBoundStore<Mutate<StoreApi<T>, Mos>>;
};

const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  const api = createStore(createState);

  // useStore를 사용할 때마다 api를 전달하지 않아도 되도록 useBoundStore를 만든다.
  // useBoundStore는 useStore와 같은 기능을 하지만 api를 전달하지 않아도 된다.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useBoundStore: any = (selector?: any, isEqual?: any) =>
    useStore(api, selector, isEqual);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (<T>(createState: StateCreator<T, [], []> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create;
