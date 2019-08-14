import * as React from 'react';

import globalConfig from './globalConfig';
import Context from './Context';

export const useRole = (
  name: string,
  relative = name.indexOf(globalConfig.separator) === 0
) => {
  const namespace = React.useContext(Context);
  const role = relative ? `${namespace}${name}` : name;
  return React.useMemo(
    () => ({
      [globalConfig.attr]: role,
    }),
    [globalConfig.attr, role]
  );
};

export const useRoles = (names: string[]) => {
  const namespace = React.useContext(Context);
  return names
    .map(name =>
      name === null || name.indexOf(globalConfig.separator) === 0
        ? `${namespace}${name || ''}`
        : name
    )
    .map(role => ({
      [globalConfig.attr]: role,
    }));
};
