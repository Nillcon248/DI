import { Type } from "./type.interface";

export type ProvideInType = Type | "root";

export interface InjectionOptions {
  providedIn: ProvideInType;
}
