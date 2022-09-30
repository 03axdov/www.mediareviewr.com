import React from 'react';
import { useNavigate } from "react-router"
import axios from 'axios'
import moment from 'moment'

export default function PostElement (props) {

    let navigate = useNavigate()

    const [currentMedia, setCurrentMedia] = React.useState(0)
    const [id, setId] = React.useState(props.id)
    const [values, setValues] = React.useState({
        id: props.id,
        post_type: props.post_type,
        title: props.title,
        type: props.type,
        season: props.season,
        episode: props.episode,
        media: props.media,
        rating: props.rating,
        body: props.body,
        image: props.image,
        created_on: props.created_on,
        author: props.author,
        author_name: props.author_name,
        author_image: props.author_image,
        likes: props.likes,
        dislikes: props.dislikes,
        isInteracted: false,
        wasInteracted: false,
        streaming1: props.streaming1,
        streaming2: props.streaming2,
        streaming3: props.streaming3,
        streaming4: props.streaming4,
        streaming5: props.streaming5,
    })
    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: '',
    })
    const [clicks, setClicks] = React.useState(0)
    const [requests, setRequests] = React.useState(0)
    const [ratingStars, setRatingStars] = React.useState([])

    const [isOnElement, setIsOnElement] = React.useState(true)

    const [postClicked, setPostClicked] = React.useState(false)

    const [shadingVisible, setShadingVisible] = React.useState('')

    React.useEffect(() => {
        setCurrentProfile({
            user: props.currentProfile.user,
            name: props.currentProfile.name
        })
    }, [props])

    React.useEffect(() => {
        let currentRating = []
        let fullStars = Math.floor(values.rating)
        for (let i = 0; i < fullStars; i++) {
            currentRating.push(1)
        }
        let smallStar = Math.round((values.rating-fullStars) * 10) / 10
        if (smallStar !== 0) {
            currentRating.push(smallStar)
        }
        let emptyStars = 10 - Math.ceil(values.rating)
        if (emptyStars !== 0) {
            for (let i = 0; i < emptyStars; i++) {
                currentRating.push(0)
            }
        }
        setRatingStars(currentRating)
    }, [])
        

    React.useEffect(() => {
        if (clicks !== 0) {

            axios.defaults.withCredentials = true;
            axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
            axios.defaults.xsrfCookieName = 'csrftoken';

            const URL = window.location.origin + '/api/update-post/?id=' + id.toString()
            const config = {headers: {'Content-Type': 'application/json'}}

            axios.post(URL, values, config)
            .then((res) => {
                
            })
            .catch((err) => console.log(err))
        }
        let body = document.getElementById("post-element-body")
        if (body) {
            if (body.offsetHeight >= 300) {
                setShadingVisible('shading-visible')
            }
        }
    }, [values])

    React.useEffect(() => {
        if(requests != 0) {
            props.postOnClick(values)
            window.setTimeout(pauseVideo, 1);
        }
    }, [requests])

    function pauseVideo() {
        setPostClicked(true) // Keeps video from playing
        window.setTimeout(postElementClicked, 1);
    }

    function postElementClicked() {
        setPostClicked(false);
    }

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
                    ...values, likes:likes, dislikes:dislikes, isInteracted: true, wasInteracted: false
                })
            } else {
            setValues({
                ...values, likes:likes, isInteracted: true, wasInteracted: true
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
                    ...values, likes:likes, dislikes:dislikes, isInteracted: true, wasInteracted: false
                })
            } else {
                likes.push(currentProfile.user)
                setValues({
                    ...values, likes: likes, isInteracted: false, wasInteracted: false
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
                    ...values, likes:likes, dislikes:dislikes, isInteracted: true, wasInteracted: false
                })
            } else {
            setValues({
                ...values, dislikes:dislikes, isInteracted: true, wasInteracted: true
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
                    ...values, likes:likes, dislikes:dislikes, isInteracted: true, wasInteracted: false
                })
            } else {
                dislikes.push(currentProfile.user)
                setValues({
                    ...values, dislikes: dislikes, isInteracted: false, wasInteracted: false
                })
            }
        }
    }

    function mediaOnClick() {
        if (window.location.pathname === "/") {
            props.postMediaOnClick(values.media)
        }

    }

    return (
        
        <div className="post-element" onClick={() => {
            if (isOnElement) {
                if (window.innerWidth > 700) {
                    setRequests(requests+1)
                }

            }
            }}>
                <div>
                <div className="post-header">
                    <div className="post-author-image-container">
                        <img src={values.author_image} className="post-author-image" onClick={() => navigate("/profiles/" + values.author_name)} onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)}></img>
                        <div className="author-time-container">
                            <p className="post-author" onClick={() => navigate("/profiles/" + values.author_name)} onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)}>{values.author_name}</p>
                            <p className="post-time">Posted {moment.utc(values.created_on).local().startOf('seconds').fromNow()}</p> 
                        </div>         
                    </div>
                    <div className="post-media-container">
                        {values.media && 
                            <p className="post-media" onClick={mediaOnClick} onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)}>{values.media}</p>
                        }
                    </div>
                </div>
                <div className="post-upper">
                    <div className="post-title-container" onClick={() => setRequests(requests+1)}>
                        <p className="post-title">{values.title}</p>
                    </div>
                    {values.post_type !== 'post' && 
                        <div className="post-rating-container">
                            
                            <div className="stars-container">
                            <div className="stars-container-color"></div>
                            <div className={"right-part-rating-element rating-" + values.rating.toString()}></div>
                            </div>
                            <p className="post-rating">{values.rating}%</p>
                        </div>
                    }
                    
                    {values.image !== null && props.loading === false && values.image.slice(-3) !== 'MP4' && values.image.slice(-3) !== 'mp4' &&
                        <div className="post-image-container" onClick={() => setRequests(requests+1)}>
                            <img className="post-image" src={values.image} loading="lazy"></img>
                        </div> 
                    }
                    {values.image !== null && props.loading === false && values.image.slice(-3) === 'MP4' && postClicked==false&&
                        <video className="post-image-container" controls="controls" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)}>
                            <source src={values.image} type="video/mp4"></source>
                        </video>
                    }
                    {values.image !== null && props.loading === false && values.image.slice(-3) === 'mp4' && postClicked==false&&
                        <video className="post-image-container" controls="controls" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)}>
                            <source src={values.image} type="video/mp4"></source>
                        </video>
                    }
                    
                    {values.image && 
                    <div className="post-element-body">
                        {values.body.length > 230 && <p>{values.body.substring(0, 230)}...</p>}
                        {values.body.length <= 230 && <p>{values.body}</p>}
                    </div>
                    }
                    {!values.image &&
                    <div className="post-element-body-no-image" id="post-element-body">
                        <p>{values.body}</p>
                        <div className={"post-element-body-shading " + shadingVisible}></div>
                    </div>
                    }
                    <div className="post-element-body-phone"  onClick={() => setRequests(requests+1)}>
                        {values.body.length > 150 && <p>{values.body.substring(0, 150)}...</p>}
                        {values.body.length <= 150 && <p>{values.body}</p>}
                    </div>
                    </div>
                    <div className="post-element-buttons">
                        <p className="post-element-type">{values.type}</p>
                        {values.likes.indexOf(currentProfile.user) !== -1 && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like-clicked.png" onClick={likeOnClick} className="like-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}
                        {values.likes.indexOf(currentProfile.user) == -1 && currentProfile.user !== '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like.png" onClick={likeOnClick} className="like-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}
                        {values.likes.indexOf(currentProfile.user) == -1 && currentProfile.user === '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Like.png" onClick={() => {
                        props.setAccountPopup(true)}} className="like-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}

                        <p className="likes-count">{values.likes.length}</p>
                        
                        {values.dislikes.indexOf(currentProfile.user) != -1 && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike-clicked.png" onClick={dislikeOnClick} className="dislike-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}
                        {values.dislikes.indexOf(currentProfile.user) == -1 && currentProfile.user !== '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike.png" onClick={dislikeOnClick} className="dislike-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}
                        {values.dislikes.indexOf(currentProfile.user) == -1 && currentProfile.user === '' && <img src="https://mediareviewer.s3.amazonaws.com/static/images/Dislike.png" onClick={() => {
                        props.setAccountPopup(true)
                        }} className="dislike-button" onMouseEnter={() => setIsOnElement(false)} onMouseLeave={() => setIsOnElement(true)} />}
                        <p className="dislikes-count">{values.dislikes.length}</p>
                    </div>
                </div>
            
            
        </div>
    )
}