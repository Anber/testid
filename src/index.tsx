import * as React from 'react';

import Context, { Consumer, Provider } from './Context';
import { classNames } from './utils';
import {
  IAnyProps,
  IConfig,
  IdComponent,
  IdHook,
  IdsHook,
  InnerRender,
  RenderFn,
  Id,
  IdComponentProps,
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
  const render: InnerRender<TAttr> = (name, renderFn) => {
    const idProp: Id<TAttr> = {};
    idProp[config.attr] = name;
    return <Provider value={name}>{renderFn(idProp)}</Provider>;
  };

  const renderRelative: InnerRender<TAttr> = (name, renderFn) => {
    return (
      <Consumer>
        {namespace => render(`${namespace}${name}`, renderFn)}
      </Consumer>
    );
  };

  const renderWithoutId: InnerRender<TAttr, null> = <TProps extends {}>(
    _: null,
    renderFn: RenderFn<TProps, TAttr>
  ) => renderFn({});

  function deprecatedRender({
    children,
    ...otherProps
  }: any): RenderFn<typeof otherProps, TAttr> {
    return id => {
      const resProps: Partial<typeof otherProps & Id<TAttr>> = Object.assign(
        id,
        otherProps,
        children.props,
        applyMappers(otherProps, children.props)
      );

      return React.cloneElement<typeof otherProps & Id<TAttr>>(
        children as any,
        resProps
      );
    };
  }

  function asRender<TProp extends object>(
    as: React.ElementType<TProp>,
    props: TProp,
    ref: React.Ref<HTMLElement>
  ): RenderFn<TProp, TAttr> {
    return id => React.createElement(as, { ...id, ...props, ref });
  }

  const forwardRefCmp = <
    TChild extends keyof JSX.IntrinsicElements | React.ComponentType<any>
  >(
    {
      as = null,
      name,
      ...otherProps
    }: {
      as: TChild;
      name: string;
    } & IdComponentProps<TChild, TAttr>,
    ref: React.Ref<HTMLElement>
  ) => {
    const renderFn: RenderFn<typeof otherProps, TAttr> =
      as !== null
        ? asRender(as, otherProps, ref)
        : deprecatedRender(otherProps);

    if (!config.display) {
      return renderWithoutId<typeof otherProps>(null, renderFn);
    }

    return (name.indexOf(config.separator) === 0 ? renderRelative : render)(
      name,
      renderFn
    );
  };

  const TestId: IdComponent<TAttr> = React.forwardRef(forwardRefCmp) as any; // FIXME

  const useTestId: IdHook<TAttr> = (
    name,
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

  const useTestIds: IdsHook<TAttr> = names => {
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
  display: true,
  separator: ':',
});

export { IConfig, IdComponent, IdHook, IdsHook, RenderFn, Id };

export { TestId, useTestId, useTestIds, custom };
