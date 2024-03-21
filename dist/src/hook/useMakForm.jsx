import { constructDynamicComponents, getInitialComponentNames, } from "../functions/componentFactory";
import constructForm from "../functions/constructForm";
import { ensureSingleElementType } from "../functions/helpers";
import { useEffect, useRef, useState } from "react";
import { validateField, validateForm } from "../functions/validate";
export const useMakForm = ({ formConfig, useMakElements, useHTMLElements, useMakComponents, onSubmit, onReset, validateFormOn = "submit", revalidateFormOn = "none", }) => {
    const outputType = ensureSingleElementType({
        useMakElements,
        useHTMLElements,
        useMakComponents,
    });
    const formRef = useRef(formConfig || {});
    const originalFormRef = useRef();
    const errorsRef = useRef({});
    const beforeValidationErrorsRef = useRef(Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
        if (!["button", "submit", "reset"].includes(value === null || value === void 0 ? void 0 : value.type)) {
            ;
            acc[key] = undefined;
        }
        return acc;
    }, {}));
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    // const [formErrors, setFormErrors] = useState<MakFormErrors>(
    //   Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
    //     if (!["button", "submit", "reset"].includes((value as any)?.type)) {
    //       ;(acc as MakFormErrors)[key] = undefined
    //     }
    //     return acc
    //   }, {})
    // )
    const [dynamicComponents, setDynamicComponents] = useState(getInitialComponentNames({ formConfig }));
    const [isDirty, setIsDirty] = useState(false);
    const [isClean, setIsClean] = useState(true);
    useEffect(() => {
        setIsClean(!isDirty);
    }, [isDirty]);
    const formAccessor = {
        form: formRef.current,
        handleChange,
        outputType,
        onSubmit: handleSubmit,
        onReset: handleReset,
        validateFormOn,
        revalidateFormOn,
        formRef,
    };
    function handleChange({ event, validateOn, revalidateOn, }) {
        var _a;
        setIsDirty(true);
        const target = event.target;
        const value = (target === null || target === void 0 ? void 0 : target.type) === "checkbox" ? target.checked : target.value;
        const fieldName = target.name;
        const prev = formRef.current;
        const prevField = prev[fieldName];
        const updatedValue = Object.assign({}, prevField);
        updatedValue["value"] = value;
        updatedValue["errors"] = undefined;
        const updatedForm = Object.assign(Object.assign({}, prev), { [fieldName]: Object.assign({}, updatedValue) });
        const validation = (_a = validateField({
            form: updatedForm,
            fieldName,
            value,
        })) === null || _a === void 0 ? void 0 : _a[fieldName];
        updatedForm[fieldName].errors = validation;
        formRef.current = updatedForm;
        setForm(updatedForm);
        const continuousValidationErrors = Object.assign(Object.assign({}, beforeValidationErrorsRef.current), { [fieldName]: validation });
        beforeValidationErrorsRef.current =
            continuousValidationErrors;
        if (validateOn === "change" ||
            validateFormOn === "change" ||
            revalidateFormOn === "change" ||
            revalidateOn === "change") {
            errorsRef.current = beforeValidationErrorsRef.current;
            setErrors(errorsRef.current);
        }
    }
    function handleSubmit() {
        const validation = validateForm({ form: formRef.current || {} });
        console.log("validation", validation);
        if (Object.values(validation).some((error) => error)) {
            errorsRef.current = validation;
            setErrors(errorsRef.current);
            return;
        }
        if (onSubmit) {
            onSubmit(formRef.current);
        }
        constructFormAndComponents();
    }
    function handleReset() {
        if (onReset) {
            onReset();
        }
        else {
            constructFormAndComponents();
        }
    }
    const constructFormAndComponents = () => {
        if (!formConfig)
            return;
        const constructedForm = constructForm(formAccessor);
        if (originalFormRef.current) {
            const dynamicComponents = constructDynamicComponents(Object.assign(Object.assign({}, formAccessor), { form: originalFormRef.current }));
            setDynamicComponents(dynamicComponents);
        }
        else {
            formRef.current = constructedForm;
            const errors = validateForm({ form: constructedForm });
            beforeValidationErrorsRef.current = errors;
            originalFormRef.current = constructedForm;
            const dynamicComponents = constructDynamicComponents(formAccessor);
            setDynamicComponents(dynamicComponents);
        }
        setIsDirty(false);
    };
    const getFormValues = () => {
        if (!formRef.current)
            return;
        const formValues = Object.entries(formRef.current).reduce((acc, [key, value]) => {
            if ((value === null || value === void 0 ? void 0 : value.type) !== "submit" && (value === null || value === void 0 ? void 0 : value.type) !== "reset") {
                ;
                acc[key] = value === null || value === void 0 ? void 0 : value.value;
            }
            return acc;
        }, {});
        return formValues;
    };
    useEffect(() => {
        constructFormAndComponents();
    }, [formConfig]);
    return {
        form: form,
        components: dynamicComponents,
        errors: errors,
        formState: {
            errors: beforeValidationErrorsRef.current,
            values: getFormValues(),
            dirty: isDirty,
            clean: isClean,
        },
        reset: handleReset,
        submit: handleSubmit,
    };
};
export default useMakForm;
