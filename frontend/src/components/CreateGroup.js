import React from 'react'
import PostMediaPopup from "./PostMediaPopup"
import FormInput from "./FormInput"
import axios from 'axios'
import { useNavigate, useParams } from "react-router"

export default function CreateGroup(props) {

  let navigate = useNavigate()

  const [mediaPopup, setMediaPopup] = React.useState(true)
  const [type, setType] = React.useState('')

  const [headerImage, setHeaderImage] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const [headerImageURL, setHeaderImageURL] = React.useState('')
  const [imageURL, setImageURL] = React.useState('')

  const [formSubmitted, setFormSubmitted] = React.useState(false)

  const [values, setValues] = React.useState({
    name: '',
    description: '',
  })

  React.useEffect(() => {
    document.title = "MediaReviewr | Create Group"
  }, [])

  React.useEffect(() => {
    if (image === null) return
    if (image === '') return
    if (image === undefined) return
    var binaryData = [];
    binaryData.push(image);
    const url = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
    setImageURL(url)
  }, [image])

  React.useEffect(() => {
    if (headerImage === null) return
    if (headerImage === '') return
    if (headerImage === undefined) return
    var binaryData = [];
    binaryData.push(headerImage);
    const url = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
    setHeaderImageURL(url)
  }, [headerImage])

  function mediaOnClick(type) {
      setType(type)
      setMediaPopup(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormSubmitted(true)

    if (image !== null && headerImage !== null) {
      axios.defaults.withCredentials = true;
      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
      axios.defaults.xsrfCookieName = 'csrftoken';
  
      const URL = window.location.origin + '/api/group-create/'
      const config = {headers: {'Content-Type': 'multipart/form-data'}}
  
      let formField = new FormData()
  
      
      formField.append('image', image)
  
      formField.append('header_image', headerImage)
  
      formField.append('name', values.name)
      formField.append('description', values.description)
      formField.append('type', type)
  
      axios.post(URL, formField, config)
      .then((res) => {
        navigate('/groups/')
      })
      .catch((err) => {
        setFormSubmitted(false)
        alert("A group with this name already exists, or another error occurred.")
        console.log(err)
      })
    } else {
      alert("Both a header and a group image are required.")
      setFormSubmitted(false)
    }
    
  }

  function imageOnChange(e) {
    setImage(e.target.files[0])
  }

  function headerImageOnChange(e) {
    setHeaderImage(e.target.files[0])
  }

  const onChange = (e) => {
    if (e.target.name === 'description') {
      if (e.target.value.length < 3000) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'name') {
      if (e.target.value.length < 150) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    }
  };

  return (
      <div className="group-form-container">
        <PostMediaPopup trigger={mediaPopup} mediaOnClick={mediaOnClick} group={true}/>
        <form onSubmit={handleSubmit} className="create-group-form">
          <label className="group-header-image-upload">
              <input className="group-create-header-image" name="header-image" key="file-upload" type="file" accept="image/*" onChange={headerImageOnChange} />
              {headerImageURL !== '' && 
                <img src={headerImageURL} className="group-create-uploaded-header"></img>
              }
          </label>
          <label className="group-image-upload">
            <input className="group-create-image" name="image" key="file-upload" type="file" accept="image/*" onChange={imageOnChange} />
            {imageURL !== '' && 
              <img src={imageURL} className="group-create-uploaded-image"></img>
            }
            
          </label>
          <div className="group-form-content">
            <div className="group-create-col-1">

              <label className="group-input-label">Name*</label>
                
              <input
                type="text"
                placeholder="Your group name here..."
                name="name"
                onChange={onChange}
                className="input input-name"
                value={values.name}
                required
              />
              <label className="group-input-label">Description*</label>
              <textarea
                type="text"
                name="description"
                onChange={onChange}
                value={values.description}
                placeholder="A group for sharing posts about..."
                className="input input-description"
                required
              />
                
                
            </div>

          </div>
          <div className="group-form-buttons">
            <button type="button" className="form-cancel-btn" onClick={() => navigate("/groups/")}>Cancel</button>
            {!formSubmitted && 
                <button type="submit" className="form-submit-button">Confirm</button>
            }
            {formSubmitted && 
                <button type="submit" className="form-submit-button">
                  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </button>
            }
          </div>
        </form>
      </div>
  )
}