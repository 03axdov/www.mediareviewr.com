import React, { useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router"
import { data } from 'jquery';
import axios from 'axios'
import CommentElement from "./CommentElement"
import AdditionalNav from './AdditionalNav';
import PostElement from "./PostElement"
import Post from "./Post"

export default function Group (props) {

    let navigate = useNavigate()

    const {groupName} = useParams()

    const [values, setValues] = React.useState({
        author: "",
        created_on: "",
        name: "",
        description: "",
        type: "",
        members: [],
        members_count: 0,
        post_count: 0,
        image: "",
        header_image: "",
        posts: []

    })
    const [posts, setPosts] = React.useState([])
    const [filters, setFilters] = React.useState(0)
    const [checked, setChecked] = React.useState({
        'Start': true,
        'Movie': true,
        'Anime': true,
        'Series': true,
        'Game': true,
        'Literature': true,
        'Other': true
    })
    const [currentProfile, setCurrentProfile] = React.useState({})
    const [pageNumber, setPageNumber] = React.useState(1)
    const [loading, setLoading] = React.useState(true)
    const [loadingButtons, setLoadingButtons] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [hasMore, setHasMore] = React.useState(false)

    const [getGroup, setGetGroup] = React.useState(0)

    const [lowerPage, setLowerPage] = React.useState("popular")
    const [loadingLower, setLoadingLower] = React.useState(true)

    const [currentPost, setCurrentPost] = React.useState({
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
        isAuthor: false,
        isSaved: false
    })

    const [delay, setDelay] = React.useState(true)

    const [topMembers, setTopMembers] = React.useState([])

    const [sorting, setSorting] = React.useState(Math.floor(Math.random() * (5 - 0)) + 0)

    React.useEffect(() => {
        window.setTimeout(loadingDelay, 1);
    }, [])

    function loadingDelay() {
        setDelay(false);
    }

    const observer = useRef()
    const lastPostElementRef = useCallback(node => {
        if (loading) return 
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    React.useEffect(() => {
        setCurrentProfile(props.currentProfile)   
    }, [props])

    React.useEffect(() => {
        document.title = "MediaReviewr | Group"
    }, [])
    
    React.useEffect(() => {
        
        axios({
            method: 'GET',
            url: window.location.origin + '/api/get-group/',
            params: {name:groupName}
        }).then(res => {
            data = res.data
            setValues({
                author: data.author,
                created_on: data.created_on,
                name: data.name,
                description: data.description,
                type: data.type,
                members: data.members,
                members_count: data.members_count,
                post_count: data.post_count,
                image: data.image,
                header_image: data.header_image,
            })
            setLoadingButtons(false)
        })
        .catch(e => {
            console.log(e)
        })

        axios({
            method: 'GET',
            url: window.location.origin + '/api/top-posters/',
            params: {name:groupName}
        }).then(res => {
            setTopMembers(res.data.results)
        })
        .catch(e => {
            console.log(e)
        })

        
    }, [getGroup])

    React.useEffect(() => {
        setError(false)
  
        if (posts.length == 0) {
            const min = 0;
            const max = 5;
            const intNumber = Math.floor(Math.random() * (max - min)) + min;
            setSorting(intNumber) //> 0, 1, 2, 3, 4
        }
        
        axios({
            method: 'GET',
            url: window.location.origin + '/api/posts/',
            params: {page:pageNumber, group:values.name, group_type:lowerPage, randnum:sorting}
        }).then(res => {
            setHasMore(res.data.next != null)
            setLoading(false)
            setLoadingLower(false)
            setPosts(prevPosts => {

                let arr = [...prevPosts, ...res.data.results]
                const ids = arr.map(o => o.id)
                const filtered = arr.filter(({id}, index) => !ids.includes(id, index + 1))
                
                return filtered
            })


        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }, [filters, pageNumber, values.name, lowerPage])

    function postOnClick(post) {
        setCurrentPost(post)
    }

    function postBackClick() {
        setCurrentPost({
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
            isAuthor: false,
            isSaved: false
        })
    }

    function postMediaOnClick() {

    }

    function popularOnClick() {
        setLoadingLower(true)
        setLowerPage('popular')
    }

    function recentOnClick() {
        setLoadingLower(true)
        setLowerPage('recent')
    }

    function topOnClick() {
        setLoadingLower(true)
        setLowerPage('top')
    }

    function groupInteractOnClick() {

        axios.defaults.withCredentials = true;
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
        axios.defaults.xsrfCookieName = 'csrftoken';

        const URL = window.location.origin + '/api/group-member/?name=' + groupName.toString()

        axios.post(URL)
        .then((res) => {
            setGetGroup(getGroup+1)
        })
        .catch((err) => console.log(err))
        
    }

    return (!delay) ? (
    <div className="groups-container groups-group-container">
        {currentPost.author !== '' && <Post post={currentPost} postBackClick={postBackClick} postMediaOnClick={postMediaOnClick} currentProfile={currentProfile} setAccountPopup={props.setAccountPopup}/>}
        {values.header_image !== '' && <img className="group-detail-header" src={values.header_image} />}
        {values.header_image === '' && <div className="group-detail-header-loading"></div>}
        {values.image !== '' && <img className="group-detail-image" src={values.image} />}
        {values.image === '' && <div className="group-detail-image-loading"></div>}

        {!loading && 
            <p className="group-detail-name">{values.name}</p>
        }
        {loading && 
        <div>
            <div className="group-detail-name-loading"></div>
            <div className="group-detail-info-container-loading"></div>
        </div>
        }

        {loading !== true &&
            <div className="group-detail-info-container">
                <div className="group-detail-members">
                    <div className="detail-members-symbol"></div>
                    {values.members_count === 1 && 
                        <p className="detail-members-count">{values.members_count} member</p>
                    }
                    {values.members_count !== 1 && 
                        <p className="detail-members-count">{values.members_count} members</p>
                    }
                
                    <div className="detail-post-count-symbol"></div>
                    {values.post_count === 1 && 
                        <p className="detail-post-count">{values.post_count} post</p>
                    }
                    {values.post_count !== 1 && 
                        <p className="detail-post-count">{values.post_count} posts</p>
                    }

                    {values.members.indexOf(currentProfile.user) === -1 && loadingButtons === false && currentProfile.user !== '' &&
                    <button className="group-member-join" onClick={groupInteractOnClick}>
                        Join group
                    </button>
                    }
                    {currentProfile.user === '' && loadingButtons === false &&
                    <button className="group-member-join" onClick={() => {
                        props.setAccountPopup(true)
                        }}>
                        Join group
                    </button>
                    }
                    
                    {values.members.indexOf(currentProfile.user) !== -1 && loadingButtons === false && 
                    <button className="group-member-leave" onClick={groupInteractOnClick}>
                        Leave group
                    </button>
                    
                    }
                    
                </div>
                {values.description !== '' && 
                    <p className="group-detail-description">{values.description}</p>
                }
            </div>

        }
            <div className="image-posters-container">
                {!loading && <img src={values.header_image} className="group-detail-header-small"></img>}
                {loading && <div className="group-detail-header-small"></div>}
                <div className="top-posters-container">
                    <h2 className="top-posters-title">Top Posters</h2>
                    <div className="friends-list top-posters-list">
                        {topMembers.map((member, index) => {
                            return(
                                <li className="friends-element top-posters-element" key={member.name}
                                onClick={() => {
                                    if (window.location.pathname.substring(0,10) === "/profiles/") {
                                        navigate("/profile/" + member.name.toString())
                                    } else {
                                        navigate("/profiles/" + member.name.toString())
                                    }
                                    }}>
                                    <img src={member.picture} className="profile-image-small group-profile-image" border="0" />
                                    <div className="name-status-container">
                                        <p className="friend-name">{member.name}</p>
                                        <p className="friend-status">{member.points} points</p>
                                    </div>
                                </li>
                            )
                        })}
                    </div>
                </div>
            </div>

        <div className="group-footer"></div>
    
        {loading !== true &&
        <div>
            {currentProfile.user !== '' && 
                 <div className="post-create-btn-container group-post-create">
                 <div onClick={() => navigate("/create-post/")} className="post-create-btn">
                     <span className="post-create-plus group-post-create-plus">&#43;</span>
                     <div className="post-create-text">
                         <h3 className="post-create-btn-title">Create post</h3>
                         <p className="post-create-btn-text">Share your thoughts.</p>
                     </div>
                 </div>
                </div>
                }
            {currentProfile.user === '' && 
                 <div className="post-create-btn-container group-post-create">
                    <div onClick={() => {props.setAccountPopup(true)}} className="post-create-btn">
                     <span className="post-create-plus group-post-create-plus">&#43;</span>
                     <div className="post-create-text">
                         <h3 className="post-create-btn-title">Create post</h3>
                         <p className="post-create-btn-text">Share your thoughts.</p>
                     </div>
                 </div>
             </div>
                }
            {lowerPage === 'popular' && 
            <div className="group-feed-options">
                <div className="group-feed-option popular-selected">
                    <p className="group-feed-option-text-selected">Popular</p>
                </div>
                <div className="group-feed-option top"  onClick={topOnClick}>
                    <p className="group-feed-option-text">Top</p>
                </div>
                <div className="group-feed-option recent" onClick={recentOnClick}>
                    <p className="group-feed-option-text">Recent</p>
                </div>
            </div>
            }
            {lowerPage === 'recent' && 
                <div className="group-feed-options">
                    <div className="group-feed-option popular" onClick={popularOnClick}>
                        <p className="group-feed-option-text">Popular</p>
                    </div>
                    <div className="group-feed-option top" onClick={topOnClick}>
                        <p className="group-feed-option-text">Top</p>
                    </div>
                    <div className="group-feed-option recent-selected">
                        <p className="group-feed-option-text-selected">Recent</p>
                    </div>
                </div>
            }
            {lowerPage === 'top' && 
                <div className="group-feed-options">
                    <div className="group-feed-option popular" onClick={popularOnClick}>
                        <p className="group-feed-option-text">Popular</p>
                    </div>
                    <div className="group-feed-option top-selected">
                        <p className="group-feed-option-text-selected">Top</p>
                    </div>
                    <div className="group-feed-option recent" onClick={recentOnClick}>
                        <p className="group-feed-option-text">Recent</p>
                    </div>
                </div>
            }
            {loadingLower !== true && 
            <div className="group-feed">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <div ref={lastPostElementRef} key={post.id} className="last-element">
                                <PostElement
                                {...post}
                                postOnClick={postOnClick}
                                currentProfile={currentProfile}
                                loading={loading}
                                setAccountPopup={props.setAccountPopup}
                                />
                            </div>
                        )
                    } else {
                        return (
                        <div key={post.id}>
                            <PostElement
                            {...post}
                            postOnClick={postOnClick}
                            currentProfile={currentProfile}
                            loading={loading}
                            setAccountPopup={props.setAccountPopup}
                            />
                        </div>
                        )
                    }
                    
                })}
            </div>
            }
            {loading === false && loadingLower === false && posts.length === 0 &&
                <div className="no-posts-container">
                    <p className="no-data-text">No posts have been added to this group yet.</p>
                </div>
            }
            {loadingLower && loading===false &&
            <div className="lower-page-container">
                <div className="post-element-loading">
                    <div className="post-header">
                        <div className="post-author-image-container">
                            <div className="post-author-image-loading">
                            </div>
                            <div className="author-time-container">
                                <div className="post-author-loading"></div>
                                <div className="post-time-loading"></div>
                            </div> 
                        </div>
                        <div className="post-media-container">
                            <div className="post-media-loading"></div>
                        </div>
                        
                    </div>   
                    <div className="post-title-container">
                        <p className="post-title-loading"></p>
                    </div>
                    <div className="post-rating-container">
                        <div className="stars-container-loading"></div>
                    </div>
                    <div className="post-image-loading profile-post-image-loading"></div>
                    <div className="post-element-body-loading">

                    </div>
                </div>
                <div className="post-element-loading">
                    <div className="post-header">
                        <div className="post-author-image-container">
                            <div className="post-author-image-loading">
                            </div>
                            <div className="author-time-container">
                                <div className="post-author-loading"></div>
                                <div className="post-time-loading"></div>
                            </div> 
                        </div>
                        <div className="post-media-container">
                            <div className="post-media-loading"></div>
                        </div>
                        
                    </div>   
                    <div className="post-title-container">
                        <p className="post-title-loading"></p>
                    </div>
                    <div className="post-rating-container">
                        <div className="stars-container-loading"></div>
                    </div>
                    <div className="post-image-loading profile-post-image-loading"></div>
                    <div className="post-element-body-loading">

                    </div>
                </div>
            </div>
            }
            
        </div>
        }
        
    </div>
    ): "";
}