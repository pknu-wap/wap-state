import { create } from 'wap-state';

type States = {
  count: number;
};

type Actions = {
  increment: (num: number) => void;
  decrement: (num: number) => void;
};

const counterStore = create<States & Actions>((set) => ({
  count: 0,
  increment: (num: number) => set((state) => ({ count: state.count + num })),
  decrement: (num: number) => set((state) => ({ count: state.count - num })),
}));

export default counterStore;
