import {useState, useEffect} from "react"
import LogIn from "./LogIn";
import Entries from "./Entries";
import {displayCorners} from '../Utils'

export default function Home(props) {
  const [isUserSigned, setIsUserSigned] = useState(props.isUserSigned);

  useEffect(() => {
    setIsUserSigned(props.isUserSigned)
  }, [props.isUserSigned]);



  return(

  <div className="row">
  {(isUserSigned && isUserSigned !== "unlogged") ? (
  <Entries/>

  ) : (
  <>
  <div className={"col-md-3 bg-success p-4 " + displayCorners("left")}>
  <p className="display-9 text-center my-4">Keep fresh memories from your travels!</p>
  <p className="display-9 text-center my-4">Share them with friends or the community :)</p>
  </div>

  <div className={"col-md-9 bg-secondary p-4 " + displayCorners("right")}>
  <p className="display-9 text-center my-4">Sign in and start creating your diary</p>
  <LogIn isUserSigned={props.isUserSigned}
        setIsUserSigned={props.setIsUserSigned}
          />
  </div>
  </>
)}
</div>
);
}
