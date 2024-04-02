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
export const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 === null ||
        typeof obj1 !== "object" ||
        obj2 === null ||
        typeof obj2 !== "object") {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        if (!deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
};
