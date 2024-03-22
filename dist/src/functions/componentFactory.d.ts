import { MakForm, MakFormComponentOutputType, MakFormDynamicComponent, FormAccessor } from "../types/index";
export declare const getComponentName: (fieldName: string, componentName?: string) => string;
export declare const getInitialComponentNames: ({ formConfig, }: {
    formConfig: MakForm | undefined;
}) => any;
interface ComponentFactoryProps {
    formAccessor: FormAccessor;
    name: string;
    outputType?: MakFormComponentOutputType;
}
declare const componentFactory: ({ formAccessor, name, }: ComponentFactoryProps) => MakFormDynamicComponent;
export default componentFactory;
declare const constructDynamicComponents: (formAccessor: FormAccessor) => {};
export { constructDynamicComponents };
