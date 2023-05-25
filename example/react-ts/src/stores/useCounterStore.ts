import { wstate } from 'wap-state';

type States = {
  count: number;
  step: number;
};

type Actions = {
  increment: (num: number) => void;
  decrement: (num: number) => void;
  resetCount: () => void;
};

const useCounterStore = wstate<States & Actions>((set) => ({
  count: 0,
  step: 0,
  increment: (num: number) => set((state) => ({ count: state.count + num })),
  decrement: (num: number) => set((state) => ({ count: state.count - num })),
  resetCount: () => set({ count: 0 }),
}));

export default useCounterStore;
