import { wstate } from '../wstate';

describe('wstate', () => {
  test('basic', () => {
    type States = {
      count: number;
    };

    type Actions = {
      inc: () => void;
      incByNum: (num: number) => void;
    };

    const useCounterStore = wstate<States & Actions>((set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
      incByNum: (num) => set((state) => ({ count: state.count + num })),
    }));

    // states test
    expect(useCounterStore.getState().count).toBe(0);
    useCounterStore.setState({ count: 1 });
    expect(useCounterStore.getState().count).toBe(1);
    useCounterStore.setState((state) => ({ count: state.count + 1 }));
    expect(useCounterStore.getState().count).toBe(2);

    // actions test
    useCounterStore.getState().inc();
    expect(useCounterStore.getState().count).toBe(3);
    useCounterStore.getState().incByNum(2);
    expect(useCounterStore.getState().count).toBe(5);
  });
});
