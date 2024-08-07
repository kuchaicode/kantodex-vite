import { useState } from "react"

const useLocalStorage = (key:string, initialValue:Object) => {

  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.log(error)
    }
  })
// if existing value in localstorage exists, get key as initial state, otherwise initialValue  used

  const setValue = (value:Function) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.log(error)
    }
  }
  return [state, setValue]
}
// Setter. Runs stringify then saves to localstorage

export default useLocalStorage

export function getLocalStorage(key:string) {
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) : ""
}
// Retrieve value associated with provided key, check if it exists -> If it exists convert JSON String back into Object. Note: Because localstorage values are stored as String
