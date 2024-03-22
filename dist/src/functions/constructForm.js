import componentFactory from "./componentFactory";
const constructForm = (formAccessor) => {
    const { form, outputType } = formAccessor;
    const constructedForm = {};
    Object.keys(form || {}).forEach((name) => {
        var _a;
        const config = form[name];
        const children = config === null || config === void 0 ? void 0 : config.children;
        const customComponent = config === null || config === void 0 ? void 0 : config.customComponent;
        const componentName = config === null || config === void 0 ? void 0 : config.componentName;
        const type = ((_a = form[name]) === null || _a === void 0 ? void 0 : _a.type) || "text";
        const label = config === null || config === void 0 ? void 0 : config.label;
        const required = config === null || config === void 0 ? void 0 : config.required;
        const defaultValue = config === null || config === void 0 ? void 0 : config.defaultValue;
        const disabled = config === null || config === void 0 ? void 0 : config.disabled;
        const className = config === null || config === void 0 ? void 0 : config.className;
        const makClassName = config === null || config === void 0 ? void 0 : config.makClassName;
        const value = (config === null || config === void 0 ? void 0 : config.value) || defaultValue;
        const placeholder = config === null || config === void 0 ? void 0 : config.placeholder;
        const readonly = config === null || config === void 0 ? void 0 : config.readonly;
        const hide = config === null || config === void 0 ? void 0 : config.hide;
        const autoFocus = config === null || config === void 0 ? void 0 : config.autoFocus;
        const autoComplete = config === null || config === void 0 ? void 0 : config.autoComplete;
        const pattern = config === null || config === void 0 ? void 0 : config.pattern;
        // "text" | "password"
        const minLength = config === null || config === void 0 ? void 0 : config.minLength;
        const maxLength = config === null || config === void 0 ? void 0 : config.maxLength;
        // "select" | "radio" | "multi-select" | "searchable-select"
        const options = config === null || config === void 0 ? void 0 : config.options;
        const labelKey = (config === null || config === void 0 ? void 0 : config.labelKey) || "label";
        const valueKey = (config === null || config === void 0 ? void 0 : config.valueKey) || "value";
        const multiple = config === null || config === void 0 ? void 0 : config.multiple;
        const size = config === null || config === void 0 ? void 0 : config.size;
        const searchable = config === null || config === void 0 ? void 0 : config.searchable;
        const clearable = config === null || config === void 0 ? void 0 : config.clearable;
        const dismissOnClick = config === null || config === void 0 ? void 0 : config.dismissOnClick;
        const onClick = config === null || config === void 0 ? void 0 : config.onClick;
        const onBlur = config === null || config === void 0 ? void 0 : config.onBlur;
        const onFocus = config === null || config === void 0 ? void 0 : config.onFocus;
        const onSubmit = config === null || config === void 0 ? void 0 : config.onSubmit;
        const onReset = config === null || config === void 0 ? void 0 : config.onReset;
        const validateOn = config === null || config === void 0 ? void 0 : config.validateOn;
        // "boolean"
        const checked = config === null || config === void 0 ? void 0 : config.checked;
        const defaultChecked = config === null || config === void 0 ? void 0 : config.defaultChecked;
        // "number" | "range" | "bounded-range"
        const min = config === null || config === void 0 ? void 0 : config.min;
        const max = config === null || config === void 0 ? void 0 : config.max;
        const step = config === null || config === void 0 ? void 0 : config.step;
        // "bounded-range"
        const min0 = config === null || config === void 0 ? void 0 : config.min0;
        const max0 = config === null || config === void 0 ? void 0 : config.max0;
        const min1 = config === null || config === void 0 ? void 0 : config.min1;
        const max1 = config === null || config === void 0 ? void 0 : config.max1;
        const step0 = config === null || config === void 0 ? void 0 : config.step0;
        const step1 = config === null || config === void 0 ? void 0 : config.step1;
        const range = config === null || config === void 0 ? void 0 : config.range;
        const defaultValue0 = config === null || config === void 0 ? void 0 : config.defaultValue0;
        const defaultValue1 = config === null || config === void 0 ? void 0 : config.defaultValue1;
        const value0 = config === null || config === void 0 ? void 0 : config.value0;
        const value1 = config === null || config === void 0 ? void 0 : config.value1;
        const disabled0 = config === null || config === void 0 ? void 0 : config.disabled0;
        const disabled1 = config === null || config === void 0 ? void 0 : config.disabled1;
        const component = componentFactory({
            name,
            formAccessor,
            outputType,
        });
        const configOutput = {
            config,
            children,
            customComponent,
            componentName,
            type,
            label,
            required,
            placeholder,
            disabled,
            className,
            makClassName,
            value,
            name,
            readonly,
            hide,
            autoFocus,
            autoComplete,
            pattern,
            minLength,
            maxLength,
            options,
            labelKey,
            valueKey,
            multiple,
            size,
            searchable,
            clearable,
            dismissOnClick,
            checked,
            defaultChecked,
            min,
            max,
            step,
            min0,
            max0,
            min1,
            max1,
            step0,
            step1,
            range,
            defaultValue,
            defaultValue0,
            defaultValue1,
            value0,
            value1,
            disabled0,
            disabled1,
            onClick,
            onBlur,
            onFocus,
            onSubmit,
            onReset,
            validateOn,
        };
        constructedForm[name] = Object.assign(Object.assign({}, configOutput), { component, errors: undefined });
    });
    return constructedForm;
};
export default constructForm;
