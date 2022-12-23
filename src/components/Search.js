import React, {useState, useEffect} from "react";
import {displayCorners} from '../Utils'

export default function Search(props) {
  const searchPhrase = props.searchPhrase;


  return(


  <div className="row">
  <div className={"col-md-6 bg-primary p-4 " + displayCorners("left")}>
  <p className="display-9 text-center my-4"> Search results for phrase "{searchPhrase}":</p>

  </div>
  <div className={"col-md-6 bg-secondary p-4 " + displayCorners("right")}>

</div>
</div>
  );
}
