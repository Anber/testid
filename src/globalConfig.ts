import { classNames } from './utils';

export interface IConfig {
  display: boolean;
  attr: string;
  separator: string;
  mappers: {
    [prop: string]: (ownProp: any, childProp: any) => any;
  };
}

let globalConfig: IConfig = {
  display: true,
  attr: 'data-test-id',
  separator: ':',
  mappers: {
    className: classNames,
  },
};

export default globalConfig;
