import React from "react";
import { MakForm as MakFormType, MakFormDynamicComponents, MakFormErrors, MakFormProps } from "..";
interface MakFormContextType {
    form: MakFormType;
    components: MakFormDynamicComponents;
    errors: MakFormErrors;
    formState: {
        errors: MakFormErrors;
        values: any;
        dirty: boolean;
        clean: boolean;
    };
    handleChange: (target: string, value: any) => void;
    reset: () => void;
    submit: () => void;
}
export declare const MakFormProvider: ({ formConfig, useMakElements, useHTMLElements, useMakComponents, onSubmit, onReset, validateFormOn, revalidateFormOn, resetOnSubmit, children, }: MakFormProps) => React.JSX.Element;
export declare const useMakFormContext: () => MakFormContextType;
export {};
