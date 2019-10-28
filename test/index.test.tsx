import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { custom, Id } from '../src';

const [TestId] = custom({ attr: 'test-id', display: true, separator: ':' });
const Custom: React.FC<{ idx: number; id?: string } & Id<'test-id'>> = ({
  idx,
  ...role
}) => <span {...role}>{idx}</span>;
// @ts-ignore type check
const res = [
  <TestId as={Custom} name="parent" idx={42} />,
  <TestId as="div" name="parent">
    {'something'}
  </TestId>,
];

const run = <TAttr extends string>(
  attr: TAttr,
  separator: string,
  display: boolean
) => {
  const [TestId] = custom({
    attr,
    separator,
    display,
  });

  test(`additional attributes should${
    display ? '' : ' not'
  } be rendered`, () => {
    const component = renderer.create(
      <TestId as={'div'} name="parent">
        <TestId as={'span'} name={`${separator}child`}>
          <TestId as={'i'} name="absolute" />
        </TestId>
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should pass className to the child', () => {
    const component = renderer.create(
      <TestId as={'div'} name="parent" className="test-class" />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should merge classes', () => {
    const component = renderer.create(
      // @ts-ignore deprecated syntax
      <TestId name="parent" className="test-class">
        <div className="existed-class" />
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should forward red', () => {
    function createNodeMock(element: React.ReactElement) {
      if (element.type === 'div') {
        return {};
      }

      return null;
    }

    const ref = React.createRef<HTMLElement>();
    renderer.create(<TestId as="div" name="parent" ref={ref} />, {
      createNodeMock,
    });

    console.log('ref', ref);
    expect(ref.current).not.toBe(null);
  });

  test('should pass unknown props to the child', () => {
    const component = renderer.create(
      // @ts-ignore
      <TestId as={'div'} name="parent" unknownProp="value" />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
};

describe('enabled ids', () => {
  run('data-test-id', ':', true);
});

describe('custom attribute and separator', () => {
  run('data-role', '/', true);
});

describe('disabled ids', () => {
  run('data-test-id', ':', false);
});
