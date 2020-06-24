import React, {Component} from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super (props)
        this.state = {
            posts: [],
        }
    }
    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/post/?format=json')
        .then(res => res.json())
        .then(data => this.setState({posts: data}))
    }

    render() {
        return (
            <section>
                <header>
                    <h1>Homepage</h1>
                </header>
                <PostList
                    posts={this.state.posts}
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
                <li>upvote & downvote buttons here</li>
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
            <Post
                boastorroast = {post.boast_or_roast}
                content = {post.content}
                upvotes = {post.upvotes}
                downvotes = {post.downvotes}
                date = {post.upload_date}
            />
          ))}
        </ul>
      </section>
    );
  }
}

export default App;
