import { ResolvedProvider, ResolvedProviderFactory } from './provider-resolved';
import { Provider, ProviderType } from './shared';

export class InjectorProvider {
	public get dependencyTokens(): ProviderType[] | null {
		return this.resolvedProvider.dependencies;
	}

	private instance: unknown;

	constructor(private readonly resolvedProvider: ResolvedProvider) {}

	public getInstance(dependencies: unknown[]): unknown {
		if (!this.instance) {
			this.instance = this.resolvedProvider.factory(dependencies);
		}

		return this.instance;
	}
}

export class InjectorProviderWeakMap extends WeakMap<
	ProviderType,
	InjectorProvider[]
> {
	add(key: ProviderType, value: InjectorProvider): this {
		const previousValue: InjectorProvider[] = this.get(key) || [];

		previousValue.push(value);
		super.set(key, previousValue);

		return this;
	}
}

export class Injector {
	constructor(
		protected providersMap: InjectorProviderWeakMap,
		protected parent?: Injector
	) {}

	public static create(providers: Provider[], parent?: Injector): Injector {
		const providersMap = new InjectorProviderWeakMap();

		providers.forEach((provider: Provider) => {
			const resolvedProvider = ResolvedProviderFactory.create(provider);
			const injectorProvider = new InjectorProvider(resolvedProvider);

			providersMap.add(resolvedProvider.token, injectorProvider);
		});

		return new Injector(providersMap, parent);
	}

	public get<T>(token: ProviderType): T {
		const providers = this.providersMap.get(token);

		if (providers) {
			const providerInstances = this.getProviderInstances(providers);

			return this.getFirstItemIfAloneInArray(providerInstances) as T;
		}

		return this.parent?.get<T>(token);
	}

	private getProviderInstances(providers: InjectorProvider[]): unknown[] {
		return providers.map((provider: InjectorProvider) => {
			const dependencyInstances = this.getDependencyInstances(provider);

			return provider.getInstance(dependencyInstances);
		});
	}

	private getFirstItemIfAloneInArray(providerInstances: unknown[]): any {
		return providerInstances.length > 1
			? providerInstances
			: providerInstances[0];
	}

	private getDependencyInstances(provider: InjectorProvider): unknown[] {
		return provider.dependencyTokens?.map((token: ProviderType) =>
			this.get(token)
		);
	}
}
