'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var makUi = require('@mak-stack/mak-ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const ensureSingleElementType = ({
  useMakElements,
  useHTMLElements,
  useMakComponents
}) => {
  let elementTypeObject = {
    makElements: useMakElements || false,
    htmlElements: useHTMLElements || false,
    makComponents: useMakComponents || false
  };
  if (useMakElements) {
    elementTypeObject["htmlElements"] = false;
    elementTypeObject["makComponents"] = false;
    elementTypeObject["makElements"] = true;
  } else if (useHTMLElements) {
    elementTypeObject["makElements"] = false;
    elementTypeObject["makComponents"] = false;
    elementTypeObject["htmlElements"] = true;
  }
  if (!useMakComponents && !useHTMLElements && !useMakElements) {
    elementTypeObject["makElements"] = true;
  }
  return Object.keys(elementTypeObject).find(key => elementTypeObject[key]);
};
const getValueObjectsArray = (value, options) => {
  if (!value || options.length === 0) return [];
  value = Array.isArray(value) ? value : [value];
  return options === null || options === void 0 ? void 0 : options.filter(option => {
    if (Array.isArray(value) && (option === null || option === void 0 ? void 0 : option.value)) {
      return value === null || value === void 0 ? void 0 : value.includes(option === null || option === void 0 ? void 0 : option.value);
    }
  });
};

const DynamicComponentStruct = props => {
  const {
      form,
      config,
      children,
      customComponent,
      handleChange,
      outputType,
      type,
      name,
      label,
      defaultValue,
      className,
      makClassName,
      pattern,
      value,
      valueObjects,
      placeholder,
      options,
      labelKey,
      valueKey,
      multiple,
      onClick,
      onBlur,
      onFocus,
      onSubmit,
      onReset,
      onChange,
      formOnSubmit,
      formOnReset,
      validateOn,
      revalidateOn,
      formRef
    } = props,
    otherProps = __rest(props, ["form", "config", "children", "customComponent", "handleChange", "outputType", "type", "name", "label", "defaultValue", "className", "makClassName", "pattern", "value", "valueObjects", "placeholder", "options", "labelKey", "valueKey", "multiple", "onClick", "onBlur", "onFocus", "onSubmit", "onReset", "onChange", "formOnSubmit", "formOnReset", "validateOn", "revalidateOn", "formRef"]);
  const [localValue, setLocalValue] = React.useState(value);
  const componentRef = React.useRef(null);
  const handleLocalChange = e => {
    if (multiple && e.target instanceof HTMLSelectElement) {
      const selectedOptions = e.target.selectedOptions;
      const selectedValues = Array.from(selectedOptions).map(option => option.value);
      setLocalValue(selectedValues);
      const event = {
        target: {
          name,
          value: selectedValues || value,
          type
        }
      };
      handleChange({
        event,
        validateOn,
        revalidateOn
      });
    } else {
      setLocalValue(e.target.value);
      const event = {
        target: {
          name,
          value: e.target.value || value,
          type
        }
      };
      handleChange({
        event,
        validateOn,
        revalidateOn
      });
    }
    onChange && onChange(e);
  };
  const handleCustomComponentChange = e => {
    var _a;
    const value = ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value) || (e === null || e === void 0 ? void 0 : e.value) || e;
    const event = {
      target: {
        name,
        value,
        type
      }
    };
    handleLocalChange(event);
  };
  const resolvedChildrenProps = Object.assign(Object.assign({}, props), {
    handleChange: handleCustomComponentChange,
    value: localValue,
    valueObjects: getValueObjectsArray(localValue, options || [])
  });
  if (customComponent) {
    if (typeof customComponent === "function") {
      const CustomComponent = customComponent;
      return /*#__PURE__*/React__default["default"].createElement(CustomComponent, resolvedChildrenProps);
    } else {
      return customComponent;
    }
  }
  if (children && typeof children === "function") {
    return children(resolvedChildrenProps);
  }
  if (type === "button" || type === "submit" || type === "reset") {
    const isSubmit = type === "submit";
    const isReset = type === "reset";
    const onClickAction = () => {
      if (isSubmit && !onSubmit) {
        return formOnSubmit && formOnSubmit();
      }
      if (isSubmit && onSubmit) {
        return onSubmit();
      }
      if (isReset && !onReset) {
        return formOnReset && formOnReset();
      }
      if (isReset && onReset) {
        return onReset();
      }
      return onClick ? onClick() : () => {};
    };
    if (outputType === "htmlElements") {
      return /*#__PURE__*/React__default["default"].createElement("button", _extends({
        value: value,
        onClick: onClickAction,
        onSubmit: onClickAction,
        onReset: onReset,
        onBlur: onBlur,
        onFocus: onFocus,
        className: className,
        ref: componentRef
      }, otherProps), children ? children : label);
    }
    if (outputType === "makElements") {
      return /*#__PURE__*/React__default["default"].createElement(makUi.mak.button, _extends({
        value: value,
        onClick: onClickAction,
        onSubmit: onClickAction,
        onReset: onReset,
        onBlur: onBlur,
        onFocus: onFocus,
        className: className,
        makClassName: makClassName,
        ref: componentRef
      }, otherProps), children ? children : label);
    }
  }
  if (type === "select" && outputType === "htmlElements") {
    return /*#__PURE__*/React__default["default"].createElement("select", _extends({
      onChange: handleLocalChange,
      onBlur: onBlur,
      className: className,
      value: localValue,
      defaultValue: defaultValue || "",
      ref: componentRef
    }, otherProps), placeholder && /*#__PURE__*/React__default["default"].createElement("option", {
      value: "",
      disabled: true
    }, placeholder), (options || []).map(option => {
      return /*#__PURE__*/React__default["default"].createElement("option", {
        key: option[valueKey],
        value: option[valueKey]
      }, option[labelKey]);
    }));
  }
  if (["select", "multi-select"].includes(type) && outputType === "makElements") {
    return /*#__PURE__*/React__default["default"].createElement(makUi.mak.select, _extends({
      onChange: handleLocalChange,
      onBlur: onBlur,
      className: className,
      makClassName: makClassName,
      value: localValue,
      defaultValue: defaultValue || "",
      multiple: multiple,
      ref: componentRef
    }, otherProps), placeholder && /*#__PURE__*/React__default["default"].createElement("option", {
      value: "",
      disabled: true
    }, placeholder), (options || []).map(option => {
      return /*#__PURE__*/React__default["default"].createElement("option", {
        key: option[valueKey],
        value: option[valueKey]
      }, option[labelKey]);
    }));
  }
  if (outputType === "htmlElements") {
    return /*#__PURE__*/React__default["default"].createElement("input", _extends({
      type: type,
      value: localValue,
      onChange: handleLocalChange,
      onBlur: onBlur,
      className: className,
      placeholder: placeholder,
      defaultValue: defaultValue,
      ref: componentRef
    }, otherProps));
  }
  if (outputType === "makElements") {
    return /*#__PURE__*/React__default["default"].createElement(makUi.mak.input, _extends({
      type: type,
      value: localValue,
      onChange: handleLocalChange,
      onBlur: onBlur,
      className: className,
      makClassName: makClassName,
      defaultValue: defaultValue,
      placeholder: placeholder,
      ref: componentRef
    }, otherProps));
  }
};
const DynamicComponent = /*#__PURE__*/React.memo(DynamicComponentStruct);

