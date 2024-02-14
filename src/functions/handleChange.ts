import {
  InputChangeEvent,
  MakForm,
  MakFormValidationOption,
  FormAccessor,
} from "../types/index"

import { validateField } from "./validate"

interface HandleChangeProps {
  form: FormAccessor["form"]
  event: InputChangeEvent
  setForm: React.Dispatch<React.SetStateAction<MakForm>>
  setFormErrors: (errors: any) => void
  validateOn?: MakFormValidationOption
}

const handleChange = ({
  form,
  event,
  setForm,
  validateOn,
}: HandleChangeProps) => {
  const target = event.target as HTMLInputElement

  const value = target?.type === "checkbox" ? target.checked : target.value
  const fieldName = target.name

  let validation: string | undefined = undefined

  if (validateOn === "change" || validateOn === "blur") {
    validation = validateField({
      form,
      fieldName,
      value,
    })?.[fieldName] as string | undefined
  }

  setForm((prev: MakForm): MakForm => {
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
}

export default handleChange
