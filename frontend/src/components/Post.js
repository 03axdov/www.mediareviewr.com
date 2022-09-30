import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router"
import { data } from 'jquery';
import axios from 'axios'
import CommentElement from "./CommentElement"
import moment from 'moment'

export default function Post (props) {

    let navigate = useNavigate()

    const [values, setValues] = React.useState({
        id: '',
        author: '',
        created_on: '',
        title: '',
        media: '',
        type: '',
        rating: 0,
        image: '',
        body: '',
        likes: [],
        dislikes: [],
        streaming1: '',
        streaming2: '',
        streaming3: '',
        streaming4: '',
        streaming5: '',
    })
    const [comments, setComments] = React.useState([])
    const [currentComment, setCurrentComment] = React.useState("")
    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: ''
    })
    const [clicks, setClicks] = React.useState(0)
    const [ratingStars, setRatingStars] = React.useState([])
    const [rightPage, setRightPage] = React.useState('info')

    const [isSaved, setIsSaved] = React.useState('loading')
    const [isAuthor, setIsAuthor] = React.useState('loading')

    const [savedClicks, setSavedClicks] = React.useState(0)

    const [postIsClicked, setPostIsClicked] = React.useState(false)

    const [available, setAvailable] = React.useState('')

    React.useEffect(() => {
        setCurrentProfile(props.currentProfile)
        setValues(props.post)
    }, [props])

    React.useEffect(() => {
        const streaming = [values.streaming1, values.streaming2, values.streaming3, values.streaming4, values.streaming5]
        let current = ''
        let firstStreaming = true
        console.log(streaming)
        for (let i = 0; i < streaming.length; i++) {
            console.log(streaming[i])
            if (firstStreaming && streaming[i] != 'None' && streaming[i]) {
                firstStreaming = false
                if (streaming[i] == 'HBOMax') {
                    current = 'HBO Max'
                } else if (streaming[i] == 'PrimeVideo') {
                    current = 'Prime Video'
                } else if (streaming[i] == 'Disney') {
                    current = 'Disney+'
                } else {
                    current = streaming[i]
                }
                
            } else if (streaming[i] != 'None' && streaming[i]) {
                if (streaming[i] == 'HBOMax') {
                    current += ', ' + available + 'HBO Max'
                } else if (streaming[i] == 'PrimeVideo') {
                    current += ', ' + available + 'Prime Video'
                } else if (streaming[i] == 'Disney') {
                    current += ', ' + available + 'Disney+'
                } else {
                    current += ', ' + available + streaming[i]
                }
                
            }
        }
        console.log(current)
        setAvailable(current)
        getPostComments()  
    }, [values])

    React.useEffect(() => {

        if (clicks !== 0) {

            axios.defaults.withCredentials = true;
            axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
            axios.defaults.xsrfCookieName = 'csrftoken';

            const URL = window.location.origin + '/api/update-post/?id=' + values.id.toString()
            const config = {headers: {'Content-Type': 'application/json'}}

            axios.post(URL, values, config)
            .then((res) => {
            })
            .catch((err) => console.log(err))
        }

    }, [values])

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
    }, [values])

    React.useEffect(() => {
        if (values.id !== '') {
            axios({
                method: 'GET',
                url: window.location.origin + '/api/get-post-info/',
                params: {id:values.id}
            }).then(res => {  
                data = res.data   
                setIsSaved(data.isSaved)
                setIsAuthor(data.isAuthor)
        
            }).catch(e => {
                console.log(e)
            })
        }
        
    }, [values])

    React.useEffect(() => {
        if (savedClicks !== 0) {
            axios({
                method: 'GET',
                url: window.location.origin + '/api/save-post/',
                params: {id:values.id}
            }).then(res => {  
                data = res.data
                if (data === 'save') {
                    setIsSaved(false)
                }
                else {
                    setIsSaved(true)
                }
        
            }).catch(e => {
                console.log(e)
            })
        }
    }, [savedClicks])


    function getPostComments() {
        if (values.id != '') {
            axios({
                method: 'GET',
                url: window.location.origin + '/api/get-comments/',
                params: {post:values.id}
            }).then(res => {
                setComments(res.data)
            })
            .catch(e => {
                console.log(e)
            })
        }
        
    }

    function commentOnChange(e) {
        if (e.target.value.length < 200) {
            setCurrentComment(e.target.value)
        }
    }

    function commentOnSubmit(e) {
        e.preventDefault()
        axios.defaults.withCredentials = true;
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
        axios.defaults.xsrfCookieName = 'csrftoken';

        const URL = window.location.origin + '/api/create-comment/?post=' + values.id.toString()
        const config = {headers: {'Content-Type': 'multipart/form-data'}}

        let formField = new FormData()

        formField.append('comment', currentComment)

        axios.post(URL, formField, config)
        .then((res) => {
            setCurrentComment('')
            getPostComments()
        })
        .catch((err) => console.log(err))
    }

    function mediaOnClick() {
        props.postMediaOnClick(values.media)
        props.postBackClick()
    }

    function postHasBeenClicked() {
        setPostIsClicked(false);
    }

    return (values.image !== '') ? (
    <div className="post-detail-container">
        <img src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" onClick={() => {
            setPostIsClicked(true)
            window.setTimeout(postHasBeenClicked, 1);
            props.postBackClick()
            }} className="post-back-image"></img>
            {values.image !== null && 
            <div className="post-detail">
            <div className="post-detail-row">
                <div className="post-detail-col">
                    {values.image != '' && values.image !== null && values.image.slice(-3) !== 'MP4' && values.image.slice(-3) !== 'mp4' &&
                        <div className="post-detail-image-container">
                            <img className="post-detail-image" src={values.image}></img>
                        </div>
                    }
                    {values.image != '' && values.image !== null && values.image.slice(-3) === 'MP4' && postIsClicked === false &&
                        <div className="post-detail-image-container">
                            <video className="post-detail-image" controls="controls">
                                <source src={values.image} type="video/mp4"></source>
                            </video>
                        </div>
                    }
                    {values.image != '' && values.image !== null && values.image.slice(-3) === 'mp4' && postIsClicked === false &&
                        <div className="post-detail-image-container">
                            <video className="post-detail-image" controls="controls">
                                <source src={values.image} type="video/mp4"></source>
                            </video>
                        </div>
                    }        
                    
                    {rightPage === 'info' &&
                        <div className="change-page-container"> 
                            <button className="detail-button change-page-button-info-selected detail-button-selected">Post Info</button>
                            <button className="detail-button change-page-button-comments" onClick={() => {
                                setRightPage('comments')
                                }}>Comments</button>
                        </div>
                    }
                    {rightPage === 'comments' &&
                        <div className="change-page-container"> 
                            <button className="detail-button change-page-button-info" onClick={() => {
                                getPostComments()
                                setRightPage('info')
                                }}>Post Info</button>
                            <button className="detail-button change-page-button-comments-selected detail-button-selected" >Comments</button>
                        </div>
                    }
                    
                    {rightPage === 'info' && values.id !== '' &&
                        <div className="post-detail-info">
                            <div className="detail-author-media-container">
                                <div className="post-author-image-container">
                                    <img src={values.author_image} className="post-author-image" onClick={() => navigate("/profiles/" + values.author_name)}></img>
                                    <div className="author-time-container">
                                        <p className="post-author" onClick={() => navigate("/profiles/" + values.author_name)}>{values.author_name}</p>
                                        <p className="post-time">Posted {moment.utc(values.created_on).local().startOf('seconds').fromNow()}</p> 
                                    </div>    
                                    
                                </div>
                                <div className="post-media-container post-detail-media">
                                    {values.media && 
                                        <p className="post-media" onClick={mediaOnClick}>{values.media}</p>
                                    }
                                </div>
                            </div>
                            <div className="post-detail-title-container">
                                <p className="post-detail-title">{values.title}</p>
                            </div>
                            {values.rating !== null && values.rating !== '' &&
                               <div className="post-rating-container">
                            
                                    <div className="detail-stars-container">
                                        <div className="stars-container-color"></div>
                                        <div className={"right-part-rating-element rating-" + values.rating.toString()}></div>
                                    </div>
                                    <p className="post-detail-rating">{values.rating}%</p>
                                </div>
                            }
                            
                            <p className="post-detail-body">{values.body}</p>
                            <div className="post-detail-buttons">
                                
                                
                                {isSaved === true && 
                                <div className="post-save-container">
                                    <button className="detail-button saved-button" onClick={() => setSavedClicks(savedClicks + 1)}>Saved</button>
                                </div>
                                }
                                {isSaved === false && currentProfile.user !== '' &&
                                <div className="post-save-container">
                                    <button className="detail-button detail-button-selected saved-button-selected" onClick={() => setSavedClicks(savedClicks + 1)}>Save</button>
                                </div>
                                }
                                {isSaved === false && currentProfile.user === '' &&
                                <div className="post-save-container">
                                    <button className="detail-button detail-button-selected saved-button-selected" onClick={() => {
                                    props.setAccountPopup(true)
                                    }}>Save</button>
                                </div>
                                }


                            </div>

                            <div className="post-detail-streaming">
                                {available &&
                                    <p className="post-detail-streaming-text">Available on: {available}</p>
                                }
                            </div>
                            
                        </div>
                    }

                    {rightPage === 'comments' && 
                            <div className="comments-container">
                            {currentProfile.user !== '' && 
                            <form className="comment-form" onSubmit={commentOnSubmit}>
                                <textarea className="comment-input" placeholder="Write a comment..." onChange={commentOnChange} value={currentComment} required></textarea>     
                                <button type="submit" className="comment-submit-button">Submit</button>
                            </form>
                            }
                            {currentProfile.user === '' && 
                            <form className="comment-form" onSubmit={(e) => {
                                e.preventDefault()
                                props.setAccountPopup(true)
                                }}>
                                <textarea className="comment-input" placeholder="Write a comment..." onChange={commentOnChange} value={currentComment} required></textarea>     
                                <button type="submit" className="comment-submit-button">Submit</button>
                            </form>
                            }
                            
                            <div className="comments-feed">
                                {comments.map((comment, index) => {
                                    if (comment === 'None') {
                                        return (
                                            <div key="1">
                                                <p className="no-comments">This post has no comments</p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="comment-phone-container" key={comment.id}>
                                                <CommentElement
                                                    {...comment}
                                                    currentProfile={currentProfile}
                                                    setAccountPopup={props.setAccountPopup}
                                                />
                                            </div>
                                            )
                                    }   
                                })}
                            </div>
                            
                            <div className="post-detail-buttons">
                                
                                {isSaved === true && 
                                <div className="post-save-container">
                                    <button className="detail-button saved-button" onClick={() => setSavedClicks(savedClicks + 1)}>Saved</button>
                                </div>
                                }
                                {isSaved === false && currentProfile.user !== '' &&
                                <div className="post-save-container">
                                    <button className="detail-button detail-button-selected saved-button-selected" onClick={() => setSavedClicks(savedClicks + 1)}>Save</button>
                                </div>
                                }
                                {isSaved === false && currentProfile.user === '' &&
                                <div className="post-save-container">
                                    <button className="detail-button detail-button-selected saved-button-selected" onClick={() => {
                                    props.setAccountPopup(true)
                                    }}>Save</button>
                                </div>
                                }

                            </div>
                        </div>      
                    }
                </div>  
            </div>           
            </div>
            }
            {values.image === null && 
            <div className="post-detail-no-image-container">
            <div className="post-detail post-detail-no-image">
            <div className="post-detail-row">
                <div className="post-detail-col">

                    <div className="change-page-container">
                        {isSaved === true && 
                            <button className="detail-button change-page-button-info-selected detail-button-selected detail-border-radius" onClick={() => setSavedClicks(savedClicks + 1)}>Saved</button>
                        }
                        {isSaved === false && currentProfile.user !== '' &&
                            <button className="detail-button change-page-button-info-selected detail-button-selected saved-button-no-image" onClick={() => setSavedClicks(savedClicks + 1)}>Save</button>
                        }
                        {isSaved === false && currentProfile.user === '' &&
                            <button className="detail-button change-page-button-info-selected detail-button-selected saved-button-no-image" onClick={() => {
                            props.setAccountPopup(true)
                            }}>Save</button>
                        }
 
                    </div>
                    
                    {rightPage === 'info' && values.id !== '' &&
                        <div className="post-detail-info post-detail-info-no-image">
                            <div className="detail-author-media-container">
                                <div className="post-author-image-container">
                                    <img src={values.author_image} className="post-author-image" onClick={() => navigate("/profiles/" + values.author_name)}></img>
                                    <div className="author-time-container">
                                        <p className="post-author" onClick={() => navigate("/profiles/" + values.author_name)}>{values.author_name}</p>
                                        <p className="post-time">Posted {moment.utc(values.created_on).local().startOf('seconds').fromNow()}</p> 
                                    </div>    
                                    
                                </div>
                                <div className="post-media-container post-detail-media">
                                    {values.media && 
                                        <p className="post-media" onClick={mediaOnClick}>{values.media}</p>
                                    }
                                </div>
                            </div>
                            <div className="post-detail-title-container">
                                <p className="post-detail-title">{values.title}</p>
                            </div>
                            {values.rating !== null && values.rating !== '' &&
                                <div className="post-rating-container">
                            
                                    <div className="detail-stars-container">
                                        <div className="stars-container-color"></div>
                                        <div className={"right-part-rating-element rating-" + values.rating.toString()}></div>
                                    </div>
                                    <p className="post-rating">{values.rating} / 10</p>
                                </div>
                            }
                            
                            <p className="post-detail-body post-no-image-body">{values.body}</p>

                            <div className="comments-container comments-container-no-image">
                            {currentProfile.user !== '' && 
                            <form className="comment-form" onSubmit={commentOnSubmit}>
                                <textarea className="comment-input" placeholder="Write a comment..." onChange={commentOnChange} value={currentComment} required></textarea>     
                                <button type="submit" className="comment-submit-button">Submit</button>
                            </form>
                            }
                            {currentProfile.user === '' && 
                            <form className="comment-form" onSubmit={(e) => {
                                e.preventDefault()
                                props.setAccountPopup(true)
                                }}>
                                <textarea className="comment-input" placeholder="Write a comment..." onChange={commentOnChange} value={currentComment} required></textarea>     
                                <button type="submit" className="comment-submit-button">Submit</button>
                            </form>
                            }
                            
                            <div className="comments-feed">
                                {comments.map((comment, index) => {
                                    if (comment === 'None') {
                                        return (
                                            <div key="1">
                                                <p className="no-comments">This post has no comments</p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="comment-phone-container" key={comment.id}>
                                                <CommentElement
                                                    {...comment}
                                                    currentProfile={currentProfile}
                                                />
                                            </div>
                                            )
                                    }   
                                })}
                            </div>
                            
                        </div>
                        </div>
                    }

                </div>  
            </div>           
            </div>
            </div>
            }
            
        </div>
    ) : '';
}