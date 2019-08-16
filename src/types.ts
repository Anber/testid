import * as React from 'react';

export type PropType<TElement> = TElement extends React.ReactElement<
  infer TProps
>
  ? Pick<TProps, Exclude<keyof TProps, 'name' | 'children'>>
  : {};

export type Id<TAttr extends string> = { [K in TAttr]?: string };

export type RenderFn<TAttr extends string> = (
  id: Id<TAttr>
) => React.ReactElement | null;

export interface IAnyProps {
  [prop: string]: any;
}

export interface IConfig<TAttr> {
  display: boolean;
  attr: TAttr;
  separator: string;
}

export type IdComponent<TAttr extends string> = <
  TChild extends React.ReactElement
>(
  props: PropType<TChild> &
    Readonly<{
      name: string;
      children: TChild | RenderFn<TAttr>;
    }>
) => React.ReactElement | null;

export type IdHook<TAttr extends string> = (
  name: string,
  relative?: boolean
) => Id<TAttr>;

export type IdsHook<TAttr extends string> = (names: string[]) => Id<TAttr>[];
