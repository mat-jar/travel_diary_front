
import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap-social/bootstrap-social.css";
import 'react-toastify/dist/ReactToastify.css';
import "./custom.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobeEurope, faGlobeAmericas, faGlobeOceania, faGlobeAsia,faGlobeAfrica } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import * as Utils from './Utils'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Search from "./components/Search";
import ProfileSettings from "./components/ProfileSettings";


export default function App() {

  const [isUserSigned, setIsUserSigned] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState();


  function showToast(message) {
    toast.success(message);
  }

  const NoMatch = () => {
  return (<p>There's nothing here: 404!</p>);
  };


  return (
    <div className="App">
    <Router>
      <header className="App-header">
      <Navbar
      isUserSigned={isUserSigned}
      setSearchPhrase={setSearchPhrase}
      showToast={showToast}
      setIsUserSigned={setIsUserSigned}
       />
      </header>

      <div className="container">

        <div className="topHeading">
          <h1 className="text-center my-4 title-text">Your ultimate travel diary &nbsp;
          <FontAwesomeIcon icon={faGlobeEurope} />
          <FontAwesomeIcon icon={faGlobeAmericas} />
          <FontAwesomeIcon icon={faGlobeOceania} />
          <FontAwesomeIcon icon={faGlobeAsia} />
          <FontAwesomeIcon icon={faGlobeAfrica} />

</h1>

          <div className="pageContent">
          <Routes>
            <Route index element={<Home
                                  isUserSigned={isUserSigned}
                                  setIsUserSigned={setIsUserSigned}
                                  />} />
            <Route exact path="/search" element={<Search
                          searchPhrase={searchPhrase}/>} />

            <Route path="*" element={<NoMatch />} />
            <Route exact path="/profilesettings" element={<ProfileSettings
                         isUserSigned={isUserSigned}
                         />} />
          </Routes>
          </div>
        </div>

      </div>

    <div>
    <Footer/>
    </div>
    <ToastContainer pauseOnHover={false} autoClose={2000}/>
    </Router>
    </div>
  );
}
