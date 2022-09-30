import React, { useState } from "react";
import FormInput from "./FormInput";
import jQuery from 'jquery';  // important dependency
import { useNavigate, useParams } from "react-router"
import axios from 'axios'
import PostMediaPopup from "./PostMediaPopup"
import PostGroupPopup from "./PostGroupPopup"
import PostImagePopup from "./PostImagePopup"
import PostStreamingPopup from "./PostStreamingPopup"

export default function PostCreatePage() {

  const { postType } = useParams()
  let navigate = useNavigate();

  const [values, setValues] = useState({
    title: "",
    media: "",
    season: "",
    episode: "",
    rating: 50,
    body: "",
    post_type: postType,
  });
  const [mediaPopup, setMediaPopup] = React.useState(true)

  const [streaming1, setStreaming1] = React.useState('')
  const [streaming2, setStreaming2] = React.useState('')
  const [streaming3, setStreaming3] = React.useState('')
  const [streaming4, setStreaming4] = React.useState('')
  const [streaming5, setStreaming5] = React.useState('')

  const [type, setType] = useState("")
  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState('')

  const [placeholderReviewMedia, setPlaceholderReviewMedia] = React.useState("")
  const [placeholderReviewTitle, setPlaceholderReviewTitle] = React.useState("")
  const [placeholderCharacterTitle, setPlaceholderCharacterTitle] = React.useState("")

  const [postImagePopup, setPostImagePopup] = React.useState(true)

  const [postStreamingPopup, setPostStreamingPopup] = React.useState(false)

  const [postGroupPopup, setPostGroupPopup] = React.useState(false)
  const [group1, setGroup1] = React.useState('')
  const [group1Value, setGroup1Value] = React.useState(0)
  const [group2, setGroup2] = React.useState('')
  const [group2Value, setGroup2Value] = React.useState(0)
  const [group3, setGroup3] = React.useState('')
  const [group3Value, setGroup3Value] = React.useState(0)
  const [currentGroup, setCurrentGroup] = React.useState('')
  const [ratingStars, setRatingStars] = React.useState([])

  const [starClicks, setStarClicks] = React.useState([])
  const [editingStars, setEditingStars] = React.useState(false)
  const [currentRating, setCurrentRating] = React.useState(50)

  const [submitButtonClicked, setSubmitButtonClicked] = React.useState(false)

  const [buttonClass, setButtonClass] = React.useState('')

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    window.setTimeout(loadingFalse, 1);
  }, [])

  function loadingFalse() {
      setLoading(false);
  }

  React.useEffect(() => {
    document.title = "MediaReviewr | Create Post"
  }, [])

  React.useEffect(() => {
    if (type == "Movie") {
      setPlaceholderReviewMedia("Inception")
      setPlaceholderReviewTitle("Why you should watch...")
      setPlaceholderCharacterTitle("Cobb")
    }
    if (type == "Anime") {
      setPlaceholderReviewMedia("Demon Slayer")
      setPlaceholderReviewTitle("Why you should watch...")
      setPlaceholderCharacterTitle("Zenitsu Agatsuma")
    }
    if (type == "Series") {
      setPlaceholderReviewMedia("Game of Thrones")
      setPlaceholderReviewTitle("Why you should watch...")
      setPlaceholderCharacterTitle("Tyrion Lannister")
    }
    if (type == "Game") {
      setPlaceholderReviewMedia("Elden Ring")
      setPlaceholderReviewTitle("Why you should play...")
      setPlaceholderCharacterTitle("Malenia, Blade of Miquella")
    }
    if (type == "Literature") {
      setPlaceholderReviewMedia("A Song of Ice and Fire")
      setPlaceholderReviewTitle("Why you should read...")
      setPlaceholderCharacterTitle("Tyrion Lannister")
    }
  })

  React.useEffect(() => {
    let currentClicks = []
    for (let i = 0; i < 21; i+=1) {
      currentClicks.push(i*5)
    }
    setStarClicks(currentClicks)
  }, [])

  React.useEffect(() => {
    if (streaming1 || streaming2 || streaming3 || streaming4 || streaming5) {
      setButtonClass('streaming-button-color')
    } else {
      setButtonClass('')
    }
  }, [streaming1, streaming2, streaming3, streaming4, streaming5])

  React.useEffect(() => {
    if (image == null) return
    if (image == '') return
    if (image == undefined) return
    var binaryData = [];
    binaryData.push(image);

    var url = ""
    console.log(image)
    if (image.name.slice(-3) == 'MP4') {
      url = URL.createObjectURL(new Blob(binaryData, {type: "video\/mp4"}))
    } else if (image.name.slice(-3) == 'mp4') {
      url = URL.createObjectURL(new Blob(binaryData, {type: "video\/mp4"}))
    } else {
      url = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
    }
    setImageURL(url)
  }, [image])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitButtonClicked(true)

    axios.defaults.withCredentials = true;
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.xsrfCookieName = 'csrftoken';

    const URL = window.location.origin + '/api/post-create/'
    const config = {headers: {'Content-Type': 'multipart/form-data'}}

    let formField = new FormData()

    formField.append('title', values.title)
    formField.append('media', values.media)
    formField.append('type', type)
    if (values.post_type !== 'post') {
      formField.append('rating', values.rating)
    }
    formField.append('body', values.body)
    if (image != null) {
      formField.append('image', image)
    }
    formField.append('post_type', values.post_type)
    formField.append('group1', group1Value)
    formField.append('group2', group2Value)
    formField.append('group3', group3Value)
    
    formField.append('streaming1', streaming1)
    formField.append('streaming2', streaming2)
    formField.append('streaming3', streaming3)
    formField.append('streaming4', streaming4)
    formField.append('streaming5', streaming5)

    axios.post(URL, formField, config)
    .then((res) => {
      navigate('/')
    })
    .catch((err) => {
      setSubmitButtonClicked(false)
      alert("An error occurred. Please copy your body and refresh the page.")
      console.log(err)
    })

  };

  function mediaOnClick(type) {
    setType(type)
    setMediaPopup(false)

  }

  function imageOnChange(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const onChange = (e) => {
    if (e.target.name === 'title') {
      if (e.target.value.length < 100) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'media') {
      if (e.target.value.length < 100) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'rating') {
      let len = e.target.value.toString().length
      console.log(e.target.value)
      if (e.target.value >= 0 && e.target.value <= 100 && e.target.value.toString().length <= 3) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }

    } else if (e.target.name === 'body') {
      if (e.target.value.length < 20000) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    }
  };

  return (
    <div className="post-form-container">
      <PostMediaPopup trigger={mediaPopup} mediaOnClick={mediaOnClick} group={false} />
      <PostGroupPopup trigger={postGroupPopup} setTrigger={setPostGroupPopup} setGroup1={setGroup1} setGroup1Value={setGroup1Value}
      setGroup2={setGroup2} setGroup2Value={setGroup2Value} 
      setGroup3={setGroup3} setGroup3Value={setGroup3Value} currentGroup={currentGroup} />
      <PostStreamingPopup trigger={postStreamingPopup} setTrigger={setPostStreamingPopup} setStreaming1={setStreaming1}
      setStreaming2={setStreaming2} setStreaming3={setStreaming3} setStreaming4={setStreaming4} setStreaming5={setStreaming5}
      />
      {postType == 'review' && loading===false &&
        <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
          <div className="row phone-create-post create-post-row">

            <PostImagePopup trigger={postImagePopup} setTrigger={setPostImagePopup} image={image} setImage={setImage} imageOnChange={imageOnChange} imageURL={imageURL}/>
            
            <label className="form-file-upload phone-file-upload">
                <input className="post-create-image" name="image" key="file-upload" type="file" accept="image/*, video/mp4" onChange={imageOnChange} />
                {imageURL !== '' && 
                  <div className="post-uploaded-image-container">
                    {image.name.slice(-3) == 'MP4' && 
                      <video className="post-create-uploaded-image" controls="controls">
                        <source src={imageURL} type="video/mp4"></source>
                      </video>
                    }
                    {image.name.slice(-3) == 'mp4' && 
                      <video className="post-create-uploaded-image" controls="controls">
                        <source src={imageURL} type="video/mp4"></source>
                      </video>
                    }
                    {image.name.slice(-3) != 'MP4' && image.name.slice(-3) != 'mp4' &&
                      <img src={imageURL} className="post-create-uploaded-image"></img>
                    } 
                  </div>
                  
                }
                {imageURL === '' && 
                  <div className="upload-file-container">
                    <img src="https://mediareviewer.s3.amazonaws.com/static/images/upload.png" className="upload-image"></img>
                    <p className="upload-text">Upload an image or video</p>
                  </div>
                }
            </label>
            

            <div className="post-form">
              <h1 className="post-form-title">Review ({type})</h1>
              <FormInput 
                name= "title"
                type= "text"
                minLength="1"
                placeholder= {placeholderReviewTitle}
                errorMessage="Title should be 5-100 characters long"
                label= "Title"
                required= {true}
                value={values.title}
                onChange={onChange}
              />
              <FormInput 
                name= "media"
                type= "text"
                minLength="1"
                placeholder= {placeholderReviewMedia}
                errorMessage= "Media should be 5-100 characters long"
                label= "Media"
                required= {true}
                value={values.media}
                onChange={onChange}
              />
              <div className="rating-stars-input-container">
                <FormInput 
                  name= "rating"
                  type= "number"
                  lang="en_EN"
                  value={values.rating}
                  onPaste={() => {return false}}
                  onDrop={() => {return false}}
                  autoComplete="off"
                  step= "5"
                  errorMessage= "Password should be between 1 and 10, with at most one decimal"
                  label= "Rating"
                  required= {true}
                  onChange={onChange}
                />
                <div className="post-create-rating">
                  <div className="star-click-container" onMouseEnter={() => {
                      setCurrentRating(values.rating)
                      setEditingStars(true)
                      }}>
                      <div className={"right-part-rating rating-" + values.rating.toString()}></div>
                      {starClicks.map((el) => {
                        return (
                          <div className="click-element" onMouseEnter={() => {
                            if (editingStars===true) {
                              setValues({...values, rating:el})
                            }
                          }} onClick={() => {
                            setValues({...values, rating:el})
                            setEditingStars(false)
                          }} onMouseLeave={() => {
                            if (editingStars) {
                              setValues({...values, rating:currentRating})
                            }
                          }} key={el}>
                          </div>
                        )
                      })}
                    </div>
                  </div>
              </div>

              <FormInput 
                name= "body"
                value={values.body}
                type= "text"
                minLength="1"
                placeholder= "Start by giving a brief introduction to the media..."
                errorMessage= "Body must be at least 10 characters long"
                label= "Body"
                required= {true}
                onChange={onChange}
              />

              <div className="group-buttons-container">
                {group1 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1 no-group">
                      + Group 1
                  </button>
                }
                {group1 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1">
                      {group1}
                  </button>
                }
                {group2 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2 no-group">
                      + Group 2
                  </button>
                }
                {group2 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2">
                      {group2}
                  </button>
                }
                {group3 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3 no-group">
                      + Group 3
                  </button>
                }
                {group3 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3">
                      {group3}
                  </button>
                }
              </div>

              <div className={"streaming-button " + buttonClass} onClick={() => {
                setPostStreamingPopup(true)
              }}>
                <p className="streaming-button-text">+ Add Streaming Platforms</p>
              </div>
            
              <div className="form-buttons">
                <button className="form-cancel-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
                {!submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                     Confirm
                  </button>
                }
                {submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  </button>
                }
              </div>
              <div className="post-create-top">
                <button type="button" className="next-button create-back-btn" onClick={() => {setPostImagePopup(true)}}>Back</button>
                <button type="submit" className="next-button-selected">Confirm</button>
              </div>
            </div>

          </div>
        </form>
      }
      {postType == 'character-review' && loading===false &&
        <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
          <div className="row phone-create-post">

            <PostImagePopup trigger={postImagePopup} setTrigger={setPostImagePopup} image={image} setImage={setImage} imageOnChange={imageOnChange} imageURL={imageURL}/>
            
            <label className="form-file-upload phone-file-upload">
                <input className="post-create-image" name="image" key="file-upload" type="file" accept="image/*, video/mp4" onChange={(e) => setImage(e.target.files[0])} />
                {imageURL !== '' && 
                  <div className="post-uploaded-image-container">
                    {image.name.slice(-3) == 'MP4' && 
                      <video className="post-create-uploaded-image" controls="controls">
                        <source src={imageURL} type="video/mp4"></source>
                      </video>
                    }
                    {image.name.slice(-3) != 'MP4' && 
                      <img src={imageURL} className="post-create-uploaded-image"></img>
                    } 
                  </div>
                  
                }
                {imageURL === '' && 
                  <div className="upload-file-container">
                    <img src="https://mediareviewer.s3.amazonaws.com/static/images/upload.png" className="upload-image"></img>
                    <p className="upload-text">Upload an image or video</p>
                  </div>
                }
            </label>

            <div className="post-form">
              <h1 className="post-form-title">Character Review ({type})</h1>
              <FormInput 
                name= "title"
                minLength="1"
                type= "text"
                value={values.title}
                placeholder= {placeholderCharacterTitle}
                errorMessage="Character name should be 5-100 characters long"
                label= "Character name"
                required= {true}
                onChange={onChange}
              />
              <FormInput 
                name= "media"
                type= "text"
                minLength="1"
                value={values.media}
                placeholder= {placeholderReviewMedia}
                errorMessage= "Media should be 5-100 characters long"
                label= "Media"
                required= {true}
                onChange={onChange}
              />
              <div className="rating-stars-input-container">
                <FormInput 
                  name= "rating"
                  type= "number"
                  value={values.rating}
                  onPaste={() => {return false}}
                  onDrop={() => {return false}}
                  autoComplete="off"
                  step= "5"
                  errorMessage= "Rating should be between 0 and 100, as well as divisible by 5"
                  label= "Rating"
                  required= {true}
                  onChange={onChange}
                />
                <div className="post-create-rating">
                  <div className="star-click-container" onMouseEnter={() => {
                      setCurrentRating(values.rating)
                      setEditingStars(true)
                      }}>
                      <div className={"right-part-rating rating-" + values.rating.toString()}></div>
                      {starClicks.map((el) => {
                        return (
                          <div className="click-element" onMouseEnter={() => {
                            if (editingStars===true) {
                              setValues({...values, rating:el})
                            }
                          }} onClick={() => {
                            setValues({...values, rating:el})
                            setEditingStars(false)
                          }} onMouseLeave={() => {
                            if (editingStars) {
                              setValues({...values, rating:currentRating})
                            }
                          }} key={el}>
                          </div>
                        )
                      })}
                    </div>
                  </div>
              </div>
              <FormInput 
                name= "body"
                value={values.body}
                type= "text"
                placeholder= "First of all..."
                errorMessage= "Body must be at least 10 characters long"
                label= "Body"
                minLength="1"
                required= {true}
                onChange={onChange}
              />

              <div className="group-buttons-container">
                {group1 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1 no-group">
                      + Group 1
                  </button>
                }
                {group1 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1">
                      {group1}
                  </button>
                }
                {group2 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2 no-group">
                      + Group 2
                  </button>
                }
                {group2 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2">
                      {group2}
                  </button>
                }
                {group3 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3 no-group">
                      + Group 3
                  </button>
                }
                {group3 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3">
                      {group3}
                  </button>
                }
              </div>

              <div className="streaming-button" onClick={() => {
                setPostStreamingPopup(true)
              }}>
                <p className="streaming-button-text">+ Add Streaming Platforms</p>
              </div>
     
              <div className="form-buttons">
                <button className="form-cancel-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
                {!submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                     Confirm
                  </button>
                }
                {submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  </button>
                }
              </div>
              <div className="post-create-top">
                <button type="button" className="next-button create-back-btn" onClick={() => {setPostImagePopup(true)}}>Back</button>
                <button type="submit" className="next-button-selected">Confirm</button>
              </div>

              
            </div>

          </div>
        </form>
      }
      {postType == 'post' && loading===false &&
        <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
          <div className="row phone-create-post">

            <PostImagePopup trigger={postImagePopup} setTrigger={setPostImagePopup} image={image} setImage={setImage} imageOnChange={imageOnChange} imageURL={imageURL}/>
            
            <label className="form-file-upload phone-file-upload">
                <input className="post-create-image" name="image" key="file-upload" type="file" accept="image/*, video/mp4" onChange={(e) => setImage(e.target.files[0])} />
                {imageURL !== '' && 
                  <div className="post-uploaded-image-container">
                    {image.name.slice(-3) == 'MP4' && 
                      <video className="post-create-uploaded-image" controls="controls">
                        <source src={imageURL} type="video/mp4"></source>
                      </video>
                    }
                    {image.name.slice(-3) != 'MP4' && 
                      <img src={imageURL} className="post-create-uploaded-image"></img>
                    } 
                  </div>
                  
                }
                {imageURL === '' && 
                  <div className="upload-file-container">
                    <img src="https://mediareviewer.s3.amazonaws.com/static/images/upload.png" className="upload-image"></img>
                    <p className="upload-text">Upload an image or video</p>
                  </div>
                }
            </label>

            <div className="post-form">
              <h1 className="post-form-title">Post ({type})</h1>
              <FormInput 
                name= "title"
                minLength="1"
                type= "text"
                placeholder= ""
                value={values.title}
                label= "Title"
                required= {true}
                onChange={onChange}
              />
              <FormInput 
                name= "media"
                minLength="1"
                value={values.media}
                type= "text"
                errorMessage= "Media should be 5-100 characters long"
                label= "Media"
                required={false}
                onChange={onChange}
              />
              <FormInput 
                name= "body"
                type= "text"
                placeholder= ""
                minLength="1"
                value={values.body}
                label= "Body"
                required= {true}
                onChange={onChange}
              />

              <div className="group-buttons-container">
                {group1 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1 no-group">
                      + Group 1
                  </button>
                }
                {group1 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(1)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-1">
                      {group1}
                  </button>
                }
                {group2 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2 no-group">
                      + Group 2
                  </button>
                }
                {group2 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(2)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-2">
                      {group2}
                  </button>
                }
                {group3 === '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3 no-group">
                      + Group 3
                  </button>
                }
                {group3 !== '' && 
                  <button type="button" onClick={() => {
                    setCurrentGroup(3)
                    setPostGroupPopup(true)
                    }} className="add-group-btn group-btn-3">
                      {group3}
                  </button>
                }
              </div>

              <div className="form-buttons">
                <button className="form-cancel-btn" type="button" onClick={() => navigate("/")}>Cancel</button>
                {!submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                     Confirm
                  </button>
                }
                {submitButtonClicked && 
                   <button type="submit" className="form-submit-button">
                      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  </button>
                }
              </div>
              <div className="post-create-top">
                <button type="button" className="next-button create-back-btn" onClick={() => {setPostImagePopup(true)}}>Back</button>
                <button type="submit" className="next-button-selected">Confirm</button>
              </div>
              
            </div>

          </div>
        </form>
      }
      
    </div>
  );
};