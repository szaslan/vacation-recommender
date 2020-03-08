import React, { createContext, useState } from "react"

export const GlobalContext = createContext({})

const GlobalContextProvider = ({ children }) => {
  /*
    Need some structure to store state as user progresses, and build query
  */

  const handleChange = ({ field, value }) => {
    setState({
      ...state,
      [field]: value
    })
  }
  const initalState = { handleChange, climate: "warm" }
  const [state, setState] = useState(initalState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContextProvider
