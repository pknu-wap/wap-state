import { createStore } from './createStore';
import { useStore } from './useStore';
import type { StateCreator, StoreApi, UseBoundStore } from '../types';

type Create = {
  // set
  <T>(initializer: StateCreator<T>): UseBoundStore<StoreApi<T>>;

  // get
  <T>(): (initializer: StateCreator<T>) => UseBoundStore<StoreApi<T>>;
};

export const create = (<T>(createState: StateCreator<T> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create;

export const createImpl = <T>(createState: StateCreator<T>) => {
  const api = createStore(createState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useBoundStore: any = (selector?: any, isEqual?: any) =>
    useStore(api, selector, isEqual);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};
