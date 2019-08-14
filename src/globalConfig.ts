export interface IConfig {
  display: boolean;
  attr: string;
  separator: string;
}

let globalConfig: IConfig = {
  display: true,
  attr: 'data-test-id',
  separator: ':',
};

export default globalConfig;
