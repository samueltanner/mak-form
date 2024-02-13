import React from "react";
import { FieldType, MakFormDynamicComponentProps, MakFormFieldConfig, MakFormValidationOption } from "../types/index";
import { FormAccessor } from "../hook/useMakForm";
type DynamicComponentProps = MakFormDynamicComponentProps & FormAccessor & {
    config: MakFormFieldConfig;
    name: string;
    type: FieldType;
    label: string;
    formOnSubmit?: FormAccessor["onSubmit"];
    formOnReset?: FormAccessor["onReset"];
    validateOn: MakFormValidationOption;
    revalidateOn: MakFormValidationOption;
};
declare const DynamicComponent: React.MemoExoticComponent<(props: DynamicComponentProps) => string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element | null | undefined>;
export default DynamicComponent;
