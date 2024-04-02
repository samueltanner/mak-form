import { MakFormComponentOutputType } from "../types/index";
export declare const ensureSingleElementType: ({ useMakElements, useHTMLElements, useMakComponents, }: {
    useMakElements?: boolean | undefined;
    useHTMLElements?: boolean | undefined;
    useMakComponents?: boolean | undefined;
}) => MakFormComponentOutputType;
export declare const getValueObjectsArray: (value: any, options: any[]) => any[];
export declare const deepEqual: (obj1: any, obj2: any) => boolean;
