import React, { useContext } from "react"
import { useQuery } from "@apollo/react-hooks"
import { Grid, Transition } from "semantic-ui-react"
import PostCard from "../Components/PostCard"
import PostForm from "../Components/PostForm"
import { AuthContext } from "../context/auth"
import { FETCH_POSTS } from "../utils/graphql"

const Home = () => {
  const { user } = useContext(AuthContext)
  const { loading, data } = useQuery(FETCH_POSTS)

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      {user && (
        <Grid.Column>
          <PostForm />
        </Grid.Column>
      )}
      <Grid.Row>
        {loading ? (
          <h1>Loading</h1>
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home
