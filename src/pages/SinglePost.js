import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import { Button, Card, Grid, Icon, Image, Label, Popup } from "semantic-ui-react"
import moment from "moment"
import LikeButton from "../Components/LikeButton"
import { AuthContext } from "../context/auth"
import DeleteButton from "../Components/DeleteButton"
import { variables } from "../utils/variables"
import CommentForm from "../Components/CommentForm"

const SinglePost = ({ history: { push } }) => {
  const { postId } = useParams()
  const { user } = useContext(AuthContext)
  const { data, loading } = useQuery(FETCH_POST, { variables: { postId } })
  const deletePostCallBack = () => push(variables.routes.home)
  let post = null
  if (loading) {
    post = <p>Loading post...</p>
  } else if (data) {
    const { id, body, createdAt, username, likeCount, comments, likes, commentCount } = data.getPost
    post = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image size="small" src="https://react.semantic-ui.com/images/avatar/large/molly.png" float="right" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                  content="Comment on post"
                  trigger={
                    <Button as="div" labelPosition="right">
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }></Popup>
                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallBack} />}
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <CommentForm postId={postId} />
              </Card.Content>
            </Card>

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && <DeleteButton postId={id} commentId={comment.id} />}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return post
}

const FETCH_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`
export default SinglePost
