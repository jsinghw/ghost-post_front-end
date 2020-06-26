import React, {Component} from 'react';
import { Route, NavLink } from "react-router-dom"
import './App.css';

class App extends Component {
    state = {
        posts: [],
        form: {
            boast_or_roast: '',
            content: ''
        }
    }
    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/post/?format=json')
        .then(res => res.json())
        .then(data => this.setState({posts: data}))
    }
    handleUpvote = (event, postId, postUpvote) => {
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
                newPostList[i].vote_score = newPostList[i].vote_score + 1
                break;
            }
        }
        this.setState({ posts: newPostList })
    }
    handleDownvote = (event, postId, postDownvote) => {
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
                newPostList[i].vote_score = newPostList[i].vote_score - 1
                break;
            }
        }
        this.setState({ posts: newPostList })
    }
    handleGetVoteScore = (event) => {
        fetch('http://127.0.0.1:8000/api/post/highest_vote_scores/?format=json')
        .then(res => res.json())
        .then(data => this.setState({posts: data}))
    }
    handleGetPosts = (event) => {
        fetch('http://127.0.0.1:8000/api/post/?format=json')
        .then(res => res.json())
        .then(data => this.setState({posts: data}))
    }
    handleOptionChange = (event) => {
        // https://stackoverflow.com/questions/45054970/react-updating-one-state-property-removes-other-states-properties-in-the-state
        this.setState({form: {...this.state.form,[event.target.name]: event.target.value}})
    }
    handleSubmit = (event) => {
        fetch('http://127.0.0.1:8000/api/post/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.form)
        })
        event.preventDefault();
        window.location.reload(false)
    }

    render() {
        return (
            <section>
                <header>
                    <h1>Homepage</h1>
                    <NavLink to="/">All</NavLink>
                    <NavLink to="/boasts">Boasts</NavLink>
                    <NavLink to="/roasts">Roasts</NavLink>
                    <NavLink to="/vote_score">Vote Score</NavLink>
                    <p><NavLink to="/new_post">Make a Post</NavLink></p>
                </header>

                <Route exact path='/'>
                    <PostList
                        posts={this.state.posts}
                        handleUpvote={this.handleUpvote}
                        handleDownvote={this.handleDownvote}
                        />
                </Route>

                <Route exact path='/boasts'>
                    <PostList
                        posts={this.state.posts.filter(post => post.boast_or_roast === 'B')}
                        handleUpvote={this.handleUpvote}
                        handleDownvote={this.handleDownvote}
                        />
                </Route>

                <Route exact path='/roasts'>
                    <PostList
                        posts={this.state.posts.filter(post => post.boast_or_roast === 'R')}
                        handleUpvote={this.handleUpvote}
                        handleDownvote={this.handleDownvote}
                        />
                </Route>

                <Route exact path='/vote_score'>
                    <PostList
                        posts={this.state.posts.concat().sort((a,b) =>(a.vote_score < b.vote_score) ? 1 : -1)}
                        handleUpvote={this.handleUpvote}
                        handleDownvote={this.handleDownvote}
                        />
                </Route>
                <Route exact path='/new_post'>
                    <form id='new-post-form'>
                        <input
                            type='radio'
                            id ='boast'
                            name='boast_or_roast'
                            value='B'
                            onChange={this.handleOptionChange}
                            checked={this.state.form.boast_or_roast === 'B'}
                            />
                        <label htmlFor ='boast'>Boast</label>
                        <input
                            type='radio'
                            id ='roast'
                            name='boast_or_roast'
                            value='R'
                            onChange={this.handleOptionChange}
                            checked={this.state.form.boast_or_roast === 'R'}
                            />
                        <label htmlFor ='roast'>Roast</label><br/>
                        <label htmlFor = 'content'>Content: </label>
                        <input
                            type ='text'
                            id='content'
                            name='content'
                            onChange={this.handleOptionChange}
                            /><br/>
                        <input type='submit' value='Sumbit' onClick={this.handleSubmit}></input>
                    </form>
                </Route>
            </section>
        )
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
                date = {post.uploaded_date}
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
