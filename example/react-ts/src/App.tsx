import counterStore from './stores/counterStore';

const Counter = () => {
  const { count, increment, decrement } = counterStore();
  const counteA = counterStore((state) => state.count);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => increment(1)}>+</button>
      <button onClick={() => decrement(1)}>-</button>
      <div>{counteA}</div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Counter />
      <Counter />
      <Counter />
    </div>
  );
};

export default App;
