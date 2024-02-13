// import { MakFormElement } from "../types/index"
// import { isObject } from "./helpers"

// const determineKey = (field: MakFormElement) => {
//   const defaultKey = field?.valueKey || "value"
//   const alternatives = ["key", "id"]

//   if (defaultKey in field) {
//     return defaultKey
//   }

//   if (isObject(field.value) && typeof field.value === "object") {
//     for (const key of alternatives) {
//       if (key in field.value) {
//         return key
//       }
//     }
//   }

//   const fieldValue = field[defaultKey]
//   if (
//     typeof fieldValue === "string" ||
//     typeof fieldValue === "number" ||
//     typeof fieldValue === "boolean"
//   ) {
//     return defaultKey
//   } else {
//     throw new Error(
//       `Unable to determine a key for ${
//         field.fieldName || field.label || field.name
//       }, please provide a "valueKey" for this field.`
//     )
//   }
// }

// export default determineKey
