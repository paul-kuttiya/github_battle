import React from 'react';
import PropTypes from 'prop-types';

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text
    }
  }

  componentDidMount() {
    const done = `${this.props.text}...`;

    this.interval = window.setInterval(() => {
      if (this.state.text === done) {
        this.setState(() => {
          return {
            text: this.props.text
          }
        });
      } else {
        this.setState((prevState, props) => {
          return {
            text: `${prevState.text}.`
          };
        });
      }
    }, this.props.speed);
  }

  componentWillUnMount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <h2 className={this.props.className}>
        {this.state.text}
      </h2>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired
}

Loading.defaultProps = {
  text: 'Loading',
  className: 'inline-center',
  speed: 150
}

export default Loading;