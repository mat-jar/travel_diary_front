import {displayCorners} from '../Utils'
import {useState} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import runtimeEnv from '@mars/heroku-js-runtime-env'
const API_URL = runtimeEnv().REACT_APP_API_URL + '/api/v1';

export default function Home(props) {

  const [fetchedEntries, setFetchedEntries] = useState();
  const [selectedEntry, setSelectedEntry] = useState();

  function generateToken(e) {
    e.preventDefault();
    return axios
    .post(API_URL + "/teacher_tokens", {}, { headers: Utils.authHeaders() })
    .then(response => {
      console.log(response);
      return response;
      },
      error => {
        console.log(error);
      return error;
      });
  }


  return(

  <div className="row">

  <div className={"col-md-3 bg-success p-4 " + displayCorners("left")}>
  <p className="display-9 text-center my-4">List of entries</p>
  </div>

  <div className={"col-md-9 bg-secondary p-4 " + displayCorners("right")}>
  <p className="display-9 text-center my-4">Entry details</p>
  </div>

  </div>
);
}
