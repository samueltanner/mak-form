/// <reference types="react" />
export type GenericObject = Record<string, any>;
export type NestedObject = {
    [key: string]: any;
};
export type TailwindCustomColors = NestedObject | GenericObject | undefined;
export type MakFormValidationOption = "change" | "blur" | "submit" | "reset" | "none";
export type InputChangeEvent = {
    target: {
        name: string;
        value: string | string[] | number | boolean | number[];
        type: string;
    };
};
export type MakFormDynamicComponent = (props: MakFormDynamicComponentProps) => JSX.Element;
export type MakFormDynamicComponents = {
    [key: string]: MakFormDynamicComponent;
};
export type MakFormComponentOutputType = "makElements" | "htmlElements" | "makComponents";
export type OptionType = {
    label: string;
    value: string | number;
    [key: string]: string | number | undefined;
};
export type ValueOptions = string | boolean | undefined | number | OptionType | OptionType[] | boolean | string[] | number[];
export type FieldType = "color" | "button" | "boolean" | "bounded-range" | "button" | "date" | "datetime" | "datetime-local" | "time" | "week" | "month" | "multi-select" | "number" | "password" | "radio" | "radio-group" | "range" | "select" | "searchable-select" | "text" | "toggle" | "checkbox" | "email" | "search" | "tel" | "time" | "submit" | "reset";
export interface BaseFieldConfig {
    type: FieldType;
    label: string;
    name?: string;
    id?: string;
    required?: boolean;
    defaultValue?: ValueOptions;
    disabled?: boolean;
    makClassName?: string;
    className?: string;
    value?: ValueOptions;
    placeholder?: string;
    readonly?: boolean;
    hide?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    pattern?: string | RegExp;
    onClick?: (props?: any) => void;
    onChange?: (props?: any) => void;
    onBlur?: (props?: any) => void;
    onFocus?: (props?: any) => void;
    onReset?: (props?: any) => void;
    onSubmit?: (props?: any) => void;
    validateOn?: MakFormValidationOption;
    revalidateOn?: MakFormValidationOption;
    children?: React.ReactNode;
    customComponent?: React.ReactNode | null;
    componentName?: string;
}
export interface ColorFieldConfig extends BaseFieldConfig {
    type: "color";
}
export interface TextFieldConfig extends BaseFieldConfig {
    type: "text" | "password" | "email" | "search" | "tel";
    minLength?: number;
    maxLength?: number;
}
export interface PasswordFieldConfig extends TextFieldConfig {
    type: "password";
}
export interface SelectFieldConfig extends BaseFieldConfig {
    type: "select" | "radio" | "multi-select" | "searchable-select" | "radio-group";
    options: OptionType[];
    labelKey?: string;
    valueKey?: string;
    multiple?: boolean;
    autoComplete?: string;
    size?: number;
    searchable?: boolean;
    clearable?: boolean;
    dismissOnClick?: boolean;
}
export interface BooleanFieldConfig extends BaseFieldConfig {
    type: "boolean" | "checkbox" | "toggle";
    checked?: boolean;
    defaultChecked?: boolean;
}
export interface ButtonFieldConfig extends BaseFieldConfig {
    type: "button" | "submit" | "reset";
}
export interface NumberFieldConfig extends BaseFieldConfig {
    type: "number" | "range" | "bounded-range";
    min?: number;
    max?: number;
    step?: number;
}
export interface DateFieldConfig extends BaseFieldConfig {
    type: "date" | "datetime" | "datetime-local" | "month" | "time" | "week";
    min?: number;
    max?: number;
    step?: number;
}
export interface BoundedRangeFieldConfig extends NumberFieldConfig {
    type: "bounded-range";
    min0?: number;
    max0?: number;
    min1?: number;
    max1?: number;
    step?: number;
    value0?: number;
    value1?: number;
    step0?: number;
    step1?: number;
    range?: [number | undefined, number | undefined];
    disabled0?: boolean;
    disabled1?: boolean;
    defaultValue0?: number;
    defaultValue1?: number;
}
export type MakFormFieldConfig = TextFieldConfig | ColorFieldConfig | SelectFieldConfig | BooleanFieldConfig | ButtonFieldConfig | NumberFieldConfig | DateFieldConfig | PasswordFieldConfig | BoundedRangeFieldConfig;
export type MakFormInput = {
    [Key in string]: MakFormFieldConfig;
};
export type MakFormElementErrors = string | undefined;
export type MakFormErrors = {
    [key: string]: MakFormElementErrors;
};
export type MakFormElement = MakFormFieldConfig & {
    errors?: MakFormElementErrors;
    component?: MakFormDynamicComponent;
};
export type MakForm = {
    [key: string]: MakFormElement | MakFormErrors | undefined;
    formErrors?: MakFormErrors;
};
export type MakFormDynamicComponentProps = {
    children?: React.ReactNode | ((props: MakFormChildrenProps) => React.ReactNode);
    customComponent?: React.ElementType<MakFormChildrenProps> | React.ReactNode;
    required?: boolean;
    defaultValue?: ValueOptions;
    disabled?: boolean;
    makClassName?: string;
    className?: string;
    value?: ValueOptions;
    valueObjects?: OptionType[];
    placeholder?: string;
    readonly?: boolean;
    hide?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    pattern?: string | RegExp;
    minLength?: number;
    maxLength?: number;
    options?: OptionType[];
    labelKey?: string;
    valueKey?: string;
    multiple?: boolean;
    size?: number;
    searchable?: boolean;
    clearable?: boolean;
    dismissOnClick?: boolean;
    checked?: boolean;
    min?: number;
    max?: number;
    step?: number;
    min0?: number;
    max0?: number;
    min1?: number;
    max1?: number;
    step0?: number;
    step1?: number;
    range?: [number | undefined, number | undefined];
    defaultValue0?: number;
    defaultValue1?: number;
    value0?: number;
    value1?: number;
    disabled0?: boolean;
    disabled1?: boolean;
    onClick?: (props?: any) => void;
    onChange?: (props?: any) => void;
    onBlur?: (props?: any) => void;
    onFocus?: (props?: any) => void;
    onReset?: (props?: any) => void;
    onSubmit?: (props?: any) => void;
    validateOn?: MakFormValidationOption;
    revalidateOn?: MakFormValidationOption;
};
export type MakFormChildrenProps = MakFormDynamicComponentProps & FormAccessor & {
    config: MakFormFieldConfig;
    name: string;
    type: FieldType;
    label: string;
    formOnSubmit?: FormAccessor["onSubmit"];
    formOnReset?: FormAccessor["onReset"];
    validateOn: MakFormValidationOption;
    revalidateOn: MakFormValidationOption;
    handleChange: (e?: any) => void;
};
export interface MakFormProps {
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
