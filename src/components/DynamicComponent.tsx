import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  RefObject,
  SelectHTMLAttributes,
  memo,
  useRef,
  useState,
} from "react"
import { mak } from "@mak-stack/mak-ui"
import {
  FieldType,
  InputChangeEvent,
  MakFormChildrenProps,
  MakFormDynamicComponentProps,
  MakFormFieldConfig,
  MakFormValidationOption,
  FormAccessor,
} from "../types/index"
import { getValueObjectsArray } from "../functions/helpers"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
dayjs.extend(isoWeek)

type DynamicComponentProps = MakFormDynamicComponentProps &
  FormAccessor & {
    config: MakFormFieldConfig
    name: string
    type: FieldType
    label: string
    formOnSubmit?: FormAccessor["onSubmit"]
    formOnReset?: FormAccessor["onReset"]
    validateOn: MakFormValidationOption
    revalidateOn: MakFormValidationOption
  }

const DynamicComponentStruct = (props: DynamicComponentProps) => {
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
    checked,
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
    formRef,
    ...otherProps
  } = props

  const [localValue, setLocalValue] = useState(value)
  const componentRef = useRef<HTMLElement>(null)

  const handleLocalChange = (e: InputChangeEvent) => {
    if (multiple && e.target instanceof HTMLSelectElement) {
      const selectedOptions = e.target.selectedOptions

      const selectedValues = Array.from(selectedOptions).map(
        (option) => option.value
      )
      setLocalValue(selectedValues)
      const event = {
        target: { name, value: selectedValues || value, type },
      } as InputChangeEvent
      handleChange({ event, validateOn, revalidateOn })
    } else if (
      e.target instanceof HTMLInputElement &&
      (e.target.type === "checkbox" || e.target.type === "radio")
    ) {
      setLocalValue(e.target.checked)
      const event = {
        target: { name, checked: e.target.checked, type },
      } as InputChangeEvent

      handleChange({ event, validateOn, revalidateOn })
    } else {
      setLocalValue(e.target.value)
      const event = {
        target: { name, value: e.target.value, type },
      } as InputChangeEvent

      handleChange({ event, validateOn, revalidateOn })
    }
    onChange && onChange(e)
  }

  const handleCustomComponentChange = (e: any) => {
    const value = e?.target?.value || e?.target?.checked || e?.value || e

    const event = {
      target: {
        name,
        value,
        type,
      },
    } as InputChangeEvent

    handleLocalChange(event)
  }

  const resolvedChildrenProps = {
    ...props,
    handleChange: handleCustomComponentChange,
    value: localValue,
    valueObjects: getValueObjectsArray(localValue, options || []),
  } as MakFormChildrenProps

  if (customComponent) {
    if (typeof customComponent === "function") {
      const CustomComponent = customComponent
      return <CustomComponent {...resolvedChildrenProps} />
    } else {
      return customComponent
    }
  }

  if (children && typeof children === "function") {
    return children(resolvedChildrenProps)
  }

  if (type === "button" || type === "submit" || type === "reset") {
    const isSubmit = type === "submit"
    const isReset = type === "reset"

    const onClickAction = () => {
      if (isSubmit && !onSubmit) {
        return formOnSubmit && formOnSubmit()
      }
      if (isSubmit && onSubmit) {
        return onSubmit()
      }
      if (isReset && !onReset) {
        return formOnReset && formOnReset()
      }
      if (isReset && onReset) {
        return onReset()
      }
      return onClick ? onClick() : () => {}
    }

    if (outputType === "htmlElements") {
      return (
        <button
          value={value as ButtonHTMLAttributes<HTMLButtonElement>["value"]}
          onClick={onClickAction}
          onSubmit={onClickAction}
          onReset={onReset}
          onBlur={onBlur}
          onFocus={onFocus}
          className={className}
          ref={componentRef as RefObject<HTMLButtonElement>}
          {...otherProps}
        >
          {children ? children : label}
        </button>
      )
    }

    if (outputType === "makElements") {
      return (
        <mak.button
          value={value as ButtonHTMLAttributes<HTMLButtonElement>["value"]}
          onClick={onClickAction}
          onSubmit={onClickAction}
          onReset={onReset}
          onBlur={onBlur}
          onFocus={onFocus}
          className={className}
          makClassName={makClassName}
          ref={componentRef as RefObject<HTMLButtonElement>}
          {...otherProps}
        >
          {children ? children : label}
        </mak.button>
      )
    }
  }

  if (type === "select" && outputType === "htmlElements") {
    return (
      <select
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        value={localValue as SelectHTMLAttributes<HTMLSelectElement>["value"]}
        // defaultValue={
        //   (defaultValue as SelectHTMLAttributes<HTMLSelectElement>["value"]) ||
        //   ""
        // }
        ref={componentRef as RefObject<HTMLSelectElement>}
        {...otherProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder as string}
          </option>
        )}
        {(options || []).map((option) => {
          return (
            <option
              key={option[valueKey as keyof typeof option]}
              value={option[valueKey as keyof typeof option]}
            >
              {option[labelKey as keyof typeof option]}
            </option>
          )
        })}
      </select>
    )
  }

  if (
    ["select", "multi-select"].includes(type) &&
    outputType === "makElements"
  ) {
    return (
      <mak.select
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        makClassName={makClassName}
        value={localValue as SelectHTMLAttributes<HTMLSelectElement>["value"]}
        // defaultValue={
        //   (defaultValue as SelectHTMLAttributes<HTMLSelectElement>["value"]) ||
        //   ""
        // }
        multiple={multiple}
        ref={componentRef as RefObject<HTMLSelectElement>}
        {...otherProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder as string}
          </option>
        )}
        {(options || []).map((option) => {
          return (
            <option
              key={option[valueKey as keyof typeof option]}
              value={option[valueKey as keyof typeof option]}
            >
              {option[labelKey as keyof typeof option]}
            </option>
          )
        })}
      </mak.select>
    )
  }

  if (["checkbox", "radio"].includes(type) && outputType === "htmlElements") {
    return (
      <input
        type={type}
        checked={localValue as InputHTMLAttributes<HTMLInputElement>["checked"]}
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        ref={componentRef as RefObject<HTMLInputElement>}
        {...otherProps}
      />
    )
  }

  if (["checkbox", "radio"].includes(type) && outputType === "makElements") {
    return (
      <mak.input
        type={type}
        checked={localValue as InputHTMLAttributes<HTMLInputElement>["checked"]}
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        makClassName={makClassName}
        ref={componentRef as RefObject<HTMLInputElement>}
        {...otherProps}
      />
    )
  }

  if (
    ["date", "datetime", "datetime-local", "time", "week", "month"].includes(
      type
    )
  ) {
    const formatDate = ({
      type,
      inputDate,
    }: {
      type: FieldType
      inputDate?: dayjs.Dayjs | string
    }) => {
      if (!inputDate || inputDate === "") {
        console.log("no input")
        // date = dayjs()
        return undefined
      }
      let date = dayjs(inputDate)

      switch (type) {
        case "date":
          return date.format("YYYY-MM-DD")
        case "datetime-local":
          return date.format("YYYY-MM-DDTHH:mm")
        case "time":
          return date.format("HH:mm")
        case "week":
          return `${date.format("YYYY")}-W${date.isoWeek()}`
        case "month":
          return date.format("YYYY-MM")
        default:
          return ""
      }
    }

    if (outputType === "htmlElements") {
      return (
        <input
          type={type}
          value={formatDate({
            type,
            inputDate: localValue as string,
          })}
          onChange={handleLocalChange}
          onBlur={onBlur}
          className={className}
          placeholder={placeholder as string}
          // defaultValue={formatDate({ type, inputDate: defaultValue as string })}
          ref={componentRef as RefObject<HTMLInputElement>}
          {...otherProps}
        />
      )
    }
    if (outputType === "makElements") {
      return (
        <mak.input
          type={type}
          value={formatDate({
            type,
            inputDate: localValue as string,
          })}
          onChange={handleLocalChange}
          onBlur={onBlur}
          className={className}
          placeholder={placeholder as string}
          // defaultValue={formatDate({ type, inputDate: defaultValue as string })}
          ref={componentRef as RefObject<HTMLInputElement>}
          {...otherProps}
        />
      )
    }
  }

  if (outputType === "htmlElements") {
    return (
      <input
        type={type}
        value={localValue as InputHTMLAttributes<HTMLInputElement>["value"]}
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        placeholder={placeholder as string}
        // defaultValue={defaultValue as string}
        ref={componentRef as RefObject<HTMLInputElement>}
        {...otherProps}
      />
    )
  }

  if (outputType === "makElements") {
    return (
      <mak.input
        type={type}
        value={localValue as InputHTMLAttributes<HTMLInputElement>["value"]}
        onChange={handleLocalChange}
        onBlur={onBlur}
        className={className}
        makClassName={makClassName}
        // defaultValue={defaultValue as string}
        placeholder={placeholder as string}
        ref={componentRef as RefObject<HTMLInputElement>}
        {...otherProps}
      />
    )
  }
}

const DynamicComponent = memo(DynamicComponentStruct)

export default DynamicComponent
