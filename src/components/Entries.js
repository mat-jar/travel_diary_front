import {displayCorners} from '../Utils'
import {useState, useEffect} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import runtimeEnv from '@mars/heroku-js-runtime-env'

import EntryDetails from "./EntryDetails";

const API_URL = runtimeEnv().REACT_APP_API_URL + '/api/v1/entries';

export default function Entries(props) {

  const [fetchedEntries, setFetchedEntries] = useState();
  const [selectedEntry, setSelectedEntry] = useState();

  function handleOnMouseHover(e, entry) {
    e.preventDefault();
    e.stopPropagation();
    if (selectedEntry !== entry) {
      setSelectedEntry(entry);
    }
  }

  function handleCancelSearch() {
    props.setSearchPhrase();
    fetchEntries();
  }

  function fetchEntries() {
    return axios
    .get(API_URL, { headers: Utils.authHeaders() })
    .then(response => {
      //console.log(response);
      //console.log(response.data);
      setFetchedEntries(response.data)
      setSelectedEntry(response.data[0])
      return response;
      },
      error => {
        console.log(error);
      return error;
      });
  }

  function fetchSearchedEntries(searchPhrase) {
    const params = { search: {search_phrase: searchPhrase}};
    return axios
    .post(API_URL + `/search`, params, { headers: Utils.authHeaders() })
    .then(response => {
      //console.log(response);
      //console.log(response.data);
      setFetchedEntries(response.data);
      setSelectedEntry(response.data[0])
      return response;
      },
      error => {
        console.log(error);
      return error;
      });

  }

  useEffect( () => {
  fetchEntries();
}, []);

useEffect( () => {
  if (props.searchPhrase) {
    fetchSearchedEntries(props.searchPhrase)
  }
}, [props.searchPhrase]);

  return(

  <div className="row">

  <div className={"col-md-3 bg-success p-4 " + displayCorners("left")}>
  <p className="display-9 text-center my-4">List of entries</p>
  {props.searchPhrase && (
    <>
    <p className="text-center">
    Search results for the phrase: "{props.searchPhrase}"
    <br />
    <button onClick={handleCancelSearch} className="btn btn-link link-dark">Cancel the search</button>
    </p>
    </>
  )}
    <ul className="list-group">

      {fetchedEntries && (
      <>

      {fetchedEntries.map((entry, index) => {
        return (
          <li className="list-group-item" onMouseOver={event => handleOnMouseHover(event, entry)} entry={entry} key={index}>
            <label className="itemDisplay d-flex justify-content-between w-100">
            <span>{entry.place} &nbsp; </span>
            <small className="text-muted">{Utils.formatDate(entry.created_at)}</small></label>
          </li>
        );
      })}
      </>
    )}
    {!props.searchPhrase && (
    <>
    <li className="list-group-item" onMouseOver={event => handleOnMouseHover(event, "new")} key="new">
      <label className="itemDisplay d-flex justify-content-center"><h3>+</h3></label>
    </li>
    </>
  )}
    </ul>
  </div>


  <div className={"col-md-9 bg-secondary p-4 " + displayCorners("right")}>
  {selectedEntry && (
      <EntryDetails isUserSigned={props.isUserSigned}
        setIsUserSigned={props.setIsUserSigned}
        selectedEntry={selectedEntry}
        fetchEntries={fetchEntries}
          />
    )}
  </div>

  </div>
);
}
