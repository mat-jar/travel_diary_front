import React, { Component } from "react";
import {  Link } from "react-router-dom";
import * as Utils from '../Utils'
import { useNavigate} from "react-router-dom";
import { GoogleLogout } from 'react-google-login';
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { gapi } from 'gapi-script';

const CLIENT_ID = runtimeEnv().REACT_APP_GOOGLE_CLIENT_ID;

class Navbar extends Component {

  constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleFocus = this.handleFocus.bind(this);
      this.state = {
        successful: false,
        message: "",
        searchPhrase: "",
        user_name: ""
      };
    }

    componentDidUpdate(prevProps) {
      if (this.props.isUserSigned !== prevProps.isUserSigned) {
        this.setState({user_name: localStorage.getItem('user_name')})
      }
    }

    handleChange(event) {
      this.setState({searchPhrase: event.target.value});
    }

    handleFocus(event) {
      event.target.value = "";
      this.setState({searchPhrase: event.target.value});
    }

    handleSubmit(event) {
      if (event.key === 'Enter'){
        event.target.blur();
      }
      const {navigation} = this.props;
      this.props.setSearchPhrase(this.state.searchPhrase);
      navigation("/search")
      event.preventDefault();
    }

    logout(response) {
      console.log(response, "Google logout response")
      localStorage.clear();
      this.props.setIsUserSigned(false);
      this.setState(state => ({
            user_name: ""
    }))
  }

  render() {

  const isUserSigned = this.props.isUserSigned;
  return (
  <div>
  <nav className="navbar navbar-expand navbar-dark bg-dark text-center">
  <ul className="navbar-nav me-5 ms-5">
    <li className="nav-item">
        <Link to="/" className="btn btn-outline-success px-5 my-2 my-sm-0">
        Home
        </Link>
    </li>
  </ul>



  <form className="mx-1 my-auto d-inline w-35" onSubmit={this.handleSubmit}>
  <div className="input-group">
    <input className="form-control mr-sm-2" onFocus={this.handleFocus} type="text" placeholder="Look up a title, a place or any words in the note" aria-label="Search" onChange={this.handleChange} ></input>

    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search diary entries</button>
  </div>
  </form>


    { (isUserSigned && isUserSigned !== "unlogged") ? (
    <>


    <ul className="navbar-nav ms-auto  align-items-center justify-content-around">
    {this.state.user_name ? (
    <span className="navbar-text">Hello, {this.state.user_name}!</span>
    ) : (
    <span className="navbar-text">Hello, Anonymus!</span>
    )}
    </ul>


    <ul className="navbar-nav ms-auto me-5  align-items-center justify-content-around">
    <li className="nav-item">
      <Link to={"/profilesettings"} className="btn btn-outline-success mx-2 px-5 my-2 my-sm-0">
        Profile settings
      </Link>
    </li>

    <li className="nav-item">
        <GoogleLogout
        render={renderProps => (
          <button className="btn btn-outline-success mx-2 px-5 my-2 my-sm-0" onClick={renderProps.onClick} disabled={renderProps.disabled}>
          <span className="fa fa-google"></span> Sign out
          </button>)}
          onLogoutSuccess={this.logout}
        >
        </GoogleLogout>
    </li>

    </ul>
    </>
  ):(
    <ul className="navbar-nav ms-auto me-5">
    <li className="nav-item">
    <span className="text-success">You aren't signed in!</span>
    </li>

    </ul>
  )}
 </nav>
  </div>
  );
}
}

export default function NavbarWrapper(props) {
  const navigation = useNavigate();

  return <Navbar {...props} navigation={navigation} />;
}
