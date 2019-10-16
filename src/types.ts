import * as React from 'react';

export type PropType<
  TElement,
  TExcept extends string
> = TElement extends React.ReactElement<infer TProps>
  ? Omit<TProps, TExcept>
  : {};

export type Id<TAttr extends string> = {
  [P in TAttr]?: string;
};

export type RenderFn<TProps, TAttr extends string> = (
  id: Id<TAttr>
) => React.ReactElement<TProps & Id<TAttr>>;

export interface IAnyProps {
  [prop: string]: any;
}

export interface IConfig<TAttr> {
  display: boolean;
  attr: TAttr;
  separator: string;
}

export type IdComponentProps<
  TChild,
  TAttr extends string
> = TChild extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TChild]
  : TChild extends React.ComponentType<infer T>
  ? TAttr extends keyof T
    ? T
    : T extends React.DetailedHTMLProps<any, any>
    ? T
    : never
  : never;

export type IdComponent<TAttr extends string> = <
  TChild extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>(
  props: {
    as: TChild;
    name: string;
  } & IdComponentProps<TChild, TAttr>
) => React.ReactElement;

export type IdHook<TAttr extends string> = (
  name: string,
  relative?: boolean
) => Id<TAttr>;

export type IdsHook<TAttr extends string> = (names: string[]) => Id<TAttr>[];

export type InnerRender<TAttr extends string, TName = string> = <
  TProps extends {}
>(
  name: TName,
  renderFn: RenderFn<TProps, TAttr>
) => React.ReactElement<TProps & Id<TAttr>>;
