import { createStore } from './createStore';
import { useStore } from './useStore';
import type { StateCreator, StoreApi, UseBoundStore } from '../types';

type WState = {
  // set
  <T>(initializer: StateCreator<T>): UseBoundStore<StoreApi<T>>;

  // get
  <T>(): (initializer: StateCreator<T>) => UseBoundStore<StoreApi<T>>;
};

export const wstate = (<T>(createState: StateCreator<T>) => {
  const api = createStore(createState);

  // useStore 부분은 나중에 useCounterStore, useTodoStore 등 store을 만들고 사용할 때 쓰인다.
  // 거기서 selector, isEqual등을 사용한다.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useBoundStore: any = (selector?: any, isEqual?: any) =>
    useStore(api, selector, isEqual);

  // useBoundStore = useBoundStore + api
  Object.assign(useBoundStore, api);

  return useBoundStore;
}) as WState;
