import { MakForm, MakFormDynamicComponents, MakFormErrors, MakFormProps } from "../types/index";
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
