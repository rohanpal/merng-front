import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React, { useContext, useState } from "react"
import { Button, Form } from "semantic-ui-react"
import { AuthContext } from "../context/auth"
import { useForm } from "../utils/hooks"

const Register = ({ history: { push } }) => {
  const { login } = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const { values, onChange, onSubmit } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [adduser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, { data: { register: userData } }) => {
      login(userData)
      push("/")
    },
    variables: values,
    onError: (error) => setErrors(error.graphQLErrors[0].extensions.errors),
  })
  function registerUser() {
    adduser()
  }

  return (
    <div className="register-form">
      <h1>Register for free!</h1>
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
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          error={errors.email}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
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

const REGISTER_USER = gql`
  mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, confirmPassword: $confirmPassword }) {
      id
      email
      createdAt
      token
      username
    }
  }
`

export default Register
