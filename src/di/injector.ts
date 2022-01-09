import { ResolvedProvider, ResolvedProviderFactory } from './provider-resolved';
import { Provider, ProviderType } from './shared';

export class InjectorProvider {
	public get dependencyTokens(): ProviderType[] | null {
		return this.resolvedProvider.dependencies;
	}

	private instance: unknown;

	constructor(private readonly resolvedProvider: ResolvedProvider) {}

	public getInstance<T>(dependencies: unknown[]): T {
		if (!this.instance) {
			this.instance = this.resolvedProvider.factory<T>(dependencies);
		}

		return this.instance as T;
	}
}

export class Injector {
	constructor(
		protected providersMap: WeakMap<ProviderType, InjectorProvider>,
		protected parent?: Injector
	) {}

	public static create(providers: Provider[], parent?: Injector): Injector {
		const providersMap = new WeakMap<ProviderType, InjectorProvider>();

		providers.forEach((provider: Provider) => {
			const resolvedProvider = ResolvedProviderFactory.create(provider);
			const injectorProvider = new InjectorProvider(resolvedProvider);

			providersMap.set(resolvedProvider.token, injectorProvider);
		});

		return new Injector(providersMap, parent);
	}

	public get<T>(token: ProviderType): T {
		const provider = this.providersMap.get(token);

		if (provider) {
			const dependencyInstances = this.getDependencyInstances(provider);

			return provider.getInstance(dependencyInstances);
		}

		return this.parent.get(token);
	}

	private getDependencyInstances(provider: InjectorProvider): unknown[] {
		return provider.dependencyTokens?.map((token: ProviderType) =>
			this.get(token)
		);
	}
}
