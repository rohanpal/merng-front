import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React, { useContext, useState } from "react"
import { withRouter } from "react-router-dom"
import { Button, Confirm, Icon, Popup } from "semantic-ui-react"
import { AuthContext } from "../context/auth"
import { FETCH_POSTS } from "../utils/graphql"
import { variables } from "../utils/variables"

const DeleteButton = ({ postId, callback, commentId, history: { push } }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { user } = useContext(AuthContext)
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update: (proxy) => {
      setConfirmOpen(false)
      try {
        const data = proxy.readQuery({ query: FETCH_POSTS })
        proxy.writeQuery({ query: FETCH_POSTS, data: { ...data, getPosts: data.getPosts.filter((post) => post.id !== postId) } })
      } catch (error) {}
      if (callback) callback()
    },
  })

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { commentId, postId },
    update: (proxy, result) => {
      setConfirmOpen(false)
      const { id, comments, commentCount } = result.data.deleteComment
      try {
        const data = proxy.readQuery({ query: FETCH_POSTS })
        data.getPosts = data.getPosts.map((post) => {
          if (post.id !== id) {
            return { ...post, comments, commentCount }
          } else {
            return post
          }
        })

        proxy.writeQuery({
          query: FETCH_POSTS,
          data,
        })
      } catch (error) {}
    },
  })

  const onCancel = () => setConfirmOpen(false)
  const onClick = () => {
    if (user) {
      setConfirmOpen(true)
    } else {
      push(variables.routes.login)
    }
  }
  return (
    <>
      <Popup
        content="Delete"
        trigger={
          <Button as="div" color="red" onClick={onClick} floated="right">
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />

      <Confirm open={confirmOpen} onCancel={onCancel} onConfirm={commentId ? deleteComment : deletePost} />
    </>
  )
}
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        createdAt
        body
      }
      commentCount
    }
  }
`

export default withRouter(DeleteButton)
