import React from 'react';
import api from '../utils/api';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserPreview from './UserPreview';

const Profile = (props) => {
  const info = props.info;
  return(
    <UserPreview avatar={info.avatar_url} name={info.login} >
      <ul>
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Following: {info.following}</li>
        <li>Followers: {info.followers}</li>
        <li>Public Repos: {info.public_repos}</li>             
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}        
      </ul>
    </UserPreview>
  )
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
}

const User = (props) => {
  return (
    <div className="inline-center">
      <h1>{props.label}</h1>
      <h3>Scores: {props.score}</h3>
      <Profile info={props.profile} />
    </div>
  )
}

User.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
}

class Results extends React.Component {
  constructor() {
    super();

    this.state = {
      winner: null,
      loser: null,
      loading: true,
      error: null
    }
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);

    api.battle([params.user1, params.user2])
       .then(results => {
          if (results === null) {
            this.setState({
              error: 'There is some error check github API or input!',
            });
          };

          this.setState({
            loading: false,
            winner: results.winner,
            loser: results.loser
          });
       });
  }

  render() {
    const error = this.state.error,
          winner = this.state.winner,
          loser = this.state.loser,
          loading = this.state.loading;

    if (!!loading) {
      return <h1>Loading...</h1>
    }

    if (!!error) {
      return (
        <div>
          <p>{error}</p>
          <Link path="/battle" className="btn btn-danger">Reset</Link>
        </div>
      )
    }

    return (
      <div className="battle">
        <User 
          label="Winner" 
          score={winner.score} 
          profile={winner.profile}
        />

        <User 
          label="Loser" 
          score={loser.score} 
          profile={loser.profile}
        />
      </div>
    )
  }
}

export default Results;