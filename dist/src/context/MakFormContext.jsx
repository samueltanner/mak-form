import React, { createContext, useContext, useEffect, useRef, useState, } from "react";
import componentFactory, { constructDynamicComponents, getComponentName, getInitialComponentNames, } from "@/functions/componentFactory";
import { validateField, validateForm } from "@/functions/validate";
import { ensureSingleElementType } from "@/functions/helpers";
import constructForm from "@/functions/constructForm";
const MakFormContext = createContext(undefined);
export const MakFormProvider = ({ formConfig, useMakElements, useHTMLElements, useMakComponents, onSubmit, onReset, validateFormOn = "submit", revalidateFormOn = "none", resetOnSubmit = true, children, }) => {
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
        const value = target.value || target.checked;
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
    const handlePublicChange = (name, value) => {
        var _a, _b;
        const elementType = (_a = formRef.current[name]) === null || _a === void 0 ? void 0 : _a.type;
        const event = {
            target: { name: name, value, type: elementType },
        };
        handleChange({
            event,
            validateOn: "change",
            revalidateOn: "change",
        });
        const componentName = getComponentName(name, (_b = formConfig === null || formConfig === void 0 ? void 0 : formConfig[name]) === null || _b === void 0 ? void 0 : _b.componentName);
        const proxyAccessor = Object.assign(Object.assign({}, formAccessor), { form: formRef.current });
        const dynamicComponent = componentFactory({
            formAccessor: proxyAccessor,
            name,
        });
        const updatedDynamicComponents = Object.assign(Object.assign({}, dynamicComponents), { [componentName]: dynamicComponent });
        setDynamicComponents(updatedDynamicComponents);
    };
    function handleSubmit() {
        const validation = validateForm({ form: form || {} });
        if (Object.values(validation).some((error) => error)) {
            errorsRef.current = validation;
            setErrors(errorsRef.current);
            const errorsOnly = Object.entries(validation).reduce((acc, [key, value]) => {
                if (value) {
                    ;
                    acc[key] = value;
                }
                return acc;
            }, {});
            console.warn("Form has errors:", errorsOnly);
            return;
        }
        if (onSubmit) {
            onSubmit(getFormValues());
        }
        if (resetOnSubmit) {
            constructFormAndComponents();
        }
    }
    function handleReset() {
        if (onReset) {
            onReset();
        }
        else {
            setForm(originalFormRef.current);
            formRef.current = originalFormRef.current;
            constructFormAndComponents();
        }
    }
    const constructFormAndComponents = () => {
        if (!formConfig)
            return;
        const constructedForm = constructForm(formAccessor);
        if (originalFormRef.current) {
            const generatedDynamicComponents = constructDynamicComponents(Object.assign(Object.assign({}, formAccessor), { form: originalFormRef.current }));
            setDynamicComponents(generatedDynamicComponents);
            setForm(constructedForm);
        }
        else {
            formRef.current = constructedForm;
            const errors = validateForm({ form: constructedForm });
            beforeValidationErrorsRef.current = errors;
            originalFormRef.current = constructedForm;
            setForm(originalFormRef.current);
            const generatedDynamicComponents = constructDynamicComponents(formAccessor);
            setDynamicComponents(generatedDynamicComponents);
        }
        setIsDirty(false);
    };
    function getFormValues() {
        if (!formRef.current)
            return undefined;
        const formValues = Object.entries(formRef.current).reduce((acc, [key, value]) => {
            var _a;
            if ((value === null || value === void 0 ? void 0 : value.type) !== "submit" && (value === null || value === void 0 ? void 0 : value.type) !== "reset") {
                ;
                acc[key] = value === null || value === void 0 ? void 0 : value.value;
            }
            if (((_a = formConfig === null || formConfig === void 0 ? void 0 : formConfig[key]) === null || _a === void 0 ? void 0 : _a.type) === "number") {
                ;
                acc[key] = Number(value === null || value === void 0 ? void 0 : value.value) || 0;
            }
            return acc;
        }, {});
        return formValues;
    }
    useEffect(() => {
        constructFormAndComponents();
    }, [formConfig]);
    const value = {
        form: form,
        components: dynamicComponents,
        errors: errors,
        formState: {
            errors: beforeValidationErrorsRef.current,
            values: getFormValues(),
            dirty: isDirty,
            clean: isClean,
        },
        handleChange: handlePublicChange,
        reset: handleReset,
        submit: handleSubmit,
    };
    return (<MakFormContext.Provider value={value}>{children}</MakFormContext.Provider>);
};
export const useMakFormContext = () => {
    const context = useContext(MakFormContext);
    if (context === undefined) {
        throw new Error("MakForm must be used within a FormProvider");
    }
    return context;
};
