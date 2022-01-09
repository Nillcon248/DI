import { InjectionOptions } from "./interfaces";

export class InjectionToken {
  constructor(
    public readonly description: string,
    public readonly options?: InjectionOptions
  ) {}
}
