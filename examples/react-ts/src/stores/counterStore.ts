import { createStore } from '../../../../dist';

const counterStore = createStore<{
  count: number;
}>({ count: 0 });

export default counterStore;
