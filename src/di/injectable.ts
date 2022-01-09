import "reflect-metadata";
import { DEPENDENCIES_DEF } from "./constants";
import { InjectionOptions } from "./interfaces";

export function Injectable(options?: InjectionOptions): any {
  return (targetClass: Function) => {
    const deps = Reflect.getMetadata("design:paramtypes", targetClass);

    const parameters = targetClass.hasOwnProperty(DEPENDENCIES_DEF)
      ? (targetClass as any)[DEPENDENCIES_DEF]
      : Object.defineProperty(targetClass, DEPENDENCIES_DEF, { value: [] })[
          DEPENDENCIES_DEF
        ];

    deps?.map((type: unknown, index: number) => (parameters[index] ??= type));

    return targetClass;
  };
}
