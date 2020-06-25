import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
      posts: []
    }
    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/post/?format=json')
        .then(res => res.json())
        .then(data => this.setState({posts: data}))
    }
    handleUpvote = (event, postId, postUpvote) => {
      //identify what we want to change in this.state
      const newPostList = this.state.posts
      const newUpvote = postUpvote + 1
      for (let i = 0; i< newPostList.length; i++) {
          if (newPostList[i].id === postId){
              fetch("http://127.0.0.1:8000/api/post/"+postId+"/upvote/", {
                  method: "PUT",
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ upvotes: newUpvote })
              })
              newPostList[i].upvotes = newUpvote
              break;
          }
      }
      //overwrite the old state with new state
      this.setState({ posts: newPostList })
    }
    handleDownvote = (event, postId, postDownvote) => {
      //identify what we want to change in this.state
      const newPostList = this.state.posts
      const newDownvote = postDownvote + 1
      for (let i = 0; i< newPostList.length; i++) {
          if (newPostList[i].id === postId){
              fetch("http://127.0.0.1:8000/api/post/"+postId+"/downvote/", {
                  method: "PUT",
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ downvotes: newDownvote })
              })
              newPostList[i].downvotes = newDownvote
              break;
          }
      }
      //overwrite the old state with new state
      this.setState({ posts: newPostList })
    }

    render() {
        return (
            <section>
                <header>
                    <h1>Homepage</h1>
                </header>
                <PostList
                    posts={this.state.posts}
                    handleUpvote={this.handleUpvote}
                    handleDownvote={this.handleDownvote}
                />
            </section>
        );
    }
}

class Post extends Component {
  render() {
    return (
        <section>
            <h2>{this.props.boastorroast === 'B' ? 'Boast' : 'Roast'}</h2>
            <ul>
                <li>{this.props.content}</li>
                <li>upvotes: {this.props.upvotes} | downvotes: {this.props.downvotes}</li>
                <li>date created: {this.props.date}</li>
                <li><button onClick={this.props.handleUpvote}>Upvote</button> & <button onClick={this.props.handleDownvote}>Downvote</button></li>
            </ul>
        </section>
    );
  }
}

class PostList extends Component {
  render() {
    return (
      <section>
        <ul>
          {this.props.posts.map(post => (
            <Post key={post.id}
                boastorroast = {post.boast_or_roast}
                content = {post.content}
                upvotes = {post.upvotes}
                downvotes = {post.downvotes}
                votescore = {post.vote_score}
                date = {post.upload_date}
                handleUpvote = {event =>
                    this.props.handleUpvote(event, post.id, post.upvotes)}
                handleDownvote = {event =>
                    this.props.handleDownvote(event, post.id, post.downvotes)}
            />
          ))}
        </ul>
      </section>
    );
  }
}

export default App;
