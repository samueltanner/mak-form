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
