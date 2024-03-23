const validateField = ({ form, fieldName, value, }) => {
    var _a;
    const config = form[fieldName];
    const label = config === null || config === void 0 ? void 0 : config.label;
    const type = ((_a = form[fieldName]) === null || _a === void 0 ? void 0 : _a.type) || "text";
    const required = (config === null || config === void 0 ? void 0 : config.required) || false;
    const pattern = RegExp((config === null || config === void 0 ? void 0 : config.pattern) || ".*");
    const minLength = config === null || config === void 0 ? void 0 : config.minLength;
    const maxLength = config === null || config === void 0 ? void 0 : config.maxLength;
    const min = config === null || config === void 0 ? void 0 : config.min;
    const max = config === null || config === void 0 ? void 0 : config.max;
    const min0 = config === null || config === void 0 ? void 0 : config.min0;
    const max0 = config === null || config === void 0 ? void 0 : config.max0;
    const min1 = config === null || config === void 0 ? void 0 : config.min1;
    const max1 = config === null || config === void 0 ? void 0 : config.max1;
    const errors = {};
    if (required && !value && value !== 0) {
        const errorString = `${label} is required.`;
        // setFormErrors((prev) => ({
        //   ...prev,
        //   [fieldName]: errorString,
        // }))
        errors[fieldName] = errorString;
        return errors;
    }
    if (pattern && !pattern.test(value)) {
        const errorString = "Invalid format.";
        // setFormErrors((prev) => ({ ...prev, [fieldName]: errorString }))
        errors[fieldName] = errorString;
        return errors;
    }
    if (typeof value === "string") {
        const errorString = `Minimum length is ${minLength}.`;
        if (minLength !== undefined && value.length < minLength) {
            // setFormErrors((prev) => ({
            //   ...prev,
            //   [fieldName]: errorString,
            // }))
            errors[fieldName] = errorString;
            return errors;
        }
        if (maxLength !== undefined && value.length > maxLength) {
            const errorString = `Maximum length is ${maxLength}.`;
            // setFormErrors((prev) => ({
            //   ...prev,
            //   [fieldName]: `Maximum length is ${maxLength}.`,
            // }))
            errors[fieldName] = errorString;
            return errors;
        }
    }
    if (type === "number" && typeof value === "number") {
        const errorString = `Minimum value is ${min}.`;
        if (min !== undefined && value < min) {
            // setFormErrors((prev) => ({
            //   ...prev,
            //   [fieldName]: errorString,
            // }))
            errors[fieldName] = errorString;
            return errors;
        }
        if (max !== undefined && value > max) {
            const errorString = `Maximum value is ${max}.`;
            // setFormErrors((prev) => ({
            //   ...prev,
            //   [fieldName]: errorString,
            // }))
            errors[fieldName] = errorString;
            return errors;
        }
    }
    errors[fieldName] = undefined;
    return errors;
};
const validateForm = ({ form }) => {
    const errors = {};
    Object.keys(form).forEach((fieldName) => {
        var _a, _b;
        if (fieldName === "submit" || fieldName === "reset")
            return;
        const value = ((_a = form === null || form === void 0 ? void 0 : form[fieldName]) === null || _a === void 0 ? void 0 : _a.value) || ((_b = form === null || form === void 0 ? void 0 : form[fieldName]) === null || _b === void 0 ? void 0 : _b.defaultValue);
        const validation = validateField({
            fieldName,
            value,
            form,
        });
        if (Object.entries(validation).some(([_, error]) => error)) {
            // errors[fieldName] = error
            errors[fieldName] = validation[fieldName];
        }
        else {
            errors[fieldName] = undefined;
        }
    });
    // setFormErrors((prev) => errors)
    return errors;
};
export { validateField, validateForm };
