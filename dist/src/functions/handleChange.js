import { validateField } from "./validate";
const handleChange = ({ form, event, setForm, validateOn, }) => {
    var _a;
    const target = event.target;
    const value = (target === null || target === void 0 ? void 0 : target.type) === "checkbox" ? target.checked : target.value;
    const fieldName = target.name;
    let validation = undefined;
    if (validateOn === "change" || validateOn === "blur") {
        validation = (_a = validateField({
            form,
            fieldName,
            value,
        })) === null || _a === void 0 ? void 0 : _a[fieldName];
    }
    setForm((prev) => {
        const updatedForm = Object.assign(Object.assign({}, prev), { [fieldName]: Object.assign(Object.assign(Object.assign({}, prev[fieldName]), target), { errors: validation }) });
        return updatedForm;
    });
};
export default handleChange;
