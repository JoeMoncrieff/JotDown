import React from 'react';
import {io} from "socket.io-client";
import { useState, useEffect, useReducer } from "react";

//Router imports
import {
  BrowserRouter as Router,
  Link 
} from "react-router-dom"

export default function JotterSideBar(props){
//Things we need to do for the sidebar.

  //Connect to socket.io
  const [socket, setSocket] = useState();
  const [jotters, setJotters] = useState([]);


  useEffect(() =>
  {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  },[])
  //Access all the current existing document ids

  //This is a function that adds a document to the list
  

  // This force update is needed for some reason.
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  function fupdate() {
    forceUpdate();
  }


  useEffect(() => {
    const addJotter = jotter => {
      const newJotters = jotters;
      const endNo = newJotters.push(jotter)

      //console.log('newJotters: ' + newJotters)

      setJotters(newJotters);
      //console.log('added jotter: ' + jotters[endNo - 1])
      fupdate()
    };
    //console.log('useEffect called')
      if (socket == null) return

    socket.on('get-sidebar', nJotters => {
      //console.log('received info:\n' )
      for (let i = 0; i < nJotters.length; i++){
          //Todo make sure a file isn't displayed twice
          //console.log('calling addJotter on: ' + nJotters[i][0]);
          addJotter(nJotters[i][0])
      }
    });
  }, [socket, jotters])

  //Display them as widgets on the side


  return (
    <Router>
      <div className="sidebar-container">
        <div className="menu-box">
          <h2>Menu</h2>
        </div>
        <ul className="jotter-list-nav">
          {jotters.map((j, i) => (
            <li key={i} className={"/documents/" + j === window.location.pathname ? "Selected" : "Unselected"}>
              <Link to={`/documents/${j}`}>
                <button className="jotter-sidebar-button" onClick={() => window.location.assign("http://localhost:3000/documents/" + j)}>
                  {j}
                </button>
            </Link>
            </li>
          ))}
        </ul>
      </div>
    </Router>
  );
}
