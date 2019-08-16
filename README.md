## Installation

```bash
npm i --save react-test-id
# or
yarn add react-test-id
```

## Configuration

By default the attribute name is `data-test-id` and the separator is `:`. The behaviour can be changed by creating new custom component and hooks.

```javascript
import { custom } from "react-test-id";

const [Role, useRole, useRoles] = custom({
  attr: "data-role",
  display: /\bwithRoles\b/.test(globalThis.location.search),
  separator: ":",
});

export { Role, useRole, useRoles };
``` 

## Usage

```javascript
import React from 'react';
import { TestId, useTestId, useTestIds } from "react-test-id"; // if you use predefined configuration
import { TestId, useTestId, useTestIds } from "./custom"; // if you use your own configuration

function Title() {
  const id = useTestId(":title");
  return <h1 {...id}></h1>;
}

function Actions() {
  const [okId, cancelId] = useTestIds([":ok-button", ":cancel-button"]);
  return (
    <div>
      <button {...okId}>Ok</button>
      <button {...cancelId}>Cancel</button>
    </div>
  );
}

function Modal() {
  return (
    <TestId name="some-modal">
      {id => (
        <div {...id}>
          <Title />
          <Actions />
        </div>
      )}
    </TestId>
  )
}
```

`Modal` component above generates next markup:
```HTML
<div data-test-id="some-modal">
    <h1 data-test-id="some-modal:title"></h1>
    <div>
        <button data-test-id="some-modal:ok-button"></button>
        <button data-test-id="some-modal:cancel-button"></button>
    </div>
</div>
```
