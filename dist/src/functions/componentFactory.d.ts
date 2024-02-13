import { MakForm, MakFormComponentOutputType, MakFormDynamicComponent } from "../types/index";
import { FormAccessor } from "../hook/useMakForm";
export declare const getComponentName: (fieldName: string) => string;
export declare const getInitialComponentNames: ({ formConfig, }: {
    formConfig: MakForm | undefined;
}) => any;
interface ComponentFactoryProps {
    formAccessor: FormAccessor;
    name: string;
    outputType: MakFormComponentOutputType;
}
declare const componentFactory: ({ formAccessor, name, }: ComponentFactoryProps) => MakFormDynamicComponent;
export default componentFactory;
declare const constructDynamicComponents: (formAccessor: FormAccessor) => {};
export { constructDynamicComponents };
