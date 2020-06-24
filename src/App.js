import React from 'react';
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
            <div>
                <h1>Homepage</h1>

                {this.state.posts.map((p) => {
                    return (
                        <div>
                            <h2>{p.boast_or_roast === 'B' ? 'Boast' : 'Roast'}</h2>
                            <ul>
                                <li>{p.content}</li>
                                <li>upvotes: {p.upvotes} | downvotes: {p.downvotes}</li>
                                <li>date created: {p.upload_date}</li>
                                <li>upvote & downvote buttons here</li>
                            </ul>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default App;