const getComponentName = (fieldName, componentName) => {
  if (componentName) {
    return componentName;
  }
  const words = fieldName.split(/[\s-_]+/);
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
};
const getInitialComponentNames = ({
  formConfig
}) => {
  const dummyComponents = {};
  Object.keys(formConfig || {}).forEach(fieldName => {
    var _a;
    const customName = (_a = formConfig === null || formConfig === void 0 ? void 0 : formConfig[fieldName]) === null || _a === void 0 ? void 0 : _a.componentName;
    const name = getComponentName(fieldName, customName);
    dummyComponents[name] = () => /*#__PURE__*/React__default["default"].createElement("div", null);
  });
  if (!(formConfig === null || formConfig === void 0 ? void 0 : formConfig.Submit)) {
    dummyComponents["Submit"] = () => /*#__PURE__*/React__default["default"].createElement("div", null);
  }
  return dummyComponents;
};
const componentFactory = ({
  formAccessor,
  name
}) => {
  var _a;
  const {
    form,
    formRef,
    validateFormOn,
    revalidateFormOn,
    onSubmit: formOnSubmit,
    onReset: formOnReset,
    outputType,
    handleChange
  } = formAccessor;
  const config = form[name];
  const customComponent = config === null || config === void 0 ? void 0 : config.customComponent;
  const type = ((_a = form[name]) === null || _a === void 0 ? void 0 : _a.type) || "text";
  const label = config === null || config === void 0 ? void 0 : config.label;
  const required = config === null || config === void 0 ? void 0 : config.required;
  const defaultValue = config === null || config === void 0 ? void 0 : config.defaultValue;
  const disabled = config === null || config === void 0 ? void 0 : config.disabled;
  const className = config === null || config === void 0 ? void 0 : config.className;
  const makClassName = config === null || config === void 0 ? void 0 : config.makClassName;
  const value = config === null || config === void 0 ? void 0 : config.value;
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
  const valueObjects = getValueObjectsArray(value || defaultValue, options || []);
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
  const onChange = props => {
    config === null || config === void 0 ? void 0 : config.onChange;
  };
  const validateOn = (config === null || config === void 0 ? void 0 : config.validateOn) || validateFormOn || "submit";
  const revalidateOn = (config === null || config === void 0 ? void 0 : config.revalidateOn) || revalidateFormOn || "change";
  // "boolean"
  const checked = config === null || config === void 0 ? void 0 : config.checked;
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
  const fieldValue = value !== null && value !== void 0 ? value : defaultValue;
  // const selectFieldValue =
  //   fieldValue && typeof fieldValue === "string"
  //     ? String(fieldValue)
  //     : Array.isArray(fieldValue)
  //     ? fieldValue.map(String)
  //     : undefined
  const hookProps = {
    form,
    handleChange,
    customComponent,
    formRef,
    validateOn,
    revalidateOn,
    validateFormOn,
    revalidateFormOn,
    config,
    type,
    label,
    required,
    placeholder,
    disabled,
    className,
    makClassName,
    value: fieldValue,
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
    valueObjects,
    disabled0,
    disabled1,
    onClick,
    onBlur,
    onFocus,
    onSubmit,
    onReset,
    onChange,
    formOnSubmit,
    formOnReset
  };
  const ComponentWrapper = props => {
    return /*#__PURE__*/React__default["default"].createElement(DynamicComponent, _extends({
      outputType: outputType
    }, hookProps, props));
  };
  const componentName = getComponentName(name, config === null || config === void 0 ? void 0 : config.componentName);
  ComponentWrapper.displayName = componentName;
  return ComponentWrapper;
};
const constructDynamicComponents = formAccessor => {
  const {
    form,
    outputType
  } = formAccessor;
  return Object.keys(form || {}).reduce((acc, name) => {
    var _a;
    const componentName = getComponentName(name, (_a = form[name]) === null || _a === void 0 ? void 0 : _a.componentName);
    const component = componentFactory({
      name,
      formAccessor,
      outputType
    });
    return Object.assign(Object.assign({}, acc), {
      [componentName]: component
    });
  }, {});
};

