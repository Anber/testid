import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { TestId, IAnyProps } from '../src';

const common = () => {
  test('render props', () => {
    const thirdLevel = (id: IAnyProps) => <i {...id} />;

    const secondLevel = (id: IAnyProps) => (
      <span {...id}>
        <TestId name="absolute">{thirdLevel}</TestId>
      </span>
    );

    const firstLevel = (id: IAnyProps) => (
      <div {...id}>
        <TestId name=":child">{secondLevel}</TestId>
      </div>
    );

    const component = renderer.create(
      <TestId name="parent">{firstLevel}</TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Should pass className to the child', () => {
    const component = renderer.create(
      <TestId name="parent" className="test-class">
        <div />
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Should merge classes', () => {
    const component = renderer.create(
      <TestId name="parent" className="test-class">
        <div className="existed-class" />
      </TestId>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Should pass unknown props to the child', () => {
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
  beforeAll(() => {
    TestId.setConfig({ display: true });
  });

  test('Roles should be rendered', () => {
    const component = renderer.create(
      <TestId name="parent">
        <div>
          <TestId name=":child">
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

  describe('common', common);
});

describe('disabled ids', () => {
  beforeAll(() => {
    TestId.setConfig({ display: false });
  });

  test("Roles shouldn't be rendered", () => {
    const component = renderer.create(
      <TestId name="parent">
        <div>
          <TestId name=":child">
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

  describe('common', common);
});
