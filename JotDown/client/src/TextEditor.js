import React from 'react'
import "quill/dist/quill.snow.css"
import Quill from "quill"
import {useEffect, useCallback, useState} from "react"
import {io} from "socket.io-client"
import {useParams} from 'react-router-dom'
import JotterSidebar from './JotterSidebar'

// Setting up what we want on our toolbarOptions
var toolbarOptions = [
['bold', 'italic'],
['underline', 'strike'],       // toggled buttons
['blockquote', 'code-block'],
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
[{'direction': 'rtl'}],                         // text direction

[{ 'header': [2, 3, 4, 5, 6, false] },{ 'font': [] }],
[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
[{ 'align': [] },'clean']                                     // remove formatting button
];


const SAVE_INTERVAL_MS = 2000

export default function TextEditor()
{
  const {id: documentid} = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()


  useEffect(() =>
  {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  },[])

  // This useEffect is for when we type something into the box this use useEffect
  // listens for that and then sends that change to the server.
  useEffect(() => {
    //Making sure both our socket and quill are initialised before
    //we run this
    if (socket == null || quill == null) return

    //Setting up a listener that detects changes from the server
    const handler = function(delta, oldDelta, source) {
       if (source !== 'user') return

       socket.emit("send-changes", delta)
       }

    quill.on('text-change', handler)

    //Removing the function when we no longer need it.
    return() => {
      quill.off('text-change',handler)
    }

  } , [socket,quill])

  //This useEffect is for receiving changes from the server to update our own document.
  useEffect(() => {
    //Making sure both our socket and quill are initialised before
    //we run this
    if (socket == null || quill == null) return

    //handler function that receives a delta from the server then updates our
    //quill
    const handler = function(delta)
    {
       quill.updateContents(delta)
    }

    socket.on('receive-changes', handler)

    //Removing the function when we no longer need it.
    return() => {
      quill.off('receive-changes',handler)
    }

  },[socket,quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once('load-document', document => {
      quill.setContents(document)
      quill.enable()
    }, [socket, quill])

    socket.emit('get-document', documentid)
  }, [socket,quill,documentid])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit('save-document',quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket,quill])

  // wrapperRef is a callback here so it is set before the return
  // statement below is loaded
  const wrapperRef = useCallback(wrapper =>
  {
    if (wrapper == null) return
    wrapper.innerHTML = ''
    //creating div like this so that the quill toolbar is included
    //in the divider
    const editor = document.createElement('div');
    wrapper.append(editor);

    //Runs on render. Sets up our tool bar and puts the text box
    //in the container
    const q = new Quill(editor,{theme:"snow",modules:{toolbar:toolbarOptions}})
    q.disable()
    q.setText('Loading JotNote.......')
    setQuill(q)
  },[])
  return <div className="container" ref={wrapperRef}><JotterSidebar/></div>
}
