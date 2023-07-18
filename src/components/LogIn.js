import React from "react";
//import {GoogleLogin} from "react-google-login";
//import { gapi } from 'gapi-script';
import axios from "axios";

import { GoogleLogin } from '@react-oauth/google';
import * as Utils from '../Utils'

const API_AUTH_URL = process.env.REACT_APP_API_URL + '/api/v1/social_auth/callback';
const API_URL = process.env.REACT_APP_API_URL + '/api/v1/entries';


export default function Login(props) {

  const responseGoogle = (response) => {
    console.log(response, "Google response")
    fetchEntries();
    /*
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
      body: JSON.stringify({access_token: response.credential}),
      credentials: "include"
    }
    return axios
    .post(API_AUTH_URL,
      { access_token: response.credential})
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
 */
  }

  function fetchEntries() {
      return axios
      .post(API_URL,
        { entry: "koza"
        }, { headers: Utils.authHeaders() })
      .then(response => {
         console.log(response);
        },
        error => {
          console.log(error);
        return error;
        });
  }




    return (
      <>

      <div className="row d-flex justify-content-md-center">

      <div className="col-md-8 text-center">

            <GoogleLogin
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            />;

{/*
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
*/}

        </div>

      </div>
      </>
    );


}
