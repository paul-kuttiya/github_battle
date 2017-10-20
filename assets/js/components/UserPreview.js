import React from 'react';
import PropTypes from 'prop-types';

const UserPreview = (props) => {
  return (
    <div className="column">
      <label>{props.id}</label>
      <img src={props.avatar} />
      <h2>@{props.name}</h2>
      {props.children}
    </div>
  )
}

UserPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default UserPreview;