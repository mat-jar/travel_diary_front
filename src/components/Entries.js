import {displayCorners} from '../Utils'
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import EntryDetails from "./EntryDetails";
import NewEntry from "./NewEntry";

const API_URL = process.env.REACT_APP_API_URL + '/api/v1/entries';

export default function Entries(props) {

  const [fetchedEntries, setFetchedEntries] = useState();
  const [selectedEntry, setSelectedEntry] = useState("");
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const prevSelectedEntryIndex = useRef();

  function handleOnMouseEnter(e, entry_index) {
    if (selectedEntryIndex !== entry_index) {
      setSelectedEntryIndex(entry_index);
    }
  }

  function handleOnMouseLeave(e) {
    if (fetchedEntries.length > 0) {
      let last_entry_index = fetchedEntries.length-1
      setSelectedEntryIndex(last_entry_index);
    } else {
      setSelectedEntryIndex(0);
    }
  }

  function handleCancelSearch() {
    props.setSearchPhrase();
    fetchEntries();
  }

  function handleShowAddNewEntry() {
    setIsNewEntry(true);
  }

  function fetchEntries() {
    return axios
    .get(API_URL, { headers: Utils.authHeaders() })
    .then(response => {
      //console.log(response);
      //console.log(response.data);
      setFetchedEntries(response.data)
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
      setSelectedEntryIndex(0);
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

  useEffect( () => {
  if (selectedEntryIndex === "new") {
    setSelectedEntry("new");
  } else if (fetchedEntries) {
    setSelectedEntry(fetchedEntries[selectedEntryIndex]);
  }
  }, [selectedEntryIndex]);



  return(

  <div className="row">

  <div className={"col-md-3 bg-success p-4 " + displayCorners("left")}>
  <p className="display-8 text-center my-4">List of entries</p>
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
          <li className="list-group-item" onMouseEnter={event => handleOnMouseEnter(event, index)} entry={entry} key={index}>
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
    <li className="list-group-item" onMouseEnter={event => handleOnMouseEnter(event, "new")}
    onMouseLeave ={handleOnMouseLeave} onClick={handleShowAddNewEntry} key="new">
      <label className="itemDisplay d-flex justify-content-center add-new-entry-button"><h3>+</h3></label>
    </li>
    </>
  )}
    </ul>
  </div>


  <div className={"col-md-9 bg-secondary p-4 position-relative " + displayCorners("right")}>
  {(selectedEntry && !isNewEntry) && (
      <EntryDetails isUserSigned={props.isUserSigned}
        setIsUserSigned={props.setIsUserSigned}
        selectedEntry={selectedEntry}
        fetchEntries={fetchEntries}
        setSelectedEntryIndex={setSelectedEntryIndex}
        setIsNewEntry={setIsNewEntry}
        isNewEntry={isNewEntry}
          />
    )}

    {isNewEntry && (
        <NewEntry isUserSigned={props.isUserSigned}
          setIsUserSigned={props.setIsUserSigned}
          fetchEntries={fetchEntries}
          setSelectedEntryIndex={setSelectedEntryIndex}
          setIsNewEntry={setIsNewEntry}
          isNewEntry={isNewEntry}
            />
      )}
  </div>

  </div>
);
}
