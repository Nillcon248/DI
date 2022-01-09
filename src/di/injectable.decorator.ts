import 'reflect-metadata';
import { DEPENDENCIES_DEF, PARAMETER_TYPES } from './shared';

export function Injectable(): any {
	return (targetClass: Function) => {
		const dependencies = Reflect.getMetadata(PARAMETER_TYPES, targetClass);
		const parameters = getClassDependenciesProperty();

		fillDependenciesInjectedParameters();

		return targetClass;

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

		function fillDependenciesInjectedParameters(): void {
			dependencies?.map(
				(type: unknown, index: number) => (parameters[index] ??= type)
			);
		}
	};
}
