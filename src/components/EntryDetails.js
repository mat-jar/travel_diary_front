import {useState} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import runtimeEnv from '@mars/heroku-js-runtime-env'
import DeleteConfirmation from "./DeleteConfirmation";

const API_URL = runtimeEnv().REACT_APP_API_URL + '/api/v1/entries';

export default function EntryDetails(props) {

  const [entryTitle, setEntryTitle] = useState("");
  const [entryPlace, setEntryPlace] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isPlaceValid, setIsPlaceValid] = useState(false);
  const [isNoteValid, setIsNoteValid] = useState(false);
  const [formErrors, setFormErrors] = useState({entry_title: '', entry_place: '', entry_note: ''});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  const selectedEntry = props.selectedEntry;
  const entryDate = Utils.formatDate(selectedEntry.created_at)

  function handleUserInput(e){
    const {name, value} = e.target;
    switch(name) {
      case 'title':
        setEntryTitle(value);
        break;
      case 'place':
        setEntryPlace(value);
        break;
      case 'note':
        setEntryNote(value);
        break;
      default:
        break;
    }
    validateForm(name, value);
  }

  function validateForm(fieldName, value) {
    let fieldValidationErrors = formErrors;
    let titleValid = isTitleValid;
    let placeValid = isPlaceValid;
    let noteValid = isNoteValid;

    switch(fieldName) {
      case 'title':
        titleValid = value.length >= 1;
        fieldValidationErrors.title = titleValid ? '' : " can't be blank";
        break;
      case 'place':
        placeValid = (/^[A-Za-z\s]*$/i).test(value);
        fieldValidationErrors.place = placeValid ? '': ' can only have letters';
        break;
      case 'note':
        noteValid = value.length >= 1;
        fieldValidationErrors.note = noteValid ? '': " can't be blank";
        break;
      default:
        break;
    }

    setIsTitleValid(titleValid);
    setIsPlaceValid(placeValid);
    setIsNoteValid(noteValid);
    setFormErrors(fieldValidationErrors);
    setIsFormValid(titleValid && placeValid && noteValid);

  }

  function handleSubmit(e){
    e.preventDefault();
    if (isFormValid) {
      return axios
      .post(API_URL,
        { entry:
          {
            title: entryTitle,
            place: entryPlace,
            note: entryNote
          }
        }, { headers: Utils.authHeaders() })
      .then(response => {
        setEntryTitle("");
        setEntryPlace("");
        setEntryNote("");
        setIsFormValid(false);
        setIsTitleValid(false);
        setIsPlaceValid(false);
        setIsNoteValid(false);
        setFormErrors({entry_title: '', entry_place: '', entry_note: ''});
        props.fetchEntries();
        return response;
        },
        error => {
          console.log(error);
        return error;
        });
    }
  }

  function handleDelete(e, entry_slug){
    e.preventDefault();
    return axios
    .delete(API_URL + `/${entry_slug}`, { headers: Utils.authHeaders() })
    .then(response => {
      handleCloseConfirmation();
      props.fetchEntries();
      return response;
      },
      error => {
        console.log(error);
      return error;
      });
  }



  return(
  <>
  <DeleteConfirmation
    showConfirmation={showConfirmation}
    handleCloseConfirmation = {handleCloseConfirmation}
    handleDelete = {handleDelete}
    selectedEntrySlug = {selectedEntry.slug}
  />
  {(selectedEntry && selectedEntry !== "new") && (
  <div className="row">
  <p className="display-9 text-center my-4">
  <b className="h4">{selectedEntry.title}</b> in {selectedEntry.place} </p>
  <p className="display-9 my-4">Date: {entryDate}</p>
  <p className="display-9 my-4">Weather: {selectedEntry.weather}</p>
  <p className="display-9 my-4">{selectedEntry.note}</p>
  <div className="d-flex w-100 justify-content-around">
  <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0">Edit entry</button>
  <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
          onClick={handleShowConfirmation} >Delete entry</button>
  </div>
  </div>
  )}
  {selectedEntry === "new" && (
  <div className="row">
  <p className="display-9 text-center my-4">Add new entry</p>
  <form className="newEntryForm" onSubmit={handleSubmit}>
    <div className="form-group">
    <label htmlFor="title">Title</label>
    <input type="title" className="form-control" name="title"
          placeholder="Title" value={entryTitle}
           onChange={handleUserInput} required />
    </div>
    <div className="form-group">
    <label htmlFor="place">Place</label>
    <input type="place" className="form-control" name="place"
          placeholder="Place" value={entryPlace}
           onChange={handleUserInput} required />
    </div>
    <div className="form-group">
    <label htmlFor="note">Note</label>
    <input type="note" className="form-control" name="note"
          placeholder="Note" value={entryNote}
           onChange={handleUserInput} required />
    </div>

    <button type="submit" className="btn btn-primary" disabled={!isFormValid}>Save new entry</button>
     </form>
  </div>
  )}
  </>


);
}
