import {
  constructDynamicComponents,
  getInitialComponentNames,
} from "../functions/componentFactory"
import constructForm from "../functions/constructForm"
import { ensureSingleElementType } from "../functions/helpers"
import React, { useEffect, useRef, useState } from "react"

import {
  InputChangeEvent,
  MakForm,
  MakFormComponentOutputType,
  MakFormDynamicComponents,
  MakFormErrors,
  MakFormInput,
  MakFormValidationOption,
} from "../types/index"
import { validateField, validateForm } from "../functions/validate"

interface MakFormProps {
  formConfig?: MakFormInput
  onSubmit?: (input?: any) => void
  onReset?: (input?: any) => void
  useMakElements?: boolean
  useHTMLElements?: boolean
  useMakComponents?: boolean
  validateFormOn?: MakFormValidationOption
  revalidateFormOn?: MakFormValidationOption
}

export interface FormAccessor {
  form: MakForm
  handleChange: ({
    event,
    validateOn,
  }: {
    event: InputChangeEvent
    validateOn: MakFormValidationOption
    revalidateOn?: MakFormValidationOption
  }) => void
  formRef: React.MutableRefObject<MakForm | undefined>
  outputType: MakFormComponentOutputType
  onSubmit?: (input?: any) => void
  onReset?: (input?: any) => void
  validateFormOn?: MakFormValidationOption
  revalidateFormOn?: MakFormValidationOption
}

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

  console.log({ makFormoutputtype: outputType })

  const formRef = useRef<MakForm>()
  const errorsRef = useRef<MakFormErrors>({})
  const beforeValidationErrorsRef = useRef<MakFormErrors>({})
  const [form, setForm] = useState<MakForm>(formConfig || {})
  const [formErrors, setFormErrors] = useState<MakFormErrors>(
    Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
      if (!["button", "submit", "reset"].includes((value as any)?.type)) {
        ;(acc as MakFormErrors)[key] = undefined
      }
      return acc
    }, {})
  )
  const [dynamicComponents, setDynamicComponents] =
    useState<MakFormDynamicComponents>(getInitialComponentNames({ formConfig }))
  const [isDirty, setIsDirty] = useState(false)
  const [isClean, setIsClean] = useState(true)

  useEffect(() => {
    setIsClean(!isDirty)
  }, [isDirty])

  const formAccessor: FormAccessor = {
    form,
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

    const value = target?.type === "checkbox" ? target.checked : target.value
    const fieldName = target.name

    let validation: string | undefined = undefined

    if (validateOn === "change" || validateFormOn === "change") {
      validation = validateField({
        form,
        fieldName,
        value,
      })?.[fieldName] as string | undefined

      setFormErrors((prev) => {
        const updatedErrors = {
          ...prev,
          [fieldName]: validation,
        }
        return updatedErrors as MakFormErrors
      })
    }
    if (
      errorsRef.current?.[fieldName] &&
      (revalidateFormOn === "change" || revalidateOn === "change")
    ) {
      validation = validateField({
        form,
        fieldName,
        value,
      })?.[fieldName] as string | undefined

      setFormErrors((prev) => {
        const updatedErrors = {
          ...prev,
          [fieldName]: validation,
        }
        return updatedErrors as MakFormErrors
      })
    }

    setForm((prev): MakForm => {
      const updatedForm = {
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          ...target,
          errors: validation,
        },
      }
      return updatedForm as MakForm
    })

    beforeValidationErrorsRef.current = validateForm({
      form: formRef.current || {},
    })
  }

  function handleSubmit() {
    const validation = validateForm({ form: formRef.current || {} })

    setFormErrors(validation)
    if (formErrors && Object.values(validation).some((error) => error)) {
      return
    }
    if (onSubmit) {
      onSubmit(formRef.current)
    }
    constructFormAndComponents()
  }

  function handleReset() {
    if (onReset) {
      onReset()
    } else {
      constructFormAndComponents()
    }
  }

  const constructFormAndComponents = () => {
    if (!formConfig) return
    const constructedForm = constructForm(formAccessor)
    setForm(constructedForm)
    setDynamicComponents(constructDynamicComponents(formAccessor))
    setIsDirty(false)
  }

  const getFormValues = () => {
    if (!formRef.current) return
    const formValues = Object.entries(formRef.current).reduce(
      (acc, [key, value]) => {
        if (value?.type !== "submit" && value?.type !== "reset") {
          ;(acc as any)[key] = value?.value
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

  useEffect(() => {
    formRef.current = form
  }, [form])

  useEffect(() => {
    errorsRef.current = formErrors
  }, [formErrors])

  return {
    form,
    components: dynamicComponents,
    errors: formErrors,
    formState: {
      errors: beforeValidationErrorsRef.current,
      values: getFormValues(),
      dirty: isDirty,
      clean: isClean,
    },
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
    reset: () => void
    submit: () => void
  }
}

export default useMakForm
