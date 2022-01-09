import {
	ClassProvider,
	DEPENDENCIES_DEF,
	FactoryProvider,
	InstanceProvider,
	isClassProvider,
	isFactoryProvider,
	isInstanceProvider,
	isValueProvider,
	Provider,
	ProviderBase,
	ProviderType,
	ValueProvider,
} from "./shared";

export class ResolvedProviderFactory {
	public static create(provider: Provider): ResolvedProvider {
		if (isInstanceProvider(provider)) {
			return new ResolvedInstanceProvider(provider);
		}

		if (isClassProvider(provider)) {
			return new ResolvedClassProvider(provider);
		}

		if (isValueProvider(provider)) {
			return new ResolvedValueProvider(provider);
		}

		if (isFactoryProvider(provider)) {
			return new ResolvedFactoryProvider(provider);
		}
	}
}

export abstract class ResolvedProvider {
	public abstract get token(): ProviderType;
	public abstract get dependencies(): ProviderType[] | null;

	public abstract factory<T>(dependencies: unknown[]): T;

	protected readonly provider: Provider;
}

export class ResolvedInstanceProvider extends ResolvedProvider {
	public get token(): ProviderType {
		return this.provider;
	}

	public get dependencies(): ProviderType[] {
		return this.provider[DEPENDENCIES_DEF];
	}

	constructor(protected readonly provider: InstanceProvider) {
		super();
	}

	public factory<T>(dependencies: unknown[]): T {
		return new this.provider(...dependencies) as T;
	}
}

export class ResolvedClassProvider extends ResolvedProvider {
	public get token(): ProviderType {
		return this.provider.provide;
	}

	public get dependencies(): ProviderType[] {
		return this.provider.useClass[DEPENDENCIES_DEF];
	}

	constructor(protected readonly provider: ClassProvider) {
		super();
	}

	public factory<T>(dependencies: unknown[]): T {
		return new this.provider.useClass(dependencies) as T;
	}
}

export class ResolvedValueProvider extends ResolvedProvider {
	public get token(): ProviderType {
		return this.provider.provide;
	}

	public get dependencies(): null {
		return null;
	}

	constructor(protected readonly provider: ValueProvider) {
		super();
	}

	public factory<T>(): T {
		return this.provider.useValue as T;
	}
}

export class ResolvedFactoryProvider extends ResolvedProvider {
	public get token(): ProviderType {
		return this.provider.provide;
	}

	public get dependencies(): ProviderType[] {
		return this.provider.deps;
	}

	constructor(protected readonly provider: FactoryProvider) {
		super();
	}

	public factory<T>(dependencies: unknown[]): T {
		return this.provider.useFactory(dependencies);
	}
}
