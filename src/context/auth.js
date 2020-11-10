import jwtDecode from "jwt-decode"
import React, { createContext, useReducer } from "react"
import { variables } from "../utils/variables"

const initialState = { user: null }
const AuthContext = createContext({ user: null, login: (userData) => {}, logout: () => {} })

if (localStorage.getItem(variables.token)) {
  const decoedToken = jwtDecode(localStorage.getItem(variables.token))
  if (decoedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem(variables.token)
  } else {
    initialState.user = decoedToken
  }
}

const authReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case "LOGIN":
      localStorage.setItem(variables.token, payload.token)
      return { ...state, user: payload }
    case "LOGOUT":
      localStorage.removeItem(variables.token)
      return { ...state, user: null }
    default:
      return state
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const login = (userData) => dispatch({ type: "LOGIN", payload: userData })
  const logout = () => dispatch({ type: "LOGOUT" })
  return <AuthContext.Provider value={{ user: state.user, login, logout }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
