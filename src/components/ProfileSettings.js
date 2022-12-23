import React, { Component } from "react";

export default class ProfileSettings extends Component {

  constructor(props) {
      super(props);
      this.state = {
        user_name: ""
      };
    }

    componentDidMount() {
        this.setState({user_name: localStorage.getItem('user_name')})
    }

    componentDidUpdate(prevProps) {
      if (this.props.isUserSigned !== prevProps.isUserSigned) {
        this.setState({user_name: localStorage.getItem('user_name')})
      }
    }

  render() {
    const isUserSigned = this.props.isUserSigned;
    return (
    <div>
    {(isUserSigned && isUserSigned !== "unlogged") ? (
      <div className="container">
        <header className="header">
          <h3>
            <strong>{this.state.user_name}'s Profile</strong>
          </h3>
        </header>
      </div>
    ) : (
      <h2>Sign in to see this page </h2>
    )}
    </div>
    );
  }
}
