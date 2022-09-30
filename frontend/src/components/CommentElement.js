import React from 'react';
import { useNavigate } from "react-router"
import axios from 'axios'
import moment from 'moment'

export default function CommentElement (props) {

    let navigate = useNavigate()

    const [values, setValues] = React.useState({
        id: props.id,
        comment: props.comment,
        created_on: props.created_on,
        author: props.author,
        author_name: props.author_name,
        author_image: props.author_image,
        likes: props.likes,
        dislikes: props.dislikes
    })
    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: ''
    })
    const [clicks, setClicks] = React.useState(0)

    React.useEffect(() => {
        setCurrentProfile({
            user: props.currentProfile.user,
            name: props.currentProfile.name
        })
    }, [props])

    React.useEffect(() => {
        if (clicks !== 0) {

            axios.defaults.withCredentials = true;
            axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
            axios.defaults.xsrfCookieName = 'csrftoken';

            const URL = window.location.origin + '/api/update-comment/?id=' + values.id.toString()
            const config = {headers: {'Content-Type': 'application/json'}}

            axios.post(URL, values, config)
            .then((res) => {
                
            })
            .catch((err) => console.log(err))
        }

    }, [values])

    function likeOnClick() {
        setClicks(clicks+1)
        if (values.likes.indexOf(currentProfile.user) != -1) {
            let currentUser = currentProfile.user
            let likes = values.likes.filter((like) => {
                return like != currentUser
            })
            if (values.dislikes.indexOf(currentProfile.user) != -1) {
                let dislikes = values.dislikes.filter((dislike) => {
                    return dislike != currentName
                })
                setValues({
                    ...values, likes:likes, dislikes:dislikes
                })
            } else {
            setValues({
                ...values, likes:likes
            })
            }
        } else {
            let currentUser = currentProfile.user
            let likes = values.likes
            if (values.dislikes.indexOf(currentProfile.user) != -1) {
                let dislikes = values.dislikes.filter((dislike) => {
                    return dislike != currentUser
                })
                likes.push(currentProfile.user)
                setValues({
                    ...values, likes:likes, dislikes:dislikes
                })
            } else {
                likes.push(currentProfile.user)
                setValues({
                    ...values, likes: likes
                })
            }
        }
        
    }

    function dislikeOnClick() {
        setClicks(clicks+1)
        if (values.dislikes.indexOf(currentProfile.user) != -1) {
            let currentUser = currentProfile.user
            let dislikes = values.dislikes.filter((dislike) => {
                return dislike != currentUser
            })
            if (values.likes.indexOf(currentProfile.user) != -1) {
                let likes = values.likes.filter((like) => {
                    return like != currentUser
                })
                setValues({
                    ...values, likes:likes, dislikes:dislikes
                })
            } else {
            setValues({
                ...values, dislikes:dislikes
            })
            }
        } else {
            let currentUser = currentProfile.user
            let dislikes = values.dislikes
            if (values.likes.indexOf(currentProfile.user) != -1) {
                let likes = values.likes.filter((like) => {
                    return like != currentUser
                })
                dislikes.push(currentProfile.user)
                setValues({
                    ...values, likes:likes, dislikes:dislikes
                })
            } else {
                dislikes.push(currentProfile.user)
                setValues({
                    ...values, dislikes: dislikes
                })
            }
        }
    }

    return (
        <div className="comment">
            <div className="comment-author-image-container">
                <img src={values.author_image} className="comment-author-image" onClick={() => navigate("/profiles/" + values.author_name)}></img>
                <div className="comment-author-time-container">
                    <p className="comment-author" onClick={() => navigate("/profiles/" + values.author_name)}>{values.author_name}</p>
                    <p className="comment-time">Posted {moment.utc(values.created_on).local().startOf('seconds').fromNow()}</p> 
                </div>         
            </div>
            <div className="comment-text-container">
                <p className="comment-text">{values.comment}</p>
            </div> 
            <div className="comment-element-buttons">
                {values.likes.indexOf(currentProfile.user) != -1 && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like-clicked.png" onClick={likeOnClick} className="like-button comment-button" />}
                {values.likes.indexOf(currentProfile.user) == -1 && currentProfile.user !== '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like.png" onClick={likeOnClick} className="like-button comment-button" />}
                {values.likes.indexOf(currentProfile.user) == -1 && currentProfile.user === '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like.png" onClick={() => {
                    props.setAccountPopup(true)
                    }} className="like-button comment-button" />}
                <p className="comment-likes-count">{values.likes.length}</p>

                {values.dislikes.indexOf(currentProfile.user) != -1 && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike-clicked.png" onClick={dislikeOnClick} className="dislike-button comment-button" />}
                {values.dislikes.indexOf(currentProfile.user) == -1 && currentProfile.user !== '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike.png" onClick={dislikeOnClick} className="dislike-button comment-button" />}
                {values.dislikes.indexOf(currentProfile.user) == -1 && currentProfile.user === '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike.png" onClick={() => {
                    props.setAccountPopup(true)
                    }} className="dislike-button comment-button" />}
                <p className="comment-dislikes-count">{values.dislikes.length}</p>
            </div>
        </div>
    )

}