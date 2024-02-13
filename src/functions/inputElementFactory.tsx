// import { DetailedHTMLProps, SelectHTMLAttributes } from "react"

// import {
//   ButtonFieldConfig,
//   DateFieldConfig,
//   FieldType,
//   InputChangeEvent,
//   MakFormFieldConfig,
//   NumberFieldConfig,
//   SelectFieldConfig,
//   TextFieldConfig,
//   ValueOptions,
// } from "../types/form-types"
// // import {
// //   ButtonFieldConfig,
// //   DateFieldConfig,
// //   FieldType,
// //   NumberFieldConfig,
// //   SelectFieldConfig,
// //   TextFieldConfig,
// // } from "../types/field-types"
// import { FormAccessor } from "../useMakForm"
// import handleChange from "./handleChange"

// interface CreateInputElementProps {
//   name: string
//   formAccessor: FormAccessor
// }

// const inputElementFactory = ({
//   name,
//   formAccessor,
// }: CreateInputElementProps): JSX.Element | undefined => {
//   const { form, setForm, setFormErrors } = formAccessor
//   const config = form[name]
//   const type: FieldType = (form[name] as MakFormFieldConfig)?.type || "text"
//   const placeholder = config?.placeholder
//   const fieldValue = config?.value ?? config?.defaultValue
//   const disabled = config?.disabled || false
//   const className = `
//     ${form[name]?.className} ${
//     disabled ? "cursor-not-allowed opacity-50" : "opacity-100"
//   }`
//   const label = config?.label || ""
//   const onClick = (config as ButtonFieldConfig)?.onClick
//   const value = config?.value as string | number
//   const defaultValue = config?.defaultValue || ""
//   const hide = config?.hide || false

//   let inputProps = {
//     name,
//     onChange: (event: InputChangeEvent) =>
//       handleChange({
//         form,
//         event,
//         setForm,
//         setFormErrors,
//       }),
//     className,
//     label,
//     defaultValue,
//   }

//   switch (type) {
//     case "select":
//       const options = (config as SelectFieldConfig).options || []
//       const labelKey = (config as SelectFieldConfig)?.labelKey || "label"
//       const valueKey = (config as SelectFieldConfig)?.valueKey || "value"

//       const selectJsx = () => (
//         <select
//           {...inputProps}
//           value={value}
//           defaultValue={
//             defaultValue as DetailedHTMLProps<
//               SelectHTMLAttributes<HTMLSelectElement>,
//               HTMLSelectElement
//             >["defaultValue"]
//           }
//         >
//           {/* {placeholder && (
//             <option value="" disabled>
//               {placeholder as string}
//             </option>
//           )} */}

//           {options.map((option) => (
//             <option key={option[valueKey]} value={option[valueKey]}>
//               {option[labelKey]}
//             </option>
//           ))}
//         </select>
//       )

//       if (!hide) {
//         return selectJsx()
//       }
//     case "boolean":
//       let booleanJsx = (props?: any) => (
//         <input
//           {...inputProps}
//           {...props}
//           type="checkbox"
//           checked={Boolean(fieldValue)}
//           disabled={disabled}
//         />
//       )

//       if (!hide) {
//         return booleanJsx()
//       }

//     case "button":
//       const buttonJsx = (props?: any) => (
//         <button
//           {...props}
//           type="button"
//           label={label}
//           // onClick={() => handleClickInternal(onClick)}
//           enabled={true}
//           className={className}
//           disabled={disabled}
//         />
//       )

//       if (!hide) {
//         return buttonJsx()
//       }
//     case "number":
//       const fieldValueNumber = Number(fieldValue)
//       const numberJsx = (props?: any) => (
//         <input
//           {...inputProps}
//           {...props}
//           type="number"
//           value={fieldValueNumber}
//           placeholder={config?.placeholder || (placeholder as string)}
//           min={(config as NumberFieldConfig)?.min}
//           max={(config as NumberFieldConfig)?.max}
//           required={config?.required}
//           disabled={disabled}
//         />
//       )

//       if (!hide) {
//         return numberJsx()
//       }
//     case "date":
//       const dateJsx = (props?: any) => (
//         <input
//           {...inputProps}
//           {...props}
//           type="date"
//           value={fieldValue as string}
//           placeholder={placeholder as string}
//           min={(config as DateFieldConfig)?.min}
//           max={(config as DateFieldConfig)?.max}
//           required={config?.required}
//           disabled={disabled}
//         />
//       )

//       if (!hide) {
//         return dateJsx()
//       }
//     case "text":
//       const textJsx = (props?: any) => (
//         <input
//           {...inputProps}
//           {...props}
//           type="text"
//           value={fieldValue as string}
//           placeholder={placeholder as string}
//           minLength={(config as TextFieldConfig)?.minLength}
//           maxLength={(config as TextFieldConfig)?.maxLength}
//           required={config?.required}
//           disabled={disabled}
//         />
//       )
//       return textJsx()

//     default:
//       const defaultJsx = (props?: any) => (
//         <input
//           {...inputProps}
//           {...props}
//           type="text"
//           value={fieldValue as string}
//           placeholder={placeholder as string}
//           minLength={(config as TextFieldConfig)?.minLength}
//           maxLength={(config as TextFieldConfig)?.maxLength}
//           required={config?.required}
//           disabled={disabled}
//         />
//       )
//       if (!hide) {
//         return defaultJsx()
//       }
//   }
// }

// export default inputElementFactory

// const constructInputElements = (formAccessor: FormAccessor) => {
//   const { form, setForm, setFormErrors } = formAccessor
//   const inputElements: { [key: string]: JSX.Element } = {}

//   Object.keys(form).forEach((fieldName) => {
//     const inputElement = inputElementFactory({
//       name: fieldName,
//       formAccessor,
//     })

//     if (inputElement) {
//       inputElements[fieldName] = inputElement
//     }
//   })

//   return inputElements
// }

// export { constructInputElements }
