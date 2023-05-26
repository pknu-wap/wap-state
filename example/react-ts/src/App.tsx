import useCounterStore from './stores/useCounterStore';
import useNestedStore from './stores/useNestedStore';

const Counter = () => {
  const { count, increment, decrement, resetCount } = useCounterStore();
  const counteA = useCounterStore((state) => state.count);
  const {
    a: {
      b: {
        c: { d },
      },
    },
    setD,
  } = useNestedStore();
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => increment(1)}>+</button>
      <button onClick={() => decrement(1)}>-</button>
      <button onClick={() => resetCount()}>reset</button>
      <div>{counteA}</div>
      <div>{d}</div>
      <button onClick={() => setD(count)}>setB</button>
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
