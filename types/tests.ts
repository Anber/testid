import * as React from 'react';
import { IdComponentProps } from '../src/types';

function idComponentProps<
  TChild extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  TAttr extends string
>(_child: TChild, _attr: TAttr): IdComponentProps<TChild, TAttr> {
  // It will never be executed, so the result doesn't matter.
  return null as any;
}

// tslint:disable-next-line no-unnecessary-generics
const Fabric = <T>(): React.FC<T> => props => React.createElement('div', props);

// $ExpectType string | undefined
idComponentProps('div', 'data-test-id').className;

const Cmp = Fabric<
  { a: string } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
>();
// $ExpectType string | undefined
idComponentProps(Cmp, 'data-test-id').className;
