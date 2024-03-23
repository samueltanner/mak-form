import {
  BoundedRangeFieldConfig,
  FieldType,
  MakForm,
  MakFormErrors,
  MakFormFieldConfig,
  NumberFieldConfig,
  TextFieldConfig,
} from "../types/index"

const validateField = ({
  form,
  fieldName,
  value,
}: {
  form: MakForm
  fieldName: string
  value: any
}) => {
  const config = form[fieldName] as MakFormFieldConfig
  const label = config?.label
  const type: FieldType =
    (form[fieldName] as MakFormFieldConfig)?.type || "text"
  const required = config?.required || false
  const pattern = RegExp(config?.pattern || ".*")

  const minLength = (config as TextFieldConfig)?.minLength
  const maxLength = (config as TextFieldConfig)?.maxLength

  const min = (config as NumberFieldConfig)?.min
  const max = (config as NumberFieldConfig)?.max

  const min0 = (config as BoundedRangeFieldConfig)?.min0
  const max0 = (config as BoundedRangeFieldConfig)?.max0
  const min1 = (config as BoundedRangeFieldConfig)?.min1
  const max1 = (config as BoundedRangeFieldConfig)?.max1

  const errors = {} as MakFormErrors

  if (required && !value && value !== 0 && value !== false) {
    const errorString = `${label} is required.`
    // setFormErrors((prev) => ({
    //   ...prev,
    //   [fieldName]: errorString,
    // }))
    errors[fieldName] = errorString
    return errors
  }

  if (pattern && !pattern.test(value)) {
    const errorString = "Invalid format."
    // setFormErrors((prev) => ({ ...prev, [fieldName]: errorString }))
    errors[fieldName] = errorString
    return errors
  }

  if (typeof value === "string") {
    const errorString = `Minimum length is ${minLength}.`
    if (minLength !== undefined && value.length < minLength) {
      // setFormErrors((prev) => ({
      //   ...prev,
      //   [fieldName]: errorString,
      // }))
      errors[fieldName] = errorString
      return errors
    }
    if (maxLength !== undefined && value.length > maxLength) {
      const errorString = `Maximum length is ${maxLength}.`
      // setFormErrors((prev) => ({
      //   ...prev,
      //   [fieldName]: `Maximum length is ${maxLength}.`,
      // }))
      errors[fieldName] = errorString
      return errors
    }
  }

  if (type === "number" && typeof value === "number") {
    const errorString = `Minimum value is ${min}.`
    if (min !== undefined && value < min) {
      // setFormErrors((prev) => ({
      //   ...prev,
      //   [fieldName]: errorString,
      // }))
      errors[fieldName] = errorString
      return errors
    }
    if (max !== undefined && value > max) {
      const errorString = `Maximum value is ${max}.`
      // setFormErrors((prev) => ({
      //   ...prev,
      //   [fieldName]: errorString,
      // }))
      errors[fieldName] = errorString
      return errors
    }
  }

  errors[fieldName] = undefined

  return errors
}

const validateForm = ({ form }: { form: MakForm }) => {
  const errors = {} as MakFormErrors

  Object.keys(form).forEach((fieldName) => {
    if (fieldName === "submit" || fieldName === "reset") return

    const value = form?.[fieldName]?.value
    const validation = validateField({
      fieldName,
      value,
      form,
    })

    if (Object.entries(validation).some(([_, error]) => error)) {
      // errors[fieldName] = error
      errors[fieldName] = validation[fieldName]
    } else {
      errors[fieldName] = undefined
    }
  })

  // setFormErrors((prev) => errors)
  return errors
}

export { validateField, validateForm }
