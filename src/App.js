import logo from './logo.svg';
import './App.css';
import React from "react";
import { GoogleAPI, GoogleLogin, GoogleLogout } from "react-google-oauth";
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { gapi } from 'gapi-script';


const CLIENT_ID = runtimeEnv().REACT_APP_GOOGLE_CLIENT_ID;
const API_AUTH_URL = runtimeEnv().REACT_APP_API_URL + '/api/v1/social_auth/callback';

function App() {

  return (
    <div className="App">
      <header className="App-header">
      <GoogleAPI className="GoogleLogin" clientId={CLIENT_ID}>
        <div>
          <GoogleLogin
            height="10"
            width="500px"
            backgroundColor="#4285f4"
            access="offline"
            scope="email profile"
            onLoginSuccess={responseGoogle}
            onFailure={responseGoogle}
            isSignedIn={true}
            buttonText="Sign in with Google"
          />
        </div>
      </GoogleAPI>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}



const responseGoogle = (response) => {
  console.log(response, "Google response")
  var token = response;
  var data = {
    provider: "google_oauth2",
    uid: token.Ca,
    id_token: response.xc.id_token,
    email: token.wt.NT
  }
  console.log(data, "reguest to Rails API")
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${response.xc.access_token}`,
      'Content-Type': 'application/json',
      'access_token': `${response.xc.access_token}`
    },
    body: JSON.stringify(data)
  }
  return fetch(API_AUTH_URL, requestOptions)
  .then(response => response.json())
  .then(response => {
    console.log(response,  "Rails API response");
})
  .catch(err=>console.log(err))
}

export default App;
