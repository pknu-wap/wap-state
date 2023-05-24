import { shallowEqual } from '../lib/shallowEqual';

describe('shallow', () => {
  it('compares primitive values', () => {
    expect(shallowEqual(true, true)).toBe(true);
    expect(shallowEqual(true, false)).toBe(false);

    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual(1, 2)).toBe(false);

    expect(shallowEqual('wap-state', 'wap-state')).toBe(true);
    expect(shallowEqual('wap-state', 'redux')).toBe(false);
  });

  it('compares objects', () => {
    expect(
      shallowEqual({ foo: 'bar', asd: 123 }, { foo: 'bar', asd: 123 }),
    ).toBe(true);

    expect(
      shallowEqual({ foo: 'bar', asd: 123 }, { foo: 'bar', foobar: true }),
    ).toBe(false);

    expect(
      shallowEqual(
        { foo: 'bar', asd: 123 },
        { foo: 'bar', asd: 123, foobar: true },
      ),
    ).toBe(false);
  });

  it('compares arrays', () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);

    expect(shallowEqual([1, 2, 3], [2, 3, 4])).toBe(false);

    expect(
      shallowEqual(
        [{ foo: 'bar' }, { asd: 123 }],
        [{ foo: 'bar' }, { asd: 123 }],
      ),
    ).toBe(false);

    expect(shallowEqual([{ foo: 'bar' }], [{ foo: 'bar', asd: 123 }])).toBe(
      false,
    );
  });

  it('compares Maps', () => {
    function createMap<T extends object>(obj: T) {
      return new Map(Object.entries(obj));
    }

    expect(
      shallowEqual(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', asd: 123 }),
      ),
    ).toBe(true);

    expect(
      shallowEqual(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', foobar: true }),
      ),
    ).toBe(false);

    expect(
      shallowEqual(
        createMap({ foo: 'bar', asd: 123 }),
        createMap({ foo: 'bar', asd: 123, foobar: true }),
      ),
    ).toBe(false);
  });

  it('compares Sets', () => {
    expect(shallowEqual(new Set(['bar', 123]), new Set(['bar', 123]))).toBe(
      true,
    );

    expect(shallowEqual(new Set(['bar', 123]), new Set(['bar', 2]))).toBe(
      false,
    );

    expect(
      shallowEqual(new Set(['bar', 123]), new Set(['bar', 123, true])),
    ).toBe(false);
  });

  it('compares functions', () => {
    function firstFnCompare() {
      return { foo: 'bar' };
    }

    function secondFnCompare() {
      return { foo: 'bar' };
    }

    expect(shallowEqual(firstFnCompare, firstFnCompare)).toBe(true);

    expect(shallowEqual(secondFnCompare, secondFnCompare)).toBe(true);

    expect(shallowEqual(firstFnCompare, secondFnCompare)).toBe(false);
  });
});

describe('unsupported cases', () => {
  it('date', () => {
    expect(
      shallowEqual(
        new Date('2022-07-19T00:00:00.000Z'),
        new Date('2022-07-20T00:00:00.000Z'),
      ),
    ).not.toBe(false);
  });
});
