import { MakFormComponentOutputType } from "../types/index"

export const ensureSingleElementType = ({
  useMakElements,
  useHTMLElements,
  useMakComponents,
}: {
  useMakElements?: boolean
  useHTMLElements?: boolean
  useMakComponents?: boolean
}): MakFormComponentOutputType => {
  let elementTypeObject: { [Key in MakFormComponentOutputType]: boolean } = {
    makElements: useMakElements || false,
    htmlElements: useHTMLElements || false,
    makComponents: useMakComponents || false,
  }
  if (useMakElements) {
    elementTypeObject["htmlElements"] = false
    elementTypeObject["makComponents"] = false
    elementTypeObject["makElements"] = true
  } else if (useHTMLElements) {
    elementTypeObject["makElements"] = false
    elementTypeObject["makComponents"] = false
    elementTypeObject["htmlElements"] = true
  }

  if (!useMakComponents && !useHTMLElements && !useMakElements) {
    elementTypeObject["makElements"] = true
  }

  return Object.keys(elementTypeObject).find(
    (key) => elementTypeObject[key as MakFormComponentOutputType]
  ) as MakFormComponentOutputType
}

export const getValueObjectsArray = (value: any, options: any[]) => {
  if (!value || options.length === 0) return []
  value = Array.isArray(value) ? value : [value]
  return options?.filter((option) => {
    if (Array.isArray(value as any[]) && option?.value) {
      return (value as any[])?.includes(option?.value)
    }
  })
}

export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) {
    return true
  }

  if (
    obj1 === null ||
    typeof obj1 !== "object" ||
    obj2 === null ||
    typeof obj2 !== "object"
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
