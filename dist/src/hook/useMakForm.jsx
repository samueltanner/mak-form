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
    console.log({ makFormoutputtype: outputType });
    const formRef = useRef();
    const errorsRef = useRef({});
    const beforeValidationErrorsRef = useRef({});
    const [form, setForm] = useState(formConfig || {});
    const [formErrors, setFormErrors] = useState(Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
        if (!["button", "submit", "reset"].includes(value === null || value === void 0 ? void 0 : value.type)) {
            ;
            acc[key] = undefined;
        }
        return acc;
    }, {}));
    const [dynamicComponents, setDynamicComponents] = useState(getInitialComponentNames({ formConfig }));
    const [isDirty, setIsDirty] = useState(false);
    const [isClean, setIsClean] = useState(true);
    useEffect(() => {
        setIsClean(!isDirty);
    }, [isDirty]);
    const formAccessor = {
        form,
        handleChange,
        outputType,
        onSubmit: handleSubmit,
        onReset: handleReset,
        validateFormOn,
        revalidateFormOn,
        formRef,
    };
    function handleChange({ event, validateOn, revalidateOn, }) {
        var _a, _b, _c;
        setIsDirty(true);
        const target = event.target;
        const value = (target === null || target === void 0 ? void 0 : target.type) === "checkbox" ? target.checked : target.value;
        const fieldName = target.name;
        let validation = undefined;
        if (validateOn === "change" || validateFormOn === "change") {
            validation = (_a = validateField({
                form,
                fieldName,
                value,
            })) === null || _a === void 0 ? void 0 : _a[fieldName];
            setFormErrors((prev) => {
                const updatedErrors = Object.assign(Object.assign({}, prev), { [fieldName]: validation });
                return updatedErrors;
            });
        }
        if (((_b = errorsRef.current) === null || _b === void 0 ? void 0 : _b[fieldName]) &&
            (revalidateFormOn === "change" || revalidateOn === "change")) {
            validation = (_c = validateField({
                form,
                fieldName,
                value,
            })) === null || _c === void 0 ? void 0 : _c[fieldName];
            setFormErrors((prev) => {
                const updatedErrors = Object.assign(Object.assign({}, prev), { [fieldName]: validation });
                return updatedErrors;
            });
        }
        setForm((prev) => {
            const updatedForm = Object.assign(Object.assign({}, prev), { [fieldName]: Object.assign(Object.assign(Object.assign({}, prev[fieldName]), target), { errors: validation }) });
            return updatedForm;
        });
        beforeValidationErrorsRef.current = validateForm({
            form: formRef.current || {},
        });
    }
    function handleSubmit() {
        const validation = validateForm({ form: formRef.current || {} });
        setFormErrors(validation);
        if (formErrors && Object.values(validation).some((error) => error)) {
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
        setForm(constructedForm);
        setDynamicComponents(constructDynamicComponents(formAccessor));
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
    useEffect(() => {
        formRef.current = form;
    }, [form]);
    useEffect(() => {
        errorsRef.current = formErrors;
    }, [formErrors]);
    return {
        form,
        components: dynamicComponents,
        errors: formErrors,
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
