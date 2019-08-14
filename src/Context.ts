import * as React from 'react';

const Context = React.createContext('');
const { Provider, Consumer } = Context;

export { Provider, Consumer };
export default Context;
