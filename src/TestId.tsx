import * as React from 'react';

import { Consumer, Provider } from './Context';
import globalConfig, { IConfig } from './globalConfig';
import { classNames } from './utils';

type PropType<TElement> = TElement extends React.ReactElement<infer TProps>
  ? Pick<TProps, Exclude<keyof TProps, 'name' | 'children'>>
  : never;

function render<TChild extends React.ReactElement>(
  name: string,
  children: TChild,
  otherProps: PropType<TChild>
) {
  const el = React.cloneElement(
    children,
    Object.assign({}, otherProps, children.props, {
      [globalConfig.attr]: name,
      className:
        classNames(otherProps.className, children.props.className) || undefined,
    })
  );

  return <Provider value={name}>{el}</Provider>;
}

function renderRelative<TChild extends React.ReactElement>(
  name: string,
  children: TChild,
  otherProps: PropType<TChild>
) {
  return (
    <Consumer>
      {namespace => render(`${namespace}${name}`, children, otherProps)}
    </Consumer>
  );
}

function renderWithoutRole<TChild extends React.ReactElement>(
  children: TChild,
  otherProps: PropType<TChild>
) {
  return React.cloneElement(
    children,
    Object.assign({}, otherProps, children.props, {
      className:
        classNames(otherProps.className, children.props.className) || undefined,
    })
  );
}

export default class TestId<
  TChild extends React.ReactElement
> extends React.PureComponent<
  PropType<TChild> & Readonly<{ name: string; children: TChild }>
> {
  static setConfig(config: Partial<IConfig>) {
    Object.assign(globalConfig, config);
  }

  render() {
    const { name, children, ...props } = this.props;
    if (!globalConfig.display) {
      return renderWithoutRole<TChild>(children, props as PropType<TChild>);
    }

    return (name.indexOf(globalConfig.separator) === 0
      ? renderRelative
      : render)(name, children, props as PropType<TChild>);
  }
}
