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
