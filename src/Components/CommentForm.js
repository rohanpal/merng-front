import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React, { useContext, useState } from "react"
import { withRouter } from "react-router-dom"
import { Form } from "semantic-ui-react"
import { AuthContext } from "../context/auth"
import { FETCH_POSTS } from "../utils/graphql"
import { variables } from "../utils/variables"

const CommentForm = ({ postId, history: { push } }) => {
  const { user } = useContext(AuthContext)
  const [comment, setComment] = useState("")
  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update: (proxy, result) => {
      setComment("")

      const { comments, commentCount } = result.data.createComment
      try {
        const data = proxy.readQuery({ query: FETCH_POSTS })
        proxy.writeQuery({ query: FETCH_POSTS, data: { ...data, getPosts: { commentCount, comments, ...data.getPosts } } })
      } catch (error) {}
    },
  })
  const onSubmit = () => {
    if (!user) {
      return push(variables.routes.login)
    } else {
      submitComment()
    }
  }
  return (
    <Form onSubmit={onSubmit}>
      <div className="ui action input fluid">
        <input
          type="text"
          placeholder="Comment.."
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit" className="ui button teal" disabled={comment.trim() === ""}>
          Submit
        </button>
      </div>
    </Form>
  )
}
const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        createdAt
        username
        body
      }
    }
  }
`
export default withRouter(CommentForm)
