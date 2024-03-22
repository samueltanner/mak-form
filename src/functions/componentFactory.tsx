import DynamicComponent from "../components/DynamicComponent"
import {
  BooleanFieldConfig,
  BoundedRangeFieldConfig,
  FieldType,
  MakForm,
  MakFormComponentOutputType,
  MakFormDynamicComponent,
  MakFormFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  TextFieldConfig,
  FormAccessor,
  InputChangeEvent,
} from "../types/index"
import { getValueObjectsArray } from "./helpers"
import React from "react"

export const getComponentName = (fieldName: string, componentName?: string) => {
  if (componentName) {
    return componentName
  }
  const words = fieldName.split(/[\s-_]+/)

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

export const getInitialComponentNames = ({
  formConfig,
}: {
  formConfig: MakForm | undefined
}) => {
  const dummyComponents = {} as any
  Object.keys(formConfig || {}).forEach((fieldName) => {
    const customName = formConfig?.[fieldName]?.componentName
    const name = getComponentName(fieldName, customName)
    dummyComponents[name] = () => <div />
  })
  if (!formConfig?.Submit) {
    dummyComponents["Submit"] = () => <div />
  }

  return dummyComponents
}

interface ComponentFactoryProps {
  formAccessor: FormAccessor
  name: string
  outputType?: MakFormComponentOutputType
}

const componentFactory = ({
  formAccessor,
  name,
}: ComponentFactoryProps): MakFormDynamicComponent => {
  const {
    form,
    formRef,
    validateFormOn,
    revalidateFormOn,
    onSubmit: formOnSubmit,
    onReset: formOnReset,
    outputType,
    handleChange,
  } = formAccessor

  const config = form[name] as MakFormFieldConfig
  const customComponent = config?.customComponent

  const type: FieldType = (form[name] as MakFormFieldConfig)?.type || "text"
  const label = config?.label
  const required = config?.required
  const defaultValue = config?.defaultValue
  const disabled = config?.disabled
  const className = config?.className
  const makClassName = config?.makClassName
  const value = config?.value
  const placeholder = config?.placeholder
  const readonly = config?.readonly
  const hide = config?.hide
  const autoFocus = config?.autoFocus
  const autoComplete = config?.autoComplete
  const pattern = config?.pattern

  // "text" | "password"
  const minLength = (config as TextFieldConfig)?.minLength
  const maxLength = (config as TextFieldConfig)?.maxLength

  // "select" | "radio" | "multi-select" | "searchable-select"
  const options = (config as SelectFieldConfig)?.options
  const valueObjects = getValueObjectsArray(
    value || defaultValue,
    options || []
  )
  const labelKey = (config as SelectFieldConfig)?.labelKey || "label"
  const valueKey = (config as SelectFieldConfig)?.valueKey || "value"
  const multiple = (config as SelectFieldConfig)?.multiple
  const size = (config as SelectFieldConfig)?.size
  const searchable = (config as SelectFieldConfig)?.searchable
  const clearable = (config as SelectFieldConfig)?.clearable
  const dismissOnClick = (config as SelectFieldConfig)?.dismissOnClick
  const onClick = config?.onClick
  const onBlur = config?.onBlur
  const onFocus = config?.onFocus
  const onSubmit = config?.onSubmit
  const onReset = config?.onReset
  const onChange = (props: any) => {
    config?.onChange
    handleChange
  }
  const validateOn = config?.validateOn || validateFormOn || "submit"
  const revalidateOn = config?.revalidateOn || revalidateFormOn || "change"
  // "boolean"
  const checked = (config as BooleanFieldConfig)?.checked

  // "number" | "range" | "bounded-range"
  const min = (config as NumberFieldConfig)?.min
  const max = (config as NumberFieldConfig)?.max
  const step = (config as NumberFieldConfig)?.step

  // "bounded-range"
  const min0 = (config as BoundedRangeFieldConfig)?.min0
  const max0 = (config as BoundedRangeFieldConfig)?.max0
  const min1 = (config as BoundedRangeFieldConfig)?.min1
  const max1 = (config as BoundedRangeFieldConfig)?.max1
  const step0 = (config as BoundedRangeFieldConfig)?.step0
  const step1 = (config as BoundedRangeFieldConfig)?.step1
  const range = (config as BoundedRangeFieldConfig)?.range
  const defaultValue0 = (config as BoundedRangeFieldConfig)?.defaultValue0
  const defaultValue1 = (config as BoundedRangeFieldConfig)?.defaultValue1
  const value0 = (config as BoundedRangeFieldConfig)?.value0
  const value1 = (config as BoundedRangeFieldConfig)?.value1
  const disabled0 = (config as BoundedRangeFieldConfig)?.disabled0
  const disabled1 = (config as BoundedRangeFieldConfig)?.disabled1

  const fieldValue = value ?? defaultValue

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
    formOnReset,
  }
  const ComponentWrapper = (props: Record<string, unknown>) => {
    return (
      <DynamicComponent outputType={outputType} {...hookProps} {...props} />
    )
  }
  const componentName = getComponentName(name, config?.componentName)

  ComponentWrapper.displayName = componentName

  return ComponentWrapper
}

export default componentFactory

const constructDynamicComponents = (formAccessor: FormAccessor) => {
  const { form, outputType } = formAccessor

  return Object.keys(form || {}).reduce((acc, name) => {
    const componentName = getComponentName(name, form[name]?.componentName)

    const component = componentFactory({
      name,
      formAccessor,
      outputType,
    })

    return {
      ...acc,
      [componentName]: component,
    }
  }, {})
}

export { constructDynamicComponents }
