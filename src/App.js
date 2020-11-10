import { BrowserRouter, Route } from "react-router-dom"
import "semantic-ui-css/semantic.min.css"
import { Container } from "semantic-ui-react"
import "./App.css"
import MenuBar from "./Components/MenuBar"
import SinglePost from "./pages/SinglePost"
import { AuthProvider } from "./context/auth"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AuthRoute from "./utils/AuthRoute"
import { variables } from "./utils/variables"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Route exact path={variables.routes.home} component={Home} />
          <AuthRoute exact path={variables.routes.login} component={Login} />
          <AuthRoute exact path={variables.routes.register} component={Register} />
          <Route exact path={`${variables.routes.post}:postId`} component={SinglePost} />
        </Container>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
