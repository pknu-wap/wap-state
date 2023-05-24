import { shallowEqual } from '../shallowEqual';

describe('shallowEqual', () => {
  test('원시 타입 비교', () => {
    expect(shallowEqual(5, 5)).toBe(true);
    expect(shallowEqual('hello', 'hello')).toBe(true);
    expect(shallowEqual(true, false)).toBe(false);
    expect(shallowEqual(null, undefined)).toBe(false);
  });

  test('객체 비교', () => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'John', age: 30 };
    const obj3 = { name: 'Jane', age: 25 };

    expect(shallowEqual(obj1, obj1)).toBe(true);
    expect(shallowEqual(obj1, obj2)).toBe(true);
    expect(shallowEqual(obj1, obj3)).toBe(false);
  });

  test('배열 비교', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];

    expect(shallowEqual(arr1, arr1)).toBe(true);
    expect(shallowEqual(arr1, arr2)).toBe(true);
    expect(shallowEqual(arr1, arr3)).toBe(false);
  });

  test('Map 비교', () => {
    const map1 = new Map([
      [1, 'one'],
      [2, 'two'],
    ]);
    const map2 = new Map([
      [1, 'one'],
      [2, 'two'],
    ]);
    const map3 = new Map([
      [1, 'one'],
      [2, 'three'],
    ]);

    expect(shallowEqual(map1, map1)).toBe(true);
    expect(shallowEqual(map1, map2)).toBe(true);
    expect(shallowEqual(map1, map3)).toBe(false);
  });

  test('Set 비교', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);

    expect(shallowEqual(set1, set1)).toBe(true);
    expect(shallowEqual(set1, set2)).toBe(true);
    expect(shallowEqual(set1, set3)).toBe(false);
  });

  test('함수 비교', () => {
    const func1 = () => console.log('Hello');
    const func2 = () => console.log('Hello');

    expect(shallowEqual(func1, func1)).toBe(true);
    expect(shallowEqual(func1, func2)).toBe(false);
  });
});
