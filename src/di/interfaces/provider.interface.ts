import { Type } from "./type.interface";

export interface ProviderBase {
  provide: any;
  multi?: boolean;
}

export interface TypeProvider extends Type {}

export interface ClassProvider extends ProviderBase {
  useClass: Type;
}

export interface ValueProvider extends ProviderBase {
  useValue: any;
}

export interface ConstructorProvider extends ProviderBase {
  deps?: any[];
}

export interface ExistingProvider extends ProviderBase {
  useExisting: any;
}

export interface FactoryProvider extends ProviderBase {
  useFactory: Function;
  deps?: any[];
}

export type Provider =
  | TypeProvider
  | ValueProvider
  | ClassProvider
  | ConstructorProvider
  | ExistingProvider
  | FactoryProvider;

export type NormalizedProvider =
  | ValueProvider
  | ClassProvider
  | ConstructorProvider
  | ExistingProvider
  | FactoryProvider;

export function isTypeProvider(provider: Provider): provider is TypeProvider {
  return provider instanceof Type;
}

export function isClassProvider(provider: Provider): provider is ClassProvider {
  return !!(provider as ClassProvider)?.useClass;
}

export function isValueProvider(provider: Provider): provider is ValueProvider {
  return !!(provider as ValueProvider)?.useValue;
}

export function isFactoryProvider(
  provider: Provider
): provider is FactoryProvider {
  return !!(provider as FactoryProvider)?.useFactory;
}
