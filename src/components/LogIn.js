import React from "react";
import {GoogleLogin} from "react-google-login";
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { gapi } from 'gapi-script';

const CLIENT_ID = runtimeEnv().REACT_APP_GOOGLE_CLIENT_ID;
const API_AUTH_URL = runtimeEnv().REACT_APP_API_URL + '/api/v1/social_auth/callback';


export default function Login(props) {

  const responseGoogle = (response) => {
    //console.log(response, "Google response")
    localStorage.setItem("user_name", response.wt.rV);
    var data = {
      provider: "google_oauth2",
      uid: response.Ca,
      id_token: response.xc.id_token,
      email: response.wt.NT,
      name: response.wt.rV
    }
    //console.log(data, "reguest to Rails API")
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
      //console.log(response,  "Rails API response");
      //console.log(response.headers["access-token"],  "Rails API response.access-token");
      if (response.headers) {
        localStorage.setItem("access-token", response.headers["access-token"]);
        localStorage.setItem("uid", response.headers.uid);
        localStorage.setItem("client", response.headers.client);
        props.setIsUserSigned(true);
      }
  })
    .catch(err=>console.log(err))
  }


    return (
      <>

      <div className="row d-flex justify-content-md-center">

      <div className="col-md-8 text-center">
            <GoogleLogin
            clientId={CLIENT_ID}
            render={renderProps => (
              <button className="btn btn-block btn-social btn-lg btn-google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
              <span className="fa fa-google"></span> Sign in with Google
              </button>)}
              access="offline"
              scope="email profile"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              isSignedIn={true}
            />

        </div>

      </div>
      </>
    );


}
