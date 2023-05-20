import { create } from '../lib';

describe('[WAP-STATE] create test', () => {
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

  it('can be created', () => {
    expect(counterStore.getState().count).toBe(0);
  });

  it('can be updated with setState', () => {
    counterStore.setState({ count: 1 });
    expect(counterStore.getState().count).toBe(1);
  });

  it('can be updated with actions (increment)', () => {
    counterStore.getState().increment(1);
    expect(counterStore.getState().count).toBe(2);
  });

  it('can be updated with actions (decrement)', () => {
    counterStore.getState().decrement(1);
    expect(counterStore.getState().count).toBe(1);
  });
});
