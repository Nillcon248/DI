import { InjectionToken } from "../injection-token";

export const InstanceProvider = Function;

export interface InstanceProvider extends Function {
	new (...args: any[]): unknown;
}

export interface ProviderBase {
	provide: ProviderType;
	multi?: boolean;
}

export interface ClassProvider extends ProviderBase {
	useClass: InstanceProvider;
}

export interface ValueProvider extends ProviderBase {
	useValue: any;
}

export interface FactoryProvider extends ProviderBase {
	useFactory: Function;
	deps?: any[];
}

export type Provider =
	| InstanceProvider
	| ValueProvider
	| ClassProvider
	| FactoryProvider;

export type NormalizedProvider =
	| ValueProvider
	| ClassProvider
	| FactoryProvider;

export type ProviderType = InstanceProvider | InjectionToken;

export function isInstanceProvider(
	provider: Provider
): provider is InstanceProvider {
	return provider instanceof InstanceProvider;
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
