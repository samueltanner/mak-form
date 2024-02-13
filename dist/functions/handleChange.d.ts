/// <reference types="react" />
import { InputChangeEvent, MakForm, MakFormValidationOption } from "../types/index";
import { FormAccessor } from "../hook/useMakForm";
interface HandleChangeProps {
    form: FormAccessor["form"];
    event: InputChangeEvent;
    setForm: React.Dispatch<React.SetStateAction<MakForm>>;
    setFormErrors: (errors: any) => void;
    validateOn?: MakFormValidationOption;
}
declare const handleChange: ({ form, event, setForm, validateOn, }: HandleChangeProps) => void;
export default handleChange;
