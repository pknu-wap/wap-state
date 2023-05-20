import { create } from '../dist';

type States = {
  count: number;
};

type Actions = {
  increment: (num: number) => void;
  decrement: (num: number) => void;
};

const counterStore = create<States & Actions>((set, get) => ({
  count: 0,
  increment: (num) => set((state) => ({ count: state.count + num })),
  decrement: (num) => set((state) => ({ count: state.count - num })),
}));

export default counterStore;
