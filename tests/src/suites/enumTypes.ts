import { Discriminant, Enum } from "mobx-union-store";

type Enumerated = Enum<{
  first: void,
  second: {
    value: string,
  },
  third: {
    count: number,
  }
}>;

function assertEnumerated(_: Enumerated) {
}

export = () => {
  assertEnumerated({[Discriminant]: 'first'});
  assertEnumerated({[Discriminant]: 'second', value: 'test'});
  assertEnumerated({[Discriminant]: 'third', count: 0});
};
