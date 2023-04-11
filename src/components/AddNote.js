import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext'
const AddNote = (props) => {
    const context=useContext(noteContext)
    const {addNote}=context;
    const [note,setNote]=useState({title:"",description:"",tag:""})
    const handleOnClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added successfully","success");
    }
    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }
  return (
    <div className="container my-3">
         <h2>Add your Notes</h2>
      <div className="container my-3">
      <form>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" onChange={onChange} value={note.title} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="description" name="description" onChange={onChange} value={note.description} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Tag</label>
    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange}/>
  </div>
  <button type="submit" disabled={note.title.length<5 || note.description.length<5} className="btn btn-primary" onClick={handleOnClick}>Add Note</button>
</form>
      </div>
    </div>
  )
}

export default AddNote
