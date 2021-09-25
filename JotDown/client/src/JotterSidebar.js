import React from 'react';
import {io} from "socket.io-client";
import {useState, useEffect} from "react";
import JotterSidebarItem from './JotterSidebarItem';

export default function JotterSideBar(){
//Things we need to do for the sidebar.

  //Connect to socket.io
  const [socket, setSocket] = useState();
  const [jotters, setJotters] = useState([]);

  //This is a function that adds a document to the list
  const addJotter = jotter => {
    const newJotters = [jotter, ...jotters];

    setJotters(newJotters);
    console.log('added jotter: ' + jotter[0])
  };


  useEffect(() =>
  {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  },[])
  //Access all the current existing document ids

  useEffect(() => {
    console.log('useEffect called')
    if (socket == null) return

    socket.on('get-sidebar', jotters => {
      console.log('received info:\n' + jotters[0] )
      for (let i = 0; i < jotters.length; i++){
        //Todo make sure a file isn't displayed twice
        addJotter(jotters[i])

      }
    });

  },[socket])

  //Display them as widgets on the side

  return (
    <div className="sidebar_container">
      <div className="menu_box">
        <h2>Menu</h2>
      </div>
      <JotterSidebarItem jotters={jotters}/>
    </div>);
}
