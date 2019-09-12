import * as React from 'react';

import Context, { Consumer, Provider } from './Context';
import { classNames } from './utils';
import {
  IAnyProps,
  IConfig,
  IdComponent,
  IdHook,
  IdsHook,
  RenderFn,
  PropType,
  Id,
} from './types';

const mappers = {
  className: classNames,
};

function applyMappers<TOwn extends IAnyProps, TChild extends IAnyProps>(
  ownProps: TOwn,
  childProps: TChild
): IAnyProps {
  const entries = Object.entries(mappers);
  const res: IAnyProps = {};
  for (let [field, mapper] of entries) {
    res[field] = mapper(ownProps[field], childProps[field]);
  }

  return res;
}

function custom<TAttr extends string>(
  config: IConfig<TAttr>
): [IdComponent<TAttr>, IdHook<TAttr>, IdsHook<TAttr>] {
  function render<TChild extends React.ReactElement>(
    name: string,
    children: TChild | RenderFn<TAttr>,
    otherProps: PropType<TChild>
  ) {
    const el =
      typeof children === 'function'
        ? children({
            [config.attr]: name,
          } as Id<TAttr>)
        : React.cloneElement(
            children,
            Object.assign(
              {
                [config.attr]: name,
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
    children: TChild | RenderFn<TAttr>,
    otherProps: PropType<TChild>
  ) {
    return (
      <Consumer>
        {namespace => render(`${namespace}${name}`, children, otherProps)}
      </Consumer>
    );
  }

  function renderWithoutId<TChild extends React.ReactElement>(
    children: TChild | RenderFn<TAttr>,
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
        children: TChild | RenderFn<TAttr>;
      }>
  ): React.ReactElement | null {
    const { name, children, ...otherProps } = props;
    if (!config.display) {
      return renderWithoutId(children, otherProps as PropType<TChild>);
    }

    return (name.indexOf(config.separator) === 0 ? renderRelative : render)(
      name,
      children,
      otherProps as PropType<TChild>
    );
  }

  const useTestId = (
    name: string,
    relative = name.indexOf(config.separator) === 0
  ) => {
    const namespace = React.useContext(Context);
    const id = relative ? `${namespace}${name}` : name;
    return React.useMemo(
      () =>
        ({
          [config.attr]: id,
        } as Id<TAttr>),
      [config.attr, id]
    );
  };

  const useTestIds = (names: string[]) => {
    const namespace = React.useContext(Context);
    return names
      .map(name =>
        name === null || name.indexOf(config.separator) === 0
          ? `${namespace}${name || ''}`
          : name
      )
      .map(
        id =>
          ({
            [config.attr]: id,
          } as Id<TAttr>)
      );
  };

  return [TestId, useTestId, useTestIds];
}

const [TestId, useTestId, useTestIds] = custom({
  attr: 'data-test-id',
  separator: ':',
  display: true,
});

export {
  IConfig,
  IdComponent,
  IdHook,
  IdsHook,
  RenderFn,
  Id,
};

export { TestId, useTestId, useTestIds, custom };
