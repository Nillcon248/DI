export const Type = Function;

export interface Type extends Function {
  new (...args: any[]): unknown;
}
