import { create } from '../../../dist';

describe('create', () => {
  type States = {
    count: number;
  };

  type Actions = {
    increment: (num: number) => void;
    decrement: (num: number) => void;
  };

  const counterStore = create<States & Actions>((set) => ({
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

describe('[wap-state] todoStore test', () => {
  interface Todo {
    id: number;
    text: string;
    done: boolean;
  }

  type States = {
    todo: Todo[];
    totalCount: number;
  };

  type Actions = {
    addTodo: (todo: Todo) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
  };

  const todoStore = create<States & Actions>((set) => ({
    todo: [
      {
        id: 1,
        text: 'test',
        done: false,
      },
    ],
    totalCount: 1,
    addTodo: (todo: Todo) =>
      set((state) => ({
        todo: [...state.todo, todo],
        totalCount: state.totalCount + 1,
      })),
    toggleTodo: (id: number) =>
      set((state) => ({
        todo: state.todo.map((todo) => {
          if (todo.id === id) {
            return { ...todo, done: !todo.done };
          }
          return todo;
        }),
      })),
    deleteTodo: (id: number) =>
      set((state) => ({
        todo: state.todo.filter((todo) => todo.id !== id),
        totalCount: state.totalCount - 1,
      })),
  }));

  it('can be created', () => {
    expect(todoStore.getState().todo).toEqual([
      { id: 1, text: 'test', done: false },
    ]);
  });

  it('can be updated with setState', () => {
    todoStore.setState({ todo: [{ id: 1, text: 'test', done: false }] });
    expect(todoStore.getState().todo).toEqual([
      { id: 1, text: 'test', done: false },
    ]);
  });

  it('can be updated with actions (addTodo)', () => {
    todoStore.getState().addTodo({
      id: 2,
      text: 'test2',
      done: false,
    });
    expect(todoStore.getState().todo).toEqual([
      { id: 1, text: 'test', done: false },
      { id: 2, text: 'test2', done: false },
    ]);
  });

  it('can be updated with actions (toggleTodo)', () => {
    todoStore.getState().toggleTodo(1);
    expect(todoStore.getState().todo).toEqual([
      { id: 1, text: 'test', done: true },
      { id: 2, text: 'test2', done: false },
    ]);
  });

  it('can be updated with actions (deleteTodo)', () => {
    todoStore.getState().deleteTodo(1);
    expect(todoStore.getState().todo).toEqual([
      { id: 2, text: 'test2', done: false },
    ]);
  });
});
