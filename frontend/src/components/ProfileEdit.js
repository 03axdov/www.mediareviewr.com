import React from 'react'
import PostMediaPopup from "./PostMediaPopup"
import FormInput from "./FormInput"
import axios from 'axios'
import { useNavigate, useParams } from "react-router"
import ListPopup from "./ListPopup"
import ProfileBannerPopup from "./ProfileBannerPopup"

export default function ProfileEdit(props) {

  let navigate = useNavigate()

  const [type, setType] = React.useState('')
  const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: '',
        picture: '',
        bio: '',
        status: '',
        location: '',
        followers: [],
        following: [],
        following_names: [],
        following_pictures: [],
        following_statuses: []
    })

  const [image, setImage] = React.useState(null)
  const [imageURL, setImageURL] = React.useState('')
  const [banner, setBanner] = React.useState(null)
  const [bannerURL, setBannerURL] = React.useState('')

  const [values, setValues] = React.useState({
    bio: '',
    location: '',
    status: '',
  })
  const [clicks, setClicks] = React.useState(0)
  const [listPopup, setListPopup] = React.useState(false)
  const [bannerPopup, setBannerPopup] = React.useState(false)

  const [formSubmitted, setFormSubmitted] = React.useState(false)

  React.useEffect(() => {
    setCurrentProfile(props.currentProfile)

    setImageURL(props.currentProfile.picture)
    setBannerURL(props.currentProfile.banner)

    setValues({...values, bio: props.currentProfile.bio, status: props.currentProfile.status, location: props.currentProfile.location,
      first_movie: props.currentProfile.first_movie,
      second_movie: props.currentProfile.second_movie,
      third_movie: props.currentProfile.third_movie,
      fourth_movie: props.currentProfile.fourth_movie,
      fifth_movie: props.currentProfile.fifth_movie,
      first_anime: props.currentProfile.first_anime,
      second_anime: props.currentProfile.second_anime,
      third_anime: props.currentProfile.third_anime,
      fourth_anime: props.currentProfile.fourth_anime,
      fifth_anime: props.currentProfile.fifth_anime,
      first_series: props.currentProfile.first_series,
      second_series: props.currentProfile.second_series,
      third_series: props.currentProfile.third_series,
      fourth_series: props.currentProfile.fourth_series,
      fifth_series: props.currentProfile.fifth_series,
      first_game: props.currentProfile.first_game,
      second_game: props.currentProfile.second_game,
      third_game: props.currentProfile.third_game,
      fourth_game: props.currentProfile.fourth_game,
      fifth_game: props.currentProfile.fifth_game,
      first_literature: props.currentProfile.first_literature,
      second_literature: props.currentProfile.second_literature,
      third_literature: props.currentProfile.third_literature,
      fourth_literature: props.currentProfile.fourth_literature,
      fifth_literature: props.currentProfile.fifth_literature,
    })

  }, [props])

  React.useEffect(() => {
    if (image === null) return
    if (image === '') return
    if (image === undefined) return
    if (clicks === 0) return
    var binaryData = [];
    binaryData.push(image);
    const url = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
    setImageURL(url)
  }, [image])

  React.useEffect(() => {
    if (banner === null) return
    if (banner === '') return
    if (banner === undefined) return
    if (clicks === 0) return
    var binaryData = [];
    binaryData.push(banner);
    const url = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
    setBannerURL(url)
  }, [banner])

  function handleSubmit(e) {
    e.preventDefault()

    setFormSubmitted(true)

    axios.defaults.withCredentials = true;
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.xsrfCookieName = 'csrftoken';

    const URL = window.location.origin + '/api/edit-profile/?name=' + currentProfile.name
    const config = {headers: {'Content-Type': 'multipart/form-data'}}

    let formField = new FormData()

    if (image !== null) {
      formField.append('picture', image)
    } else {
      formField.append('picture', '')
    }
    if (banner !== null) {
      formField.append('banner', banner)
    } else {
      formField.append('banner', '')
    }
    formField.append('location', values.location)
    formField.append('currentStatus', values.status)
    formField.append('bio', values.bio)
    formField.append('first_movie', values.first_movie)
    formField.append('second_movie', values.second_movie)
    formField.append('third_movie', values.third_movie)
    formField.append('fourth_movie', values.fourth_movie)
    formField.append('fifth_movie', values.fifth_movie)

    formField.append('first_anime', values.first_anime)
    formField.append('second_anime', values.second_anime)
    formField.append('third_anime', values.third_anime)
    formField.append('fourth_anime', values.fourth_anime)
    formField.append('fifth_anime', values.fifth_anime)

    formField.append('first_series', values.first_series)
    formField.append('second_series', values.second_series)
    formField.append('third_series', values.third_series)
    formField.append('fourth_series', values.fourth_series)
    formField.append('fifth_series', values.fifth_series)

    formField.append('first_game', values.first_game)
    formField.append('second_game', values.second_game)
    formField.append('third_game', values.third_game)
    formField.append('fourth_game', values.fourth_game)
    formField.append('fifth_game', values.fifth_game)

    formField.append('first_literature', values.first_literature)
    formField.append('second_literature', values.second_literature)
    formField.append('third_literature', values.third_literature)
    formField.append('fourth_literature', values.fourth_literature)
    formField.append('fifth_literature', values.fifth_literature)

    axios.post(URL, formField, config)
    .then((res) => {
      props.getProfileInfo()
      navigate('/profiles/' + currentProfile.name)
    })
    .catch((err) => {
      setFormSubmitted(false)
      alert("An error occurred. Please refresh the page. Warning: This will delete your current changes.")
      console.log(err)
    })
  }

  function imageOnChange(e) {
    setClicks(clicks+1)
    setImage(e.target.files[0])
  }

  function bannerOnChange(e) {

  }

  const onChange = (e) => {
    if (e.target.name === 'bio') {
      if (e.target.value.length < 300) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'location') {
      if (e.target.value.length < 30) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === 'status') {
      if (e.target.value.length < 100) {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    }
  };

  return (
      <div className="profile-form-container">
        <ListPopup trigger={listPopup} setTrigger={setListPopup} currentProfile={currentProfile} values={values} setValues={setValues}></ListPopup>
        <ProfileBannerPopup trigger={bannerPopup} setTrigger={setBannerPopup} currentProfile={currentProfile} banner={banner} setBanner={setBanner} bannerURL={bannerURL} setBannerURL={setBannerURL} setClicks={setClicks} clicks={clicks}></ProfileBannerPopup>
        <form onSubmit={handleSubmit} className="create-profile-form">
          <h3 className="profile-create-name">{currentProfile.name}</h3>
          <label className="profile-image-upload">
            <input className="profile-create-image" name="image" key="file-upload" type="file" accept="image/*" onChange={imageOnChange} />
            {imageURL !== '' && 
              <img src={imageURL} className="profile-create-uploaded-image"></img>
            }
            
          </label>

          {currentProfile.user !== '' &&
            <div className="profile-edit-div">
              <label className="profile-input-label">Location</label>  
              <input
                value= {values.location}
                type="text"
                name="location"
                onChange={onChange}
                className="input input-location"
                
              />

              <label className="profile-input-label">Status</label>
              <input
                value= {values.status}
                type="text"
                name="status"
                onChange={onChange}
                className="input input-status"
                
              />

              <label className="profile-input-label">Bio</label>
              <textarea
                value= {values.bio}
                type="text"
                name="bio"
                onChange={onChange}
                className="input input-bio"
                
              />

              <div className="group-form-buttons profile-create-buttons">
                <button className="form-cancel-btn" type="button" onClick={() => navigate("/profile/" + currentProfile.name)}>Cancel</button>
                <button type="button" className="change-banner-btn" onClick={() => setBannerPopup(true)}>Banner</button>
                <button type="button" className="change-lists-btn" onClick={() => setListPopup(true)}>Lists</button>
                {!formSubmitted && 
                  <button type="submit" className="form-submit-button">Confirm</button>
                }
                {formSubmitted && 
                  <button type="submit" className="form-submit-button">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  </button>
                }
              </div>
              </div>
          }

        </form>
      </div>
  )
}