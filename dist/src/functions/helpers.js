export const isEmptyObject = (obj) => {
    if (obj === undefined)
        return false;
    return isObject(obj) && Object.keys(obj).length === 0;
};
export const isNestedObject = (obj) => isObject(obj) && Object.values(obj).some(isObject);
export const isObject = (v) => v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    typeof v !== "string";
export const deepMerge = (...objects) => {
    const result = {};
    const merge = (target, source) => {
        Object.keys(source).forEach((key) => {
            if (source[key] && typeof source[key] === "object") {
                target[key] = target[key] || {};
                merge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        });
    };
    for (const obj of objects) {
        if (!isObject(obj))
            continue;
        merge(result, obj);
    }
    return result;
};
export const getDifference = (x, y = x, isRoot = true) => {
    if (Array.isArray(x) && Array.isArray(y)) {
        const temp = [];
        let allEqual = true;
        for (let i = 0; i < Math.max(x.length, y.length); i++) {
            const diff = getDifference(x[i], y[i], false);
            if (diff !== true) {
                allEqual = false;
                temp[i] = diff;
            }
        }
        return isRoot
            ? allEqual
                ? { isEqual: true }
                : { isEqual: false, object: temp }
            : allEqual
                ? true
                : temp;
    }
    else if (isObject(x) && isObject(y)) {
        const temp = {};
        let allEqual = true;
        for (const key of new Set([...Object.keys(x), ...Object.keys(y)])) {
            if (typeof key === "string") {
                const val1 = x[key];
                const val2 = y[key];
                if (key in x && key in y) {
                    const diff = getDifference(val1, val2, false);
                    if (diff !== true) {
                        allEqual = false;
                        temp[key] = diff;
                    }
                }
                else {
                    allEqual = false;
                    temp[key] = false;
                }
            }
        }
        return isRoot
            ? allEqual
                ? { isEqual: true }
                : { isEqual: false, object: temp }
            : allEqual
                ? true
                : temp;
    }
    else {
        return x === y;
    }
};
export const isEqual = (x, y) => {
    const diffResult = getDifference(x, y, true);
    if (typeof diffResult === "boolean") {
        return diffResult;
    }
    else if (diffResult && typeof diffResult === "object") {
        return diffResult.isEqual;
    }
    else {
        return false;
    }
};
export const mergeWithFallback = (primary, fallback) => {
    const result = Object.assign(Object.assign({}, fallback), primary);
    Object.keys(fallback).forEach((key) => {
        if (primary[key] === undefined) {
            result[key] = fallback[key];
        }
    });
    return result;
};
export const ensureSingleElementType = ({ useMakElements, useHTMLElements, useMakComponents, }) => {
    let elementTypeObject = {
        makElements: useMakElements || false,
        htmlElements: useHTMLElements || false,
        makComponents: useMakComponents || false,
    };
    if (useMakElements) {
        elementTypeObject["htmlElements"] = false;
        elementTypeObject["makComponents"] = false;
        elementTypeObject["makElements"] = true;
    }
    else if (useHTMLElements) {
        elementTypeObject["makElements"] = false;
        elementTypeObject["makComponents"] = false;
        elementTypeObject["htmlElements"] = true;
    }
    console.log(elementTypeObject);
    if (!useMakComponents && !useHTMLElements && !useMakElements) {
        elementTypeObject["makElements"] = true;
    }
    return Object.keys(elementTypeObject).find((key) => elementTypeObject[key]);
};
export const getValueObjectsArray = (value, options) => {
    if (!value || options.length === 0)
        return [];
    value = Array.isArray(value) ? value : [value];
    return options === null || options === void 0 ? void 0 : options.filter((option) => {
        if (Array.isArray(value) && (option === null || option === void 0 ? void 0 : option.value)) {
            return value === null || value === void 0 ? void 0 : value.includes(option === null || option === void 0 ? void 0 : option.value);
        }
    });
};