const constructForm = formAccessor => {
  const {
    form,
    outputType
  } = formAccessor;
  const constructedForm = {};
  Object.keys(form || {}).forEach(name => {
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
      outputType
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
      validateOn
    };
    constructedForm[name] = Object.assign(Object.assign({}, configOutput), {
      component,
      errors: undefined
    });
  });
  return constructedForm;
};

const validateField = ({
  form,
  fieldName,
  value
}) => {
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
  config === null || config === void 0 ? void 0 : config.min0;
  config === null || config === void 0 ? void 0 : config.max0;
  config === null || config === void 0 ? void 0 : config.min1;
  config === null || config === void 0 ? void 0 : config.max1;
  const errors = {};
  if (required && !value) {
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
const validateForm = ({
  form
}) => {
  const errors = {};
  Object.keys(form).forEach(fieldName => {
    var _a, _b;
    if (fieldName === "submit" || fieldName === "reset") return;
    const value = ((_a = form === null || form === void 0 ? void 0 : form[fieldName]) === null || _a === void 0 ? void 0 : _a.value) || ((_b = form === null || form === void 0 ? void 0 : form[fieldName]) === null || _b === void 0 ? void 0 : _b.defaultValue);
    const validation = validateField({
      fieldName,
      value,
      form
    });
    if (Object.entries(validation).some(([_, error]) => error)) {
      // errors[fieldName] = error
      errors[fieldName] = validation[fieldName];
    } else {
      errors[fieldName] = undefined;
    }
  });
  // setFormErrors((prev) => errors)
  return errors;
};

const useMakForm = ({
  formConfig,
  useMakElements,
  useHTMLElements,
  useMakComponents,
  onSubmit,
  onReset,
  validateFormOn = "submit",
  revalidateFormOn = "none"
}) => {
  const outputType = ensureSingleElementType({
    useMakElements,
    useHTMLElements,
    useMakComponents
  });
  const formRef = React.useRef(formConfig || {});
  const originalFormRef = React.useRef();
  const errorsRef = React.useRef({});
  const beforeValidationErrorsRef = React.useRef(Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
    if (!["button", "submit", "reset"].includes(value === null || value === void 0 ? void 0 : value.type)) {
      acc[key] = undefined;
    }
    return acc;
  }, {}));
  const [form, setForm] = React.useState({});
  const [errors, setErrors] = React.useState({});
  // const [formErrors, setFormErrors] = useState<MakFormErrors>(
  //   Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
  //     if (!["button", "submit", "reset"].includes((value as any)?.type)) {
  //       ;(acc as MakFormErrors)[key] = undefined
  //     }
  //     return acc
  //   }, {})
  // )
  const [dynamicComponents, setDynamicComponents] = React.useState(getInitialComponentNames({
    formConfig
  }));
  const [isDirty, setIsDirty] = React.useState(false);
  const [isClean, setIsClean] = React.useState(true);
  React.useEffect(() => {
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
    formRef
  };
  function handleChange({
    event,
    validateOn,
    revalidateOn
  }) {
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
    const updatedForm = Object.assign(Object.assign({}, prev), {
      [fieldName]: Object.assign({}, updatedValue)
    });
    const validation = (_a = validateField({
      form: updatedForm,
      fieldName,
      value
    })) === null || _a === void 0 ? void 0 : _a[fieldName];
    updatedForm[fieldName].errors = validation;
    formRef.current = updatedForm;
    setForm(updatedForm);
    const continuousValidationErrors = Object.assign(Object.assign({}, beforeValidationErrorsRef.current), {
      [fieldName]: validation
    });
    beforeValidationErrorsRef.current = continuousValidationErrors;
    if (validateOn === "change" || validateFormOn === "change" || revalidateFormOn === "change" || revalidateOn === "change") {
      errorsRef.current = beforeValidationErrorsRef.current;
      setErrors(errorsRef.current);
    }
  }
  const handleChangePublic = (name, value) => {
    var _a, _b;
    const elementType = (_a = formRef.current[name]) === null || _a === void 0 ? void 0 : _a.type;
    const event = {
      target: {
        name: name,
        value,
        type: elementType
      }
    };
    handleChange({
      event,
      validateOn: "change",
      revalidateOn: "change"
    });
    const componentName = getComponentName(name, (_b = formConfig === null || formConfig === void 0 ? void 0 : formConfig[name]) === null || _b === void 0 ? void 0 : _b.componentName);
    const proxyAccessor = Object.assign(Object.assign({}, formAccessor), {
      form: formRef.current
    });
    const dynamicComponent = componentFactory({
      formAccessor: proxyAccessor,
      name
    });
    const updatedDynamicComponents = Object.assign(Object.assign({}, dynamicComponents), {
      [componentName]: dynamicComponent
    });
    setDynamicComponents(updatedDynamicComponents);
  };
  function handleSubmit() {
    const validation = validateForm({
      form: formRef.current || {}
    });
    if (Object.values(validation).some(error => error)) {
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
    } else {
      setForm(originalFormRef.current);
      formRef.current = originalFormRef.current;
      constructFormAndComponents();
    }
  }
  const constructFormAndComponents = () => {
    if (!formConfig) return;
    const constructedForm = constructForm(formAccessor);
    if (originalFormRef.current) {
      const dynamicComponents = constructDynamicComponents(Object.assign(Object.assign({}, formAccessor), {
        form: originalFormRef.current
      }));
      setDynamicComponents(dynamicComponents);
      setForm(constructedForm);
    } else {
      formRef.current = constructedForm;
      const errors = validateForm({
        form: constructedForm
      });
      beforeValidationErrorsRef.current = errors;
      originalFormRef.current = constructedForm;
      setForm(originalFormRef.current);
      const dynamicComponents = constructDynamicComponents(formAccessor);
      setDynamicComponents(dynamicComponents);
    }
    setIsDirty(false);
  };
  const getFormValues = () => {
    if (!formRef.current) return;
    const formValues = Object.entries(formRef.current).reduce((acc, [key, value]) => {
      var _a;
      if ((value === null || value === void 0 ? void 0 : value.type) !== "submit" && (value === null || value === void 0 ? void 0 : value.type) !== "reset") {
        acc[key] = value === null || value === void 0 ? void 0 : value.value;
      }
      if (((_a = formConfig === null || formConfig === void 0 ? void 0 : formConfig[key]) === null || _a === void 0 ? void 0 : _a.type) === "number") {
        acc[key] = Number(value === null || value === void 0 ? void 0 : value.value) || 0;
      }
      return acc;
    }, {});
    return formValues;
  };
  React.useEffect(() => {
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
      clean: isClean
    },
    handleChange: handleChangePublic,
    reset: handleReset,
    submit: handleSubmit
  };
};

exports.useMakForm = useMakForm;
//# sourceMappingURL=index.js.map
