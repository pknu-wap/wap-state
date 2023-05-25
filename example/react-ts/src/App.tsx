import useCounterStore from './stores/useCounterStore';

const Counter = () => {
  const { count, increment, decrement, resetCount } = useCounterStore();
  const counteA = useCounterStore((state) => state.count);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => increment(1)}>+</button>
      <button onClick={() => decrement(1)}>-</button>
      <button onClick={() => resetCount()}>reset</button>
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
