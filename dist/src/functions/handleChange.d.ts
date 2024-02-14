/// <reference types="react" />
import { InputChangeEvent, MakForm, MakFormValidationOption, FormAccessor } from "../types/index";
interface HandleChangeProps {
    form: FormAccessor["form"];
    event: InputChangeEvent;
    setForm: React.Dispatch<React.SetStateAction<MakForm>>;
    setFormErrors: (errors: any) => void;
    validateOn?: MakFormValidationOption;
}
declare const handleChange: ({ form, event, setForm, validateOn, }: HandleChangeProps) => void;
export default handleChange;
