import * as React from 'react';

import { Consumer, Provider } from './Context';
import globalConfig, { IConfig } from './globalConfig';

type PropType<TElement> = TElement extends React.ReactElement<infer TProps>
  ? Pick<TProps, Exclude<keyof TProps, 'name' | 'children'>>
  : {};

type RenderProp = (id: IAnyProps) => React.ReactElement | null;

export interface IAnyProps {
  [prop: string]: any;
}

function applyMappers<TOwn extends IAnyProps, TChild extends IAnyProps>(
  ownProps: TOwn,
  childProps: TChild
): IAnyProps {
  const entries = Object.entries(globalConfig.mappers);
  const res: IAnyProps = {};
  for (let [field, mapper] of entries) {
    res[field] = mapper(ownProps[field], childProps[field]);
  }

  return res;
}

function render<TChild extends React.ReactElement>(
  name: string,
  children: TChild | RenderProp,
  otherProps: PropType<TChild>
) {
  const el =
    typeof children === 'function'
      ? children({
          [globalConfig.attr]: name,
        })
      : React.cloneElement(
          children,
          Object.assign(
            {
              [globalConfig.attr]: name,
            },
            otherProps,
            children.props,
            applyMappers(otherProps, children.props)
          )
        );

  return <Provider value={name}>{el}</Provider>;
}

function renderRelative<TChild extends React.ReactElement>(
  name: string,
  children: TChild | RenderProp,
  otherProps: PropType<TChild>
) {
  return (
    <Consumer>
      {namespace => render(`${namespace}${name}`, children, otherProps)}
    </Consumer>
  );
}

function renderWithoutRole<TChild extends React.ReactElement>(
  children: TChild | RenderProp,
  otherProps: PropType<TChild>
) {
  if (typeof children === 'function') {
    return children({});
  }

  return React.cloneElement(
    children,
    Object.assign(
      {},
      otherProps,
      children.props,
      applyMappers(otherProps, children.props)
    )
  );
}

function TestId<TChild extends React.ReactElement>(
  props: PropType<TChild> &
    Readonly<{
      name: string;
      children: TChild | RenderProp;
    }>
): React.ReactElement | null {
  const { name, children, ...otherProps } = props;
  if (!globalConfig.display) {
    return renderWithoutRole(children, otherProps as PropType<TChild>);
  }

  return (name.indexOf(globalConfig.separator) === 0 ? renderRelative : render)(
    name,
    children,
    otherProps as PropType<TChild>
  );
}

TestId.setConfig = (config: Partial<IConfig>) => {
  Object.assign(globalConfig, config);
};

export { TestId };
