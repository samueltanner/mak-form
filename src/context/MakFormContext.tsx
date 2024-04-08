import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  MakForm as MakFormType,
  MakFormDynamicComponents,
  MakFormErrors,
  MakFormProps,
  useMakForm,
  InputChangeEvent,
  MakFormValidationOption,
  FormAccessor,
  MakFormElement,
} from ".."
import componentFactory, {
  constructDynamicComponents,
  getComponentName,
  getInitialComponentNames,
} from "@/functions/componentFactory"
import { validateField, validateForm } from "@/functions/validate"
import { ensureSingleElementType } from "@/functions/helpers"
import constructForm from "@/functions/constructForm"

interface MakFormContextType {
  form: MakFormType
  components: MakFormDynamicComponents
  errors: MakFormErrors
  formState: {
    errors: MakFormErrors
    values: any
    dirty: boolean
    clean: boolean
  }
  handleChange: (target: string, value: any) => void
  reset: () => void
  submit: () => void
}

const MakFormContext = createContext<MakFormContextType | undefined>(undefined)

export const MakFormProvider = ({
  formConfig,
  useMakElements,
  useHTMLElements,
  useMakComponents,
  onSubmit,
  onReset,
  validateFormOn = "submit",
  revalidateFormOn = "none",
  resetOnSubmit = true,
  children,
}: MakFormProps) => {
  const outputType = ensureSingleElementType({
    useMakElements,
    useHTMLElements,
    useMakComponents,
  })

  const formRef = useRef<MakFormType>(formConfig || {})
  const originalFormRef = useRef<MakFormType>()
  const errorsRef = useRef<MakFormErrors>({})
  const beforeValidationErrorsRef = useRef<MakFormErrors>(
    Object.entries(formConfig || {}).reduce((acc, [key, value]) => {
      if (!["button", "submit", "reset"].includes((value as any)?.type)) {
        ;(acc as MakFormErrors)[key] = undefined
      }
      return acc
    }, {})
  )

  const [form, setForm] = useState<MakFormType>({})
  const [errors, setErrors] = useState<MakFormErrors>({})

  const [dynamicComponents, setDynamicComponents] =
    useState<MakFormDynamicComponents>(getInitialComponentNames({ formConfig }))
  const [isDirty, setIsDirty] = useState(false)
  const [isClean, setIsClean] = useState(true)

  useEffect(() => {
    setIsClean(!isDirty)
  }, [isDirty])

  const formAccessor: FormAccessor = {
    form: formRef.current as MakFormType,
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

    const prev = formRef.current as MakFormType
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
    } as MakFormType

    const validation = validateField({
      form: updatedForm,
      fieldName,
      value,
    })?.[fieldName] as string | undefined

    updatedForm[fieldName]!.errors = validation

    formRef.current = updatedForm as MakFormType
    setForm(updatedForm as MakFormType)

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

  const handlePublicChange = (name: string, value: any) => {
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
    const validation = validateForm({ form: form || {} })
    if (Object.values(validation).some((error) => error)) {
      errorsRef.current = validation
      setErrors(errorsRef.current)
      const errorsOnly = Object.entries(validation).reduce(
        (acc, [key, value]) => {
          if (value) {
            ;(acc as MakFormErrors)[key] = value
          }
          return acc
        },
        {}
      )
      console.warn("Form has errors:", errorsOnly)
      return
    }
    if (onSubmit) {
      onSubmit(getFormValues())
    }
    if (resetOnSubmit) {
      constructFormAndComponents()
    }
  }

  function handleReset() {
    if (onReset) {
      onReset()
    } else {
      setForm(originalFormRef.current as MakFormType)
      formRef.current = originalFormRef.current as MakFormType
      constructFormAndComponents()
    }
  }

  const constructFormAndComponents = () => {
    if (!formConfig) return
    const constructedForm = constructForm(formAccessor)

    if (originalFormRef.current) {
      const generatedDynamicComponents = constructDynamicComponents({
        ...formAccessor,
        form: originalFormRef.current,
      } as FormAccessor)
      setDynamicComponents(generatedDynamicComponents)
      setForm(constructedForm)
    } else {
      formRef.current = constructedForm

      const errors = validateForm({ form: constructedForm })
      beforeValidationErrorsRef.current = errors
      originalFormRef.current = constructedForm as MakFormType
      setForm(originalFormRef.current)
      const generatedDynamicComponents =
        constructDynamicComponents(formAccessor)
      setDynamicComponents(generatedDynamicComponents)
    }
    setIsDirty(false)
  }

  function getFormValues() {
    if (!formRef.current) return undefined
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

    return formValues as { [key: string]: string }
  }

  useEffect(() => {
    constructFormAndComponents()
  }, [formConfig])

  const value = {
    form: form,
    components: dynamicComponents,
    errors: errors,
    formState: {
      errors: beforeValidationErrorsRef.current,
      values: getFormValues(),
      dirty: isDirty,
      clean: isClean,
    },
    handleChange: handlePublicChange,
    reset: handleReset,
    submit: handleSubmit,
  } as {
    components: MakFormDynamicComponents
    form: MakFormType
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

  return (
    <MakFormContext.Provider value={value}>{children}</MakFormContext.Provider>
  )
}

export const useMakFormContext = () => {
  const context = useContext(MakFormContext)
  if (context === undefined) {
    throw new Error("MakForm must be used within a FormProvider")
  }
  return context
}
