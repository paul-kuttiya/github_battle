import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserPreview = (props) => {
  return (
    <div className="column">
      <label>{props.id}</label>
      <img src={props.avatar} />
      <h2>@{props.name}</h2>
      <small 
        className="btn btn-danger" 
        onClick={props.onReset.bind(null, props.id)}>
        Reset
      </small>
    </div>
  )
}

UserPreview.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
}

class UserInput extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.id,
          name = this.state.username;

    this.props.onSubmit(id, name);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">{this.props.label}</label>
        <input 
          id="username"
          type="text" 
          placeholder="github usename" 
          autoComplete="off" 
          value={this.state.username}
          onChange={this.handleChange} 
        />
        <button 
          disabled={!this.state.username} type="submit" 
          className="btn btn-info">Submit</button>
      </form>
    )
  }
}

UserInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

class Battle extends React.Component {
  constructor() {
    super();

    this.state = {
      user1: {
        image: null,
        name: ""
      },
      user2: {
        image: null,
        name: ""
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit(id, name) {
    const newState = { 
      [id]: {
        name,
        image: `https://github.com/${name}.png?size=200`,
      }
    };

    this.setState(newState);
  }

  handleReset(id) {
    this.setState({
      [id]: {
        image: null,
        name: ''
      }
    });
  }

  render() {
    const match = this.props.match,
          user1 = this.state.user1,
          user2 = this.state.user2;

    return (
      <div>
        <div className="battle">
          {!!user1.name ||
            <UserInput 
              label={"user1"} 
              id="user1" 
              onSubmit={this.handleSubmit} 
            />
          }

          {!user1.image || 
            <UserPreview 
              id="user1" 
              avatar={user1.image} 
              name={user1.name} 
              onReset={this.handleReset} 
            />
          }

          {!!user2.name ||
            <UserInput 
              label={"user2"} 
              id="user2" 
              onSubmit={this.handleSubmit} 
            />
          }

          {!user2.image || 
            <UserPreview 
              id="user2" 
              avatar={user2.image} 
              name={user2.name} 
              onReset={this.handleReset} 
            />
          }
        </div>
        { (!!user1.image && 
          !!user2.image) &&
          <Link 
            className="center btn btn-success" 
            to={{
              pathname: `${match.url}/results`,
              search: `?user1=${user1.name}&user2=${user2.name}`
          }}>
            Battle
          </Link>
        }
      </div>
    )
  }
}

export default Battle;