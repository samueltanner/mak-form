var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { memo, useRef, useState, } from "react";
import { mak } from "@mak-stack/mak-ui";
import { getValueObjectsArray } from "../functions/helpers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
const DynamicComponentStruct = (props) => {
    const { form, config, children, customComponent, handleChange, outputType, type, name, label, defaultValue, className, makClassName, pattern, value, checked, valueObjects, placeholder, options, labelKey, valueKey, multiple, onClick, onBlur, onFocus, onSubmit, onReset, onChange, formOnSubmit, formOnReset, validateOn, revalidateOn, formRef } = props, otherProps = __rest(props, ["form", "config", "children", "customComponent", "handleChange", "outputType", "type", "name", "label", "defaultValue", "className", "makClassName", "pattern", "value", "checked", "valueObjects", "placeholder", "options", "labelKey", "valueKey", "multiple", "onClick", "onBlur", "onFocus", "onSubmit", "onReset", "onChange", "formOnSubmit", "formOnReset", "validateOn", "revalidateOn", "formRef"]);
    const [localValue, setLocalValue] = useState(value);
    const componentRef = useRef(null);
    const handleLocalChange = (e) => {
        if (multiple && e.target instanceof HTMLSelectElement) {
            const selectedOptions = e.target.selectedOptions;
            const selectedValues = Array.from(selectedOptions).map((option) => option.value);
            setLocalValue(selectedValues);
            const event = {
                target: { name, value: selectedValues || value, type },
            };
            handleChange({ event, validateOn, revalidateOn });
        }
        else if (e.target instanceof HTMLInputElement &&
            (e.target.type === "checkbox" || e.target.type === "radio")) {
            setLocalValue(e.target.checked);
            const event = {
                target: { name, checked: e.target.checked, type },
            };
            handleChange({ event, validateOn, revalidateOn });
        }
        else {
            setLocalValue(e.target.value);
            const event = {
                target: { name, value: e.target.value, type },
            };
            handleChange({ event, validateOn, revalidateOn });
        }
        onChange && onChange(e);
    };
    const handleCustomComponentChange = (e) => {
        var _a, _b;
        const value = ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value) || ((_b = e === null || e === void 0 ? void 0 : e.target) === null || _b === void 0 ? void 0 : _b.checked) || (e === null || e === void 0 ? void 0 : e.value) || e;
        const event = {
            target: {
                name,
                value,
                type,
            },
        };
        handleLocalChange(event);
    };
    const resolvedChildrenProps = Object.assign(Object.assign({}, props), { handleChange: handleCustomComponentChange, value: localValue, valueObjects: getValueObjectsArray(localValue, options || []) });
    if (customComponent) {
        if (typeof customComponent === "function") {
            const CustomComponent = customComponent;
            return <CustomComponent {...resolvedChildrenProps}/>;
        }
        else {
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
            return onClick ? onClick() : () => { };
        };
        if (outputType === "htmlElements") {
            return (<button value={value} onClick={onClickAction} onSubmit={onClickAction} onReset={onReset} onBlur={onBlur} onFocus={onFocus} className={className} ref={componentRef} {...otherProps}>
          {children ? children : label}
        </button>);
        }
        if (outputType === "makElements") {
            return (<mak.button value={value} onClick={onClickAction} onSubmit={onClickAction} onReset={onReset} onBlur={onBlur} onFocus={onFocus} className={className} makClassName={makClassName} ref={componentRef} {...otherProps}>
          {children ? children : label}
        </mak.button>);
        }
    }
    if (type === "select" && outputType === "htmlElements") {
        return (<select onChange={handleLocalChange} onBlur={onBlur} className={className} value={localValue} 
        // defaultValue={
        //   (defaultValue as SelectHTMLAttributes<HTMLSelectElement>["value"]) ||
        //   ""
        // }
        ref={componentRef} {...otherProps}>
        {placeholder && (<option value="" disabled>
            {placeholder}
          </option>)}
        {(options || []).map((option) => {
                return (<option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>);
            })}
      </select>);
    }
    if (["select", "multi-select"].includes(type) &&
        outputType === "makElements") {
        return (<mak.select onChange={handleLocalChange} onBlur={onBlur} className={className} makClassName={makClassName} value={localValue} 
        // defaultValue={
        //   (defaultValue as SelectHTMLAttributes<HTMLSelectElement>["value"]) ||
        //   ""
        // }
        multiple={multiple} ref={componentRef} {...otherProps}>
        {placeholder && (<option value="" disabled>
            {placeholder}
          </option>)}
        {(options || []).map((option) => {
                return (<option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>);
            })}
      </mak.select>);
    }
    if (["checkbox", "radio"].includes(type) && outputType === "htmlElements") {
        return (<input type={type} checked={localValue} onChange={handleLocalChange} onBlur={onBlur} className={className} ref={componentRef} {...otherProps}/>);
    }
    if (["checkbox", "radio"].includes(type) && outputType === "makElements") {
        return (<mak.input type={type} checked={localValue} onChange={handleLocalChange} onBlur={onBlur} className={className} makClassName={makClassName} ref={componentRef} {...otherProps}/>);
    }
    if (["date", "datetime", "datetime-local", "time", "week", "month"].includes(type)) {
        const formatDate = ({ type, inputDate, }) => {
            if (!inputDate || inputDate === "") {
                console.log("no input");
                // date = dayjs()
                return undefined;
            }
            let date = dayjs(inputDate);
            switch (type) {
                case "date":
                    return date.format("YYYY-MM-DD");
                case "datetime-local":
                    return date.format("YYYY-MM-DDTHH:mm");
                case "time":
                    return date.format("HH:mm");
                case "week":
                    return `${date.format("YYYY")}-W${date.isoWeek()}`;
                case "month":
                    return date.format("YYYY-MM");
                default:
                    return "";
            }
        };
        if (outputType === "htmlElements") {
            return (<input type={type} value={formatDate({
                    type,
                    inputDate: localValue,
                })} onChange={handleLocalChange} onBlur={onBlur} className={className} placeholder={placeholder} 
            // defaultValue={formatDate({ type, inputDate: defaultValue as string })}
            ref={componentRef} {...otherProps}/>);
        }
        if (outputType === "makElements") {
            return (<mak.input type={type} value={formatDate({
                    type,
                    inputDate: localValue,
                })} onChange={handleLocalChange} onBlur={onBlur} className={className} placeholder={placeholder} 
            // defaultValue={formatDate({ type, inputDate: defaultValue as string })}
            ref={componentRef} {...otherProps}/>);
        }
    }
    if (outputType === "htmlElements") {
        return (<input type={type} value={localValue} onChange={handleLocalChange} onBlur={onBlur} className={className} placeholder={placeholder} 
        // defaultValue={defaultValue as string}
        ref={componentRef} {...otherProps}/>);
    }
    if (outputType === "makElements") {
        return (<mak.input type={type} value={localValue} onChange={handleLocalChange} onBlur={onBlur} className={className} makClassName={makClassName} 
        // defaultValue={defaultValue as string}
        placeholder={placeholder} ref={componentRef} {...otherProps}/>);
    }
};
const DynamicComponent = memo(DynamicComponentStruct);
export default DynamicComponent;
