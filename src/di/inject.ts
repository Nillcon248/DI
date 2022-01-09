import { DEPENDENCIES_DEF } from "./constants";
import { ProviderType } from "./provider-type";

export function Inject(provider: ProviderType) {
  return function (
    targetClass: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    const parameters = targetClass.hasOwnProperty(DEPENDENCIES_DEF)
      ? (targetClass as any)[DEPENDENCIES_DEF]
      : Object.defineProperty(targetClass, DEPENDENCIES_DEF, { value: [] })[
          DEPENDENCIES_DEF
        ];

    parameters[parameterIndex] = provider;
  };
}
