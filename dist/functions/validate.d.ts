import { MakForm, MakFormErrors } from "../types/index";
declare const validateField: ({ form, fieldName, value, }: {
    form: MakForm;
    fieldName: string;
    value: any;
}) => MakFormErrors;
declare const validateForm: ({ form }: {
    form: MakForm;
}) => MakFormErrors;
export { validateField, validateForm };
