import {useState, useEffect} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import DeleteConfirmation from "./DeleteConfirmation";
import EditConfirmation from "./EditConfirmation";

const API_URL = process.env.REACT_APP_API_URL + '/api/v1/entries';

export default function EntryDetails(props) {

  const [isEditEntry, setIsEditEntry] = useState(false);

  const [entryTitle, setEntryTitle] = useState("");
  const [entryPlace, setEntryPlace] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [entryWeather, setEntryWeather] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isPlaceValid, setIsPlaceValid] = useState(false);
  const [isNoteValid, setIsNoteValid] = useState(false);
  const [isWeatherValid, setIsWeatherValid] = useState(false);
  const [formErrors, setFormErrors] = useState({entry_title: '', entry_place: '', entry_note: '', entry_weather: ''});

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);

  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const handleCloseEditConfirmation = () => setShowEditConfirmation(false);
  const handleShowEditConfirmation = () => setShowEditConfirmation(true);

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
      case 'weather':
        setEntryWeather(value);
        break;
      default:
        break;
    }
    //validateForm(name, value);
  }

  useEffect( () => {
  if (entryTitle !== selectedEntry.title) {
    validateAllFields();
  } else if (entryPlace !== selectedEntry.place) {
    validateAllFields();
  } else if (entryNote !== selectedEntry.note) {
    validateAllFields();
  } else if (entryWeather !== selectedEntry.weather) {
    validateAllFields();
  } else {
    setIsFormValid(false);
  }
}, [entryTitle, entryPlace, entryNote, entryWeather]);

  function validateAllFields() {
    let fieldValidationErrors = formErrors;
    let titleValid = isTitleValid;
    let placeValid = isPlaceValid;
    let noteValid = isNoteValid;
    let weatherValid = isWeatherValid;

    titleValid = entryTitle.length >= 1;
    fieldValidationErrors.title = titleValid ? '' : " can't be blank";

    placeValid = (/^[A-Za-z\s]*$/i).test(entryPlace);
    fieldValidationErrors.place = placeValid ? '': ' can only have letters';

    noteValid = entryNote.length >= 1;
    fieldValidationErrors.note = noteValid ? '': " can't be blank";

    weatherValid = entryWeather.length >= 1;
    fieldValidationErrors.weather = weatherValid ? '': " can't be blank";

    setIsTitleValid(titleValid);
    setIsPlaceValid(placeValid);
    setIsNoteValid(noteValid);
    setIsWeatherValid(weatherValid);
    setFormErrors(fieldValidationErrors);
    if (isEditEntry) {
      setIsFormValid(titleValid && placeValid && noteValid && weatherValid);
    } else {
      setIsFormValid(titleValid && placeValid && noteValid);
    }

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
      handleCloseDeleteConfirmation();
      props.fetchEntries();
      props.setSelectedEntryIndex(0);
      return response;
      },
      error => {
        console.log(error);
      return error;
      });
  }

  function handleEdit(e, entry_slug){
    e.preventDefault();
    const params = { entry:
      {
        title: entryTitle,
        place: entryPlace,
        note: entryNote
      }
    }

    return axios
    .put(API_URL + `/${entry_slug}`, params, { headers: Utils.authHeaders() })
    .then(response => {

      handleCloseEditConfirmation();
      setEntryTitle("");
      setEntryPlace("");
      setEntryNote("");
      setIsFormValid(false);
      setIsTitleValid(false);
      setIsPlaceValid(false);
      setIsNoteValid(false);
      setFormErrors({entry_title: '', entry_place: '', entry_note: ''});
      props.fetchEntries();
      //props.setSelectedEntry(response.data)
      setIsEditEntry(false);
      return response;
      },
      error => {
        console.log(error);
      return error;
      });
  }

  function handleShowEditForm(e) {
    e.preventDefault();
    setIsEditEntry(true);
    setEntryTitle(selectedEntry.title);
    setEntryPlace(selectedEntry.place);
    setEntryNote(selectedEntry.note);
    setEntryWeather(selectedEntry.weather);
  }

  function handleCancelEdit(e) {
    e.preventDefault();
    setIsEditEntry(false);
  }



  return(
  <>
  <DeleteConfirmation
    showDeleteConfirmation={showDeleteConfirmation}
    handleCloseDeleteConfirmation = {handleCloseDeleteConfirmation}
    handleDelete = {handleDelete}
    selectedEntrySlug = {selectedEntry.slug}
  />
  <EditConfirmation
    showEditConfirmation={showEditConfirmation}
    handleCloseEditConfirmation = {handleCloseEditConfirmation}
    handleEdit = {handleEdit}
    selectedEntrySlug = {selectedEntry.slug}
  />
  {(selectedEntry && selectedEntry !== "new" && !isEditEntry) && (
  <div className="row">
  <p className="display-8 text-center my-4">
  <b className="h4">{selectedEntry.title}</b> in {selectedEntry.place} </p>
  <p className="display-8 my-4">Date: {entryDate}</p>
  <p className="display-8 my-4">Weather: {selectedEntry.weather}</p>
  <p className="display-8 my-4">{selectedEntry.note}</p>
  <div className="d-flex w-100 justify-content-around">
  <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
          onClick={handleShowEditForm}>Edit entry</button>
  <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
          onClick={handleShowDeleteConfirmation} >Delete entry</button>
  </div>
  </div>
  )}
  {(selectedEntry === "new" && !isEditEntry) && (
  <div className="row">
  <p className="display-8 text-center my-4">Add new entry</p>
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

  {(selectedEntry && isEditEntry) && (
  <div className="row">
  <p className="display-8 text-center my-4">Edit entry</p>
  <form className="newEntryForm">
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

    <div className="form-group">
    <label htmlFor="weather">Weather</label>
    <input type="weather" className="form-control" name="weather"
          placeholder="Weather" value={entryWeather}
           onChange={handleUserInput} required />
    </div>

    <button type="submit" className="btn btn-primary" disabled={!isFormValid}>Save new entry</button>

    </form>

    <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
            onClick={handleCancelEdit}>Cancel edit</button>
    <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
            onClick={handleShowEditConfirmation}
            disabled={!isFormValid} >Edit entry</button>

  </div>
  )}
  </>


);
}
