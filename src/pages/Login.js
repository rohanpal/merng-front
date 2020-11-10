import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React, { useContext, useState } from "react"
import { Button, Form } from "semantic-ui-react"
import { AuthContext } from "../context/auth"
import { useForm } from "../utils/hooks"

const Login = ({ history: { push } }) => {
  const { login } = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const { values, onChange, onSubmit } = useForm(loginNewUser, {
    username: "",
    password: "",
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update: (_, { data: { login: userData } }) => {
      login(userData)
      push("/")
    },
    variables: values,
    onError: (error) => setErrors(error.graphQLErrors[0].extensions.errors),
  })
  function loginNewUser() {
    loginUser()
  }

  return (
    <div className="register-form">
      <h1>Login to your account!</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          onChange={onChange}
          error={errors.username}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          error={errors.password}
        />
        <Button primary type="submit" disabled={loading}>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      token
      username
      createdAt
    }
  }
`

export default Login
