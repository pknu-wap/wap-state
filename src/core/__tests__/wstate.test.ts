import { wstate } from '../wstate';
import { act, renderHook } from '@testing-library/react-hooks';

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

    // reset, replace test
    useCounterStore.setState({}, true);
    expect(useCounterStore.getState().count).toBe(undefined);
  });

  test('selector', () => {
    type States = {
      trash: number;
      mirror: number;
      desk: number;
    };

    type Actions = {
      inc: () => void;
      incByNum: (num: number) => void;
    };

    const useWapStore = wstate<States & Actions>((set) => ({
      trash: 4,
      mirror: 5,
      desk: 6,
      inc: () => set((state) => ({ trash: state.trash + 1 })),
      incByNum: (num) => set((state) => ({ trash: state.trash + num })),
    }));
    const { result } = renderHook(() => useWapStore((state) => state.trash));
    expect(result.current).toBe(4);

    const { result: result2 } = renderHook(() =>
      useWapStore((state) => state.trash + state.mirror),
    );
    expect(result2.current).toBe(9);
  });
});
