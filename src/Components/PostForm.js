import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React from "react"
import { Button, Form } from "semantic-ui-react"
import { FETCH_POSTS } from "../utils/graphql"
import { useForm } from "../utils/hooks"

const PostForm = () => {
  function createPostCallBack() {
    createPost()
  }
  const { onChange, onSubmit, values } = useForm(createPostCallBack, { body: "" })
  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update: (proxy, result) => {
      let data = proxy.readQuery({
        query: FETCH_POSTS,
      })
      data = { ...data, getPosts: [result.data.createPost, ...data.getPosts] }
      proxy.writeQuery({ query: FETCH_POSTS, data })
      values.body = ""
    },
  })
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Form.Input onChange={onChange} name="body" placeholder="POST IT!" value={values.body} error={error ? true : false} />
        </Form.Field>
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      createdAt
      body
      username
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        username
        createdAt
        body
      }
      likeCount
      commentCount
    }
  }
`
export default PostForm
