import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TestId from '../src';

const App = () => {
  return (
    <div>
      <TestId name="root-id">
        <div>
          <TestId name=":child-id">
            <h1>Child with data-test-id</h1>
          </TestId>
        </div>
      </TestId>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
