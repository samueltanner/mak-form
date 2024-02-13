import React from "react";
import { InputChangeEvent, MakForm, MakFormComponentOutputType, MakFormDynamicComponents, MakFormErrors, MakFormInput, MakFormValidationOption } from "../types/index";
interface MakFormProps {
    formConfig?: MakFormInput;
    onSubmit?: (input?: any) => void;
    onReset?: (input?: any) => void;
    useMakElements?: boolean;
    useHTMLElements?: boolean;
    useMakComponents?: boolean;
    validateFormOn?: MakFormValidationOption;
    revalidateFormOn?: MakFormValidationOption;
}
export interface FormAccessor {
    form: MakForm;
    handleChange: ({ event, validateOn, }: {
        event: InputChangeEvent;
        validateOn: MakFormValidationOption;
        revalidateOn?: MakFormValidationOption;
    }) => void;
    formRef: React.MutableRefObject<MakForm | undefined>;
    outputType: MakFormComponentOutputType;
    onSubmit?: (input?: any) => void;
    onReset?: (input?: any) => void;
    validateFormOn?: MakFormValidationOption;
    revalidateFormOn?: MakFormValidationOption;
}
export declare const useMakForm: ({ formConfig, useMakElements, useHTMLElements, useMakComponents, onSubmit, onReset, validateFormOn, revalidateFormOn, }: MakFormProps) => {
    components: MakFormDynamicComponents;
    form: MakForm;
    formState: {
        errors: MakFormErrors;
        values: any;
        dirty: boolean;
        clean: boolean;
    };
    errors: MakFormErrors;
    reset: () => void;
    submit: () => void;
};
export default useMakForm;
