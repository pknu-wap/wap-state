import { wstate } from 'wap-state';

type States = {
  a: { b: { c: { d: number } } };
};

type Actions = {
  setD: (d: number) => void;
};

const useNestedStore = wstate<States & Actions>((set) => ({
  a: {
    b: {
      c: {
        d: 0,
      },
    },
  },
  setD: (newD) => set((state) => (state.a.b.c.d = newD)),
}));

export default useNestedStore;
