import { DEPENDENCIES_DEF } from "./constants";
import {
  NormalizedProvider,
  Provider,
  isTypeProvider,
  isClassProvider,
  isValueProvider,
  isFactoryProvider,
} from "./interfaces";
import { ProviderType } from "./provider-type";

export class ResolvedProvider {
  private created: any;

  constructor(
    public token: ProviderType,
    public resolvedFactory: ResolvedReflectiveFactory
  ) {}

  public getOrCreate(depsInstances: any[]): any {
    if (!this.created) {
      this.created = this.resolvedFactory.factory(depsInstances);
    }

    return this.created;
  }
}

export class ResolvedReflectiveFactory {
  constructor(public factory: Function, public dependencies: ProviderType[]) {}
}

export class Injector {
  constructor(
    protected providers: WeakMap<ProviderType, ResolvedProvider>,
    protected parent?: Injector
  ) {}

  public static resolve(providers: Provider[], parent?: Injector): Injector {
    const normalizedProviders: NormalizedProvider[] =
      normalizeProviders(providers);
    const resolvedProvides: ResolvedProvider[] =
      resolveNormalizedProvides(normalizedProviders);
    const resolvedProviderMap: WeakMap<ProviderType, ResolvedProvider> =
      getResolvedProviderMap(resolvedProvides);

    return new Injector(resolvedProviderMap, parent);
  }

  public get<T>(token: ProviderType) {
    const provider = this.providers.get(token);

    if (provider) {
      const deps = [];

      provider?.resolvedFactory.dependencies?.forEach((dep) => {
        deps.push(this.get(dep));
      });

      return provider.getOrCreate(deps);
    }

    return this.parent.get(token);
  }
}

function normalizeProviders(providers: Provider[]): NormalizedProvider[] {
  return providers.map(getNormalizedProvider);
}

function getNormalizedProvider(provider: Provider): NormalizedProvider {
  if (isTypeProvider(provider)) {
    return {
      provide: provider,
      useClass: provider,
    };
  }

  return provider;
}

function resolveNormalizedProvides(
  providers: NormalizedProvider[]
): ResolvedProvider[] {
  return providers.map((provider: NormalizedProvider) => {
    return new ResolvedProvider(
      provider.provide,
      getFactoryForProvider(provider)
    );
  });
}

function getFactoryForProvider(
  provider: NormalizedProvider
): ResolvedReflectiveFactory {
  let factory: Function;
  let dependencies: ProviderType[];

  if (isClassProvider(provider)) {
    factory = (dependencies: ProviderType[]) =>
      new provider.useClass(...dependencies);
    dependencies = provider.useClass[DEPENDENCIES_DEF];
  }

  if (isValueProvider(provider)) {
    factory = () => provider.useValue;
  }

  if (isFactoryProvider(provider)) {
    factory = provider.useFactory;
    dependencies = provider.deps;
  }

  return new ResolvedReflectiveFactory(factory, dependencies);
}

function getResolvedProviderMap(
  providers: ResolvedProvider[]
): WeakMap<ProviderType, ResolvedProvider> {
  const providerMap = new WeakMap<ProviderType, ResolvedProvider>();

  providers.forEach((provider: ResolvedProvider) => {
    providerMap.set(provider.token, provider);
  });

  return providerMap;
}
