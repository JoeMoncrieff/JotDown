import React, {useState} from 'react'

export default function JotterSidebarItem({jotters})
{
  const [edit, setEdit] = useState({
    id: null,
    value: ''

  })

  return jotters.map((jotter, index) => (
  <div className='jotter_box' key={index}>
    <div key={index}>
      <h3>{jotter[0]}</h3>
    </div>
  </div>
  ))
}
