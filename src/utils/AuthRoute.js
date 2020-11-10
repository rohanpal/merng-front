import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { AuthContext } from "../context/auth"
import { variables } from "./variables"

const AuthRoute = ({ component: Component, ...restProps }) => {
  const { user } = useContext(AuthContext)
  return <Route {...restProps} render={(props) => (user ? <Redirect to={variables.routes.home} /> : <Component {...props} />)} />
}

export default AuthRoute
