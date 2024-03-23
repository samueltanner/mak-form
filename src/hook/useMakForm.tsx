import componentFactory, {
  constructDynamicComponents,
  getComponentName,
  getInitialComponentNames,
} from "../functions/componentFactory"
import constructForm from "../functions/constructForm"
import { ensureSingleElementType } from "../functions/helpers"
import React, { useEffect, useRef, useState } from "react"
import {
  FormAccessor,
  InputChangeEvent,
  MakForm,
  MakFormDynamicComponents,
  MakFormElement,
  MakFormErrors,
  MakFormFieldConfig,
  MakFormProps,
  MakFormValidationOption,
} from "../types/index"
import { validateField, validateForm } from "../functions/validate"

export const useMakForm = ({
  formConfig,
  useMakElements,
  useHTMLElements,
  useMakComponents,
  onSubmit,
  onReset,
  validateFormOn = "submit",
  revalidateFormOn = "none",
}: MakFormProps) => {
  const outputType = ensureSingleElementType({
    useMakElements,
    useHTMLElements,
    useMakComponents,
  })

  const formRef = useRef<MakForm>(formConfig || {})
  const originalFormRef = useRef<MakForm>()
  const errorsRef = useRef<MakFormErrors>({})
  const beforeValidationErrorsRef = useRef<MakFormErrors>(
    Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
      if (!["button", "submit", "reset"].includes((value as any)?.type)) {
        ;(acc as MakFormErrors)[key] = undefined
      }
      return acc
    }, {})
  )

  const [form, setForm] = useState<MakForm>({})
  const [errors, setErrors] = useState<MakFormErrors>({})
  // const [formErrors, setFormErrors] = useState<MakFormErrors>(
  //   Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
  //     if (!["button", "submit", "reset"].includes((value as any)?.type)) {
  //       ;(acc as MakFormErrors)[key] = undefined
  //     }
  //     return acc
  //   }, {})
  // )
  const [dynamicComponents, setDynamicComponents] =
    useState<MakFormDynamicComponents>(getInitialComponentNames({ formConfig }))
  const [isDirty, setIsDirty] = useState(false)
  const [isClean, setIsClean] = useState(true)

  useEffect(() => {
    setIsClean(!isDirty)
  }, [isDirty])

  const formAccessor: FormAccessor = {
    form: formRef.current as MakForm,
    handleChange,
    outputType,
    onSubmit: handleSubmit,
    onReset: handleReset,
    validateFormOn,
    revalidateFormOn,
    formRef,
  }

  function handleChange({
    event,
    validateOn,
    revalidateOn,
  }: {
    event: InputChangeEvent
    validateOn: MakFormValidationOption
    revalidateOn?: MakFormValidationOption
  }) {
    setIsDirty(true)
    const target = event.target as HTMLInputElement
    const value = target.value || target.checked
    const fieldName = target.name

    const prev = formRef.current as MakForm
    const prevField = prev[fieldName]
    const updatedValue = {
      ...prevField,
    } as MakFormElement | MakFormErrors
    updatedValue["value"] = value
    updatedValue["errors"] = undefined

    const updatedForm = {
      ...prev,
      [fieldName]: {
        ...updatedValue,
      },
    } as MakForm

    const validation = validateField({
      form: updatedForm,
      fieldName,
      value,
    })?.[fieldName] as string | undefined

    updatedForm[fieldName]!.errors = validation

    formRef.current = updatedForm as MakForm
    setForm(updatedForm as MakForm)

    const continuousValidationErrors = {
      ...beforeValidationErrorsRef.current,
      [fieldName]: validation,
    }

    beforeValidationErrorsRef.current =
      continuousValidationErrors as MakFormErrors

    if (
      validateOn === "change" ||
      validateFormOn === "change" ||
      revalidateFormOn === "change" ||
      revalidateOn === "change"
    ) {
      errorsRef.current = beforeValidationErrorsRef.current
      setErrors(errorsRef.current)
    }
  }

  const handleChangePublic = (name: string, value: any) => {
    const elementType = formRef.current[name]?.type
    const event = {
      target: { name: name, value, type: elementType },
    } as InputChangeEvent

    handleChange({
      event,
      validateOn: "change",
      revalidateOn: "change",
    })
    const componentName = getComponentName(
      name,
      formConfig?.[name]?.componentName
    )
    const proxyAccessor = {
      ...formAccessor,
      form: formRef.current,
    }
    const dynamicComponent = componentFactory({
      formAccessor: proxyAccessor,
      name,
    })
    const updatedDynamicComponents = {
      ...dynamicComponents,
      [componentName]: dynamicComponent,
    }
    setDynamicComponents(updatedDynamicComponents)
  }

  function handleSubmit() {
    const validation = validateForm({ form: formRef.current || {} })
    if (Object.values(validation).some((error) => error)) {
      errorsRef.current = validation
      setErrors(errorsRef.current)
      return
    }
    if (onSubmit) {
      onSubmit(getFormValues())
    }
    constructFormAndComponents()
  }

  function handleReset() {
    if (onReset) {
      onReset()
    } else {
      setForm(originalFormRef.current as MakForm)
      formRef.current = originalFormRef.current as MakForm
      constructFormAndComponents()
    }
  }

  const constructFormAndComponents = () => {
    if (!formConfig) return
    const constructedForm = constructForm(formAccessor)

    if (originalFormRef.current) {
      const dynamicComponents = constructDynamicComponents({
        ...formAccessor,
        form: originalFormRef.current,
      } as FormAccessor)
      setDynamicComponents(dynamicComponents)
      setForm(constructedForm)
    } else {
      formRef.current = constructedForm

      const errors = validateForm({ form: constructedForm })
      beforeValidationErrorsRef.current = errors
      originalFormRef.current = constructedForm as MakForm
      setForm(originalFormRef.current)
      const dynamicComponents = constructDynamicComponents(formAccessor)
      setDynamicComponents(dynamicComponents)
    }
    setIsDirty(false)
  }

  function getFormValues() {
    if (!formRef.current) return
    const formValues = Object.entries(formRef.current).reduce(
      (acc, [key, value]) => {
        if (value?.type !== "submit" && value?.type !== "reset") {
          ;(acc as any)[key] = value?.value
        }
        if (formConfig?.[key]?.type === "number") {
          ;(acc as any)[key] = Number(value?.value) || 0
        }

        return acc
      },
      {}
    )

    return formValues
  }

  useEffect(() => {
    constructFormAndComponents()
  }, [formConfig])

  return {
    form: form,
    components: dynamicComponents,
    errors: errors,
    formState: {
      errors: beforeValidationErrorsRef.current,
      values: getFormValues(),
      dirty: isDirty,
      clean: isClean,
    },
    handleChange: handleChangePublic,
    reset: handleReset,
    submit: handleSubmit,
  } as {
    components: MakFormDynamicComponents
    form: MakForm
    formState: {
      errors: MakFormErrors
      values: any
      dirty: boolean
      clean: boolean
    }
    errors: MakFormErrors
    handleChange: (target: string, value: any) => void
    reset: () => void
    submit: () => void
  }
}

export default useMakForm
