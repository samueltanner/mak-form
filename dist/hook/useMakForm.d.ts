import { MakForm, MakFormDynamicComponents, MakFormErrors, MakFormProps } from "../types/index";
export declare const useMakForm: ({ formConfig, useMakElements, useHTMLElements, useMakComponents, onSubmit, onReset, validateFormOn, revalidateFormOn, resetOnSubmit, }: MakFormProps) => {
    components: MakFormDynamicComponents;
    form: MakForm;
    formState: {
        errors: MakFormErrors;
        values: any;
        dirty: boolean;
        clean: boolean;
    };
    errors: MakFormErrors;
    handleChange: (target: string, value: any) => void;
    reset: () => void;
    submit: () => void;
};
export default useMakForm;
