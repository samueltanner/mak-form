import { MakForm } from "../types/index";
import { FormAccessor } from "../hook/useMakForm";
declare const constructForm: (formAccessor: FormAccessor) => MakForm;
export default constructForm;
