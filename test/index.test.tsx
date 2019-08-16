import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { custom, Id } from '../src';

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
      <TestId name="parent">
        <div>
          <TestId name={`${separator}child`}>
            <span>
              <TestId name="absolute">
                <i />
              </TestId>
            </span>
          </TestId>
        </div>
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('render props', () => {
    const thirdLevel = (id: Id<TAttr>) => <i {...id} />;

    const secondLevel = (id: Id<TAttr>) => (
      <span {...id}>
        <TestId name="absolute">{thirdLevel}</TestId>
      </span>
    );

    const firstLevel = (id: Id<TAttr>) => (
      <div {...id}>
        <TestId name={`${separator}child`}>{secondLevel}</TestId>
      </div>
    );

    const component = renderer.create(
      <TestId name="parent">{firstLevel}</TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should pass className to the child', () => {
    const component = renderer.create(
      <TestId name="parent" className="test-class">
        <div />
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should merge classes', () => {
    const component = renderer.create(
      <TestId name="parent" className="test-class">
        <div className="existed-class" />
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should pass unknown props to the child', () => {
    const component = renderer.create(
      <TestId name="parent" unknownProp="value">
        <div />
      </TestId>
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
