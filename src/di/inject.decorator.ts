import { DEPENDENCIES_DEF, ProviderType } from "./shared";

export function Inject(provider: ProviderType) {
	return function (
		targetClass: Object,
		_propertyKey: string | symbol,
		parameterIndex: number
	): void {
		const parameters = getClassDependenciesProperty();
		parameters[parameterIndex] = provider;

		function getClassDependenciesProperty(): Object {
			return targetClass.hasOwnProperty(DEPENDENCIES_DEF)
				? targetClass[DEPENDENCIES_DEF]
				: defineProperty();
		}

		function defineProperty(): Object {
			return Object.defineProperty(targetClass, DEPENDENCIES_DEF, {
				value: [],
			})[DEPENDENCIES_DEF];
		}
	};
}
