import {useState, useEffect} from "react";
import axios from "axios";
import * as Utils from '../Utils'
import {displayCorners} from '../Utils'
import EntryNoteEditor from "./EntryNoteEditor";




const API_URL = process.env.REACT_APP_API_URL + '/api/v1/entries';


export default function NewEntry(props) {

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


  const setIsNewEntry = props.setIsNewEntry;
  const isNewEntry = props.isNewEntry;



  useEffect( () => {
      validateAllFields();
  }, [entryTitle, entryPlace, entryNote, entryWeather]);


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

  function validateAllFields() {
    let fieldValidationErrors = formErrors;
    let titleValid = isTitleValid;
    let placeValid = isPlaceValid;
    let noteValid = isNoteValid;
    let weatherValid = isWeatherValid;

    titleValid = entryTitle.length >= 1;
    fieldValidationErrors.title = titleValid ? '' : " can't be blank";

    placeValid = (/^[A-Za-z\s]*$/i).test(entryPlace) && entryPlace.length >= 1;
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
        setIsNewEntry(false);
        return response;
        },
        error => {
          console.log(error);
        return error;
        });
    }
  }


  function handleCancelAddNewEntry(e) {
    e.preventDefault();
    setIsNewEntry(false);
  }


  return(
  <>

  {(isNewEntry && !isEditEntry) && (
  <>
  <div className="row">
  <p className="display-8 text-center my-4">Add new entry</p>
  <form className="newEntryForm my-4" >
    <div className="form-group form-input-group">
    <label className="form-input-label" htmlFor="title">Title</label>
    <input type="title" className="form-control" name="title"
          value={entryTitle}
           onChange={handleUserInput} required />
    </div>
    <div className="form-group form-input-group">
    <label className="form-input-label" htmlFor="place">Place</label>
    <input type="place" className="form-control" name="place"
          value={entryPlace}
           onChange={handleUserInput} required />
    </div>
    <div className="form-group form-input-group">
    <label className="form-input-label" htmlFor="note">Note</label>
    <input type="note" className="form-control" name="note"
          value={entryNote}
           onChange={handleUserInput} required />


    </div>

    <div>
    <EntryNoteEditor/>
    </div>




     </form>

     <div className="d-flex w-100 justify-content-around">
     <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
             onClick={handleCancelAddNewEntry}>Cancel adding new entry</button>
     <button className="btn btn-success entry-details-button px-5 my-2 my-sm-0"
             onClick={handleSubmit}
             disabled={!isFormValid} >Save new entry</button>
     </div>



  </div>
  </>
  )}


  </>


);
}
