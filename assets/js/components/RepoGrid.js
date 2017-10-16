import React from 'react';
import PropTypes from 'prop-types';

export const Loading = () => {
  return (
    <p>Now Loading!</p>
  )
}

export const RepoGrid = (props) => {
  return (
    <ul className="popular-list">
      {props.repos.map((repo, i) => {
        return (
          <li key={repo.name} className="popular-item">
            <div className="popular-rank">{i + 1}</div>
            <ul className="space-list-items">
              <li>
                <img className="avatar" src={repo.owner.avatar_url} />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}
