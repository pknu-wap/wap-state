/** 
 * @SetStateInterval

interface User {
  name: string;
  age: number;
}

setStateInternal({ name: "Alice", age: 30 }, true); // Entire state is replaced
setStateInternal({ age: 35 }); // Partial state is merged
setStateInternal((state) => ({ ...state, age: state.age + 1 })); // Using update function

 */
export type SetStateInternal<T> = {
  _(
    partial: T | Partial<T> | { _(state: T): T | Partial<T> }['_'],
    replace?: boolean | undefined,
  ): void;
}['_'];
