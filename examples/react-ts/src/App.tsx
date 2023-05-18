import { useStore } from '../../../dist/';
import counterStore from './stores/counterStore';

const App = () => {
  const counter = useStore(counterStore, (state) => state.count);
  const plus = () => {
    console.log(counterStore.getState());

    counterStore.setState((prev: { count: number }) => ({
      ...prev,
      count: prev.count + 1,
    }));
  };
  return (
    <div>
      <div>{counter}</div>
      <button onClick={plus}>+</button>
    </div>
  );
};

export default App;
