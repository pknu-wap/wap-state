<h1 align="center">WAP State</h1>

wap-state은 Zustand의 영향을 받아 개발한 상태 관리 라이브러리입니다.

<p align="center">
  <a href="https://github.com/pknu-wap/wap-state/blob/main/LICENSE">
    <img src="https://badgen.net/github/license/pknu-wap/wap-state">
  </a>
  <a href="https://www.npmjs.com/package/wap-state">
    <img src="https://img.shields.io/npm/dm/wap-state.svg?style=flat-round" alt="npm downloads">
  </a>
  <img alt="Github Stars" src="https://badgen.net/github/stars/pknu-wap/wap-state" />

</p>
<p align="center">
  <img src="https://badgen.net/github/release/pknu-wap/wap-state"/>
  <img src="https://badgen.net/packagephobia/publish/wap-state"/>
</p>

## Feature

- **Shallow Equal**: 필요한 상태만 선택적으로 공유할 수 있고, 리렌더링을 방지하여 효율적인 상태 관리를 할 수 있습니다.
- **lightweight**: 불필요한 코드를 모두 제거하여 경량화된 라이브러리입니다.
- **Support Typescript**: 타입스크립트를 지원합니다.

## Installation

Install this library with the following command.

```sh
$ pnpm add wap-state
# or
$ yarn add wap-state
# or
$ npm intall wap-state
```

## Usage

### First create a state

You can create global state management hook through `wstate`.
Create states and actions types for the correct type, and create states and actions inside the wstate.

```ts
// src/stores/useCounterStore.ts

import { wstate } from 'wap-state';

type States = {
  count: number;
  step: number;
};

type Actions = {
  increment: (num: number) => void;
  decrement: (num: number) => void;
  resetCount: () => void;
};

const useCounterStore = wstate<States & Actions>((set) => ({
  count: 0,
  step: 0,
  increment: (num: number) => set((state) => ({ count: state.count + num })),
  decrement: (num: number) => set((state) => ({ count: state.count - num })),
  resetCount: () => set({ count: 0 }),
}));

export default useCounterStore;
```

### Use the state or actions from your components

```tsx
import useCounterStore from './stores/useCounterStore';

const CounterComponent = () => {
  const { count, increment, decrement, resetCount } = useCounterStore();

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

export default CounterComponent;
```

### Select part of state

If you want to selet part of the state, you can pass selector function as argument.
If you select multiple fields, the component will rerender after shallow comparison.

```tsx
const { count, step } = useCounterStore((state) => ({
  count: state.count,
  step: state.step,
}));
```

Or you can use custom equality function.

```tsx
const count = useCounterStore(
  (state) => ({ count: state.count, step: state.step }),
  // this part
  (prev, new) => customCompare(prev, new),
);
```
