import { MakFormComponentOutputType } from "../types/index";
import { GenericObject } from "@mak-stack/mak-ui";
export declare const isEmptyObject: (obj: GenericObject | undefined) => boolean;
export declare const isNestedObject: (obj: GenericObject) => boolean;
export declare const isObject: (v: any) => v is GenericObject;
export declare const deepMerge: (...objects: (GenericObject | undefined)[]) => {};
export declare const getDifference: (x: GenericObject | any[], y?: GenericObject | any[], isRoot?: boolean) => any;
export declare const isEqual: (x: any, y: any) => boolean;
export declare const mergeWithFallback: (primary: any, fallback: any) => any;
export declare const ensureSingleElementType: ({ useMakElements, useHTMLElements, useMakComponents, }: {
    useMakElements?: boolean | undefined;
    useHTMLElements?: boolean | undefined;
    useMakComponents?: boolean | undefined;
}) => MakFormComponentOutputType;
export declare const getValueObjectsArray: (value: any, options: any[]) => any[];
