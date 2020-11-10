import React, { useContext, useEffect, useState } from "react"
import { Link, withRouter } from "react-router-dom"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { Button, Label, Icon, Popup } from "semantic-ui-react"
import { variables } from "../utils/variables"
import { AuthContext } from "../context/auth"

// import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes }, history: { push } }) {
  const [liked, setLiked] = useState(false)
  const { user: currentuser } = useContext(AuthContext)

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true)
    } else setLiked(false)
  }, [user, likes])

  const [likePost, { loading }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  })

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to={variables.routes.login} color="teal" basic>
      <Icon name="heart" />
    </Button>
  )
  const onLikeClick = () => {
    if (!currentuser) {
      return push(variables.routes.login)
    }
    if (!loading) {
      likePost()
    }
  }

  return (
    <Popup
      content="Like"
      trigger={
        <Button as="div" labelPosition="right" onClick={onLikeClick}>
          {likeButton}
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`

export default withRouter(LikeButton)
