import React, { useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router"
import { data, post } from 'jquery';
import PostElement from "./PostElement"
import Post from "./Post"
import axios from 'axios'
import AdditionalNav from "./AdditionalNav"

export default function Profile(props) {

let navigate = useNavigate()

const [posts, setPosts] = React.useState([])
const [currentFilters, setCurrentFilters] = React.useState('Movie Anime Series Game Literature Other')
const [pageNumber, setPageNumber] = React.useState(1)
const [loading, setLoading] = React.useState(false)
const [error, setError] = React.useState(false)
const [hasMore, setHasMore] = React.useState(false)
const [media, setMedia] = React.useState("")
const [lowerPage, setLowerPage] = React.useState("Posts")
const [loadingProfile, setLoadingProfile] = React.useState(true)
const [loaded, setLoaded] = React.useState(0)

const [loadingPage, setLoadingPage] = React.useState(true)

const [postFilter, setPostFilter] = React.useState("recent")

const [currentScroll, setCurrentScroll] = React.useState(0)

React.useEffect(() => {
    window.setTimeout(loadingFalse, 1);
}, [])

function loadingFalse() {
    setLoadingPage(false);
}

const {name} = useParams()

const [values, setValues] = useState({
    user: 'default',
    name: '',
    location: '',
    post_count: 0,
    bio: '',
    picture: '',
    followers: [],
    following: [],
    banner: '',
})
const [prevName, setPrevName] = useState('')
const [currentProfile, setCurrentProfile] = React.useState({
    user: '',
    name: '',
    picture: '',
    followers: [],
    following: [],
    following_names: [],
    following_pictures: [],
    following_statuses: []
})
const [clicks, setClicks] = React.useState(0)
const [prevClicks, setPrevClicks] = React.useState(1)

const [friendsList, setFriendsList] = React.useState([])

const [groupList, setGroupList] = React.useState([])
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

const [buttonClass, setButtonClass] = React.useState('')

const [onFriendElement, setOnFriendElement] = React.useState(true)
const [loadingFriends, setLoadingFriends] = React.useState(true)

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
    setPosts([])
    document.title = "MediaReviewr | Profiles"

    axios({
        method: 'GET',
        url: window.location.origin + '/api/get-mutual-friends/',
        params: {name:name}
    }).then(res => {
        setFriendsList(res.data.results)
        setLoadingFriends(false)
    }).catch(e => {
        setError(true)
        console.log(e)
    })

}, [])

React.useEffect(() => {
    if (prevClicks === clicks) { // Followed through the add-friends popup
        getProfile()
        setCurrentProfile(props.currentProfile)
        setPrevClicks(clicks+1)
    }
    if (values.name == '') {
        getProfile()
        setCurrentProfile(props.currentProfile)
    } else { // Directly through profile page
        setCurrentProfile(props.currentProfile)
        setPrevClicks(clicks)
    }

}, [props.currentProfile.following])

React.useEffect(() => {
    
    setLoading(true)
    setError(false)

    if (loaded === 0) {
        setLoading(true)
        setLoaded(1)
    }
    axios({
        method: 'GET',
        url: window.location.origin + '/api/posts/',
        params: {type:currentFilters, page:pageNumber, media:media, name:name, profile_filter:postFilter}
    }).then(res => {     
        setHasMore(res.data.next != null)
        setLoading(false)
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
    
}, [pageNumber, postFilter])

React.useEffect(() => {
    if (clicks != 0) {
        axios.defaults.withCredentials = true;
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
        axios.defaults.xsrfCookieName = 'csrftoken';

        const URL = window.location.origin + '/api/update-profile/?user=' + values.user.toString()
        const config = {headers: {'Content-Type': 'application/json'}}

        axios.post(URL, values, config)
        .then((res) => {
            props.getProfileInfo()
            setValues(res.data)
            setClicks(0)

        })
        .catch((err) => console.log(err))

    }
    
}, [clicks])

React.useEffect(() => {
    if (values.name !== prevName) {
        axios({
            method: 'GET',
            url: window.location.origin + '/api/profile-get-groups/',
            params: {name:values.name}
        }).then(res => {     
            setGroupList(res.data)
            setPrevName(values.name)
    
        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }
    
}, [values])

function getProfile() {
    axios({
        method: 'GET',
        url: window.location.origin + '/api/get-profile/',
        params: {name:name.toString()}
    }).then(res => {  
        data = res.data   
        setValues({
            user: data.user,
            name: data.name,
            post_count: data.post_count,
            location: data.location,
            bio: data.bio,
            banner: data.banner,
            status: data.status,
            picture: data.picture,
            followers: data.followers,
            following: data.following,
            first_movie: data.first_movie,
            second_movie: data.second_movie,
            third_movie: data.third_movie,
            fourth_movie: data.fourth_movie,
            fifth_movie: data.fifth_movie,
            first_anime: data.first_anime,
            second_anime: data.second_anime,
            third_anime: data.third_anime,
            fourth_anime: data.fourth_anime,
            fifth_anime: data.fifth_anime,
            first_series: data.first_series,
            second_series: data.second_series,
            third_series: data.third_series,
            fourth_series: data.fourth_series,
            fifth_series: data.fifth_series,
            first_game: data.first_game,
            second_game: data.second_game,
            third_game: data.third_game,
            fourth_game: data.fourth_game,
            fifth_game: data.fifth_game,
            first_literature: data.first_literature,
            second_literature: data.second_literature,
            third_literature: data.third_literature,
            fourth_literature: data.fourth_literature,
            fifth_literature: data.fifth_literature,
            points: data.points
        })
        setLoadingProfile(false)

    }).catch(e => {
        setError(true)
        console.log(e)
    })
}

function followButtonOnClick() {
    setClicks(clicks+1)
    if (values.followers.indexOf(currentProfile.user) != -1) {
        let currentUser = currentProfile.user
        let followers = values.followers.filter((follower) => {
            return follower != currentUser
        })         
        setValues({
            ...values, followers:followers
        })

    } else {
        let currentUser = currentProfile.user
        let followers = values.followers
        
        followers.push(currentUser)
        setValues({
            ...values, followers: followers
        })

    }
}

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

return (!loadingPage) ? (
    <div className="fluid-container profile-page">
        <div className="profile-phone-name-follow">
            <p className="profile-name-phone">{values.name}</p>
            {currentProfile.user == values.user && loadingProfile != true && <button className='follow-button-true phone-follow' onClick={() => {navigate('/edit-profile/')}}>Edit</button>}
            {currentProfile.following.indexOf(values.user) == -1 && currentProfile.user !== values.user && loadingProfile !== true && currentProfile.user !== '' && <button onClick={followButtonOnClick} className='follow-button-true phone-follow'>Follow</button>}
            {loadingProfile !== true && currentProfile.user === '' && <button onClick={() => {
                            props.setAccountPopup(true)
                            }} className='follow-button-true phone-follow'>Follow</button>}
            {currentProfile.following.indexOf(values.user) != -1 && currentProfile.user != values.user && loadingProfile !== true && <button onClick={followButtonOnClick} className='follow-button-false phone-follow'>Unfollow</button>}
        </div>
        <div className="profile-phone-margin"></div>
        {currentPost.author !== '' && <Post post={currentPost} postBackClick={postBackClick} postMediaOnClick={postMediaOnClick} currentProfile={currentProfile} setAccountPopup={props.setAccountPopup}/>}
        <div className="profile">
            <div className="row profile-row">
                    <div className="profile-container">
                        {loadingProfile !== true && 
                        <div className="profile-image-sub">
                            <img className="profile-image" src={values.picture}></img>
                        </div>
                        }
                        {loadingProfile === true &&
                        <div className="profile-image-sub">
                            <div className="profile-image-container"></div>
                        </div>
                        }

                        {loadingProfile && 
                            <div className="profile-info-loading">
                                <div className="name-follow-container">   
                                    <h3 className="profile-name-loading"></h3>
                                    <button className="follow-button-loading"></button>
                                </div>
                                <div className="profile-follow-container">
                                    <p className="profile-followers-loading"></p>
                                    <p className="profile-following-loading"></p>
                                    <p className="profile-points-loading"></p>
                                </div>
                                <p className="profile-location-loading"></p>
                                <p className="profile-status-loading"></p>
                                <p className="profile-bio-loading"></p>
                            </div>
                        } 
                        
                        {loadingProfile === false && 
                        <div className="profile-info">
                            <div className="name-follow-container">
                                <h3 className="profile-name">{values.name}</h3>
                                
                                {currentProfile.user == values.user && loadingProfile != true && <button className='follow-button-true' onClick={() => {navigate('/edit-profile/')}}>Edit</button>}
                                {currentProfile.following.indexOf(values.user) == -1 && currentProfile.user != values.user && loadingProfile !== true && currentProfile.user !== '' && <button onClick={followButtonOnClick} className='follow-button-true'>Follow</button>}
                                {loadingProfile !== true && currentProfile.user === '' && <button onClick={() => {
                                    props.setAccountPopup(true)
                                }} className='follow-button-true'>Follow</button>}
                                {currentProfile.following.indexOf(values.user) != -1 && currentProfile.user != values.user && loadingProfile !== true && <button onClick={followButtonOnClick} className='follow-button-false'>Unfollow</button>}
                                
                            </div>
                            
                            {loadingProfile !== true && 
                                <div className="profile-follow-container">
                                    {values.points == 1 && <p className="profile-points"><span className="profile-number">{values.points}</span> points</p>}
                                    {values.points != 1 && <p className="profile-points"><span className="profile-number">{values.points}</span> points</p>}
                                    {values.followers.length == 1 && <p className="profile-followers"><span className="profile-number">{values.followers.length}</span> follower</p>}
                                    {values.followers.length != 1 && <p className="profile-followers"><span className="profile-number">{values.followers.length}</span> followers</p>}
                                    <p className="profile-following"><span className="profile-number">{values.following.length}</span> following</p>
                                    
                                </div>
                            }

                            {!loadingProfile && <div className="profile-location">
                                {values.location && <img className="profile-text-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Location.png"></img>}
                                <p className="location-text">{values.location}</p>
                            </div>}
                            {!loadingProfile && <div className="profile-status">
                                {values.status && <img className="profile-text-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Status.png"></img>}
                                <p className="status-text">{values.status}</p>
                            </div>}
                            <p className="profile-bio">{values.bio}</p>
                                
                        </div>
                        }

                        <div className="profile-right-container">
                            <div className="profile-right"></div>
                        </div>

                        <div className="profile-rank-container">

                            {0 <= values.points && values.points <= 24 &&
                             <p className="profile-rank rank-rookie" onClick={() => {props.setRankPopup(true)}}>Rookie</p>
                            }
                            {25 <= values.points && values.points <= 99 &&
                             <p className="profile-rank rank-beginner" onClick={() => {props.setRankPopup(true)}}>Beginner</p>
                            }
                            {100 <= values.points && values.points <= 149 &&
                             <p className="profile-rank rank-casual" onClick={() => {props.setRankPopup(true)}}>Casual</p>
                            }
                            {150 <= values.points && values.points <= 249 &&
                             <p className="profile-rank rank-intermediate" onClick={() => {props.setRankPopup(true)}}>Intermediate</p>
                            }
                            {250 <= values.points && values.points <= 499 &&
                             <p className="profile-rank rank-pro" onClick={() => {props.setRankPopup(true)}}>Pro</p>
                            }
                            {500 <= values.points && values.points <= 999 &&
                             <p className="profile-rank rank-critic" onClick={() => {props.setRankPopup(true)}}>Critic</p>
                            }
                            {values.points >= 1000 && 
                             <p className="profile-rank rank-star-critic" onClick={() => {props.setRankPopup(true)}}>Star Critic</p>
                            }
                            
                        </div>
                        
                        {loading === false && currentProfile.user === values.user &&
                            <button className="phone-logout-button" onClick={() => {
                                window.location.href = window.location.origin + "/accounts/logout/"
                            }}>Sign out</button>
                        }

                    </div>
                    <div className="profile-friends-container">
                        <div className="profile-add-friends">
                            <span className="profile-add-friends-btn" onClick={() => {props.setFriendsPopup(true)}}>&#43;</span>
                        </div>
                        {!loadingFriends &&
                            <div className="mutual-friends-container" id="mutual-friends-container">
                            {friendsList.length > 4 && <button onClick={() => {
                                const container = document.getElementById('mutual-friends-container')
                                container.scrollBy({
                                    top: 0,
                                    left: currentScroll - 575,
                                    behavior: "smooth"
                                });
                                
                            }} className={"mutual-friends-scroll-left " + buttonClass}><img src="https://mediareviewer.s3.amazonaws.com/static/images/leftarrow.png" className="scroll-image"/></button>}
                            {friendsList.map((friend, index) => {
                                return(
                                    <div className="profile-friend-element" key={friend.name} onClick={() => {
                                        if (window.location.pathname.substring(0,10) === "/profiles/") {
                                            if (onFriendElement) {
                                                navigate("/profile/" + friend.name)
                                            }

                                        } else {
                                            if (onFriendElement) {
                                                navigate("/profiles/" + friend.name)
                                            }

                                        }
                                    }}>
                                        <img className="profile-image-small friend-profile-image" src={friend.picture}></img>
                                        <div className="friend-name-points-container">
                                            <p className="profile-friend-name">{friend.name}</p>
                                            <p className="profile-friend-points">{friend.points} points</p>
                                        </div>
                                    </div>
                                )   
                            })}
                            {!loadingFriends && friendsList.length === 0 && 
                                <p className="no-data-text">This user hasn't added any friends yet.</p>
                            }
                            {friendsList.length > 4 && <button onClick={() => {
                                const container = document.getElementById('mutual-friends-container')
                                container.scrollBy({
                                    top: 0,
                                    left: currentScroll + 575,
                                    behavior: "smooth"
                                });
                                
                            }} className={"mutual-friends-scroll-right " + buttonClass}><img src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png" className="scroll-image"/></button>}
                            
                                
                            </div>
                        }
                        {loadingFriends &&
                        <div className="mutual-friends-container">
                            <div className="profile-loading-friends-container">
                                <div className="profile-friend-element">
                                    <div className="friend-profile-image-loading"></div>
                                    <div className="friend-name-points-container">
                                        <p className="profile-friend-name-loading"></p>
                                        <p className="profile-friend-points-loading"></p>
                                    </div>
                                </div>
                                <div className="profile-friend-element">
                                    <div className="friend-profile-image-loading"></div>
                                    <div className="friend-name-points-container">
                                        <p className="profile-friend-name-loading"></p>
                                        <p className="profile-friend-points-loading"></p>
                                    </div>
                                </div>
                                <div className="profile-friend-element">
                                    <div className="friend-profile-image-loading"></div>
                                    <div className="friend-name-points-container">
                                        <p className="profile-friend-name-loading"></p>
                                        <p className="profile-friend-points-loading"></p>
                                    </div>
                                </div>
                                <div className="profile-friend-element">
                                    <div className="friend-profile-image-loading"></div>
                                    <div className="friend-name-points-container">
                                        <p className="profile-friend-name-loading"></p>
                                        <p className="profile-friend-points-loading"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    
                    {values.banner && 
                        <div className="banner-container">
                            <img className="profile-banner" src={values.banner}></img>
                        </div>
                    } 
                    
            </div>

            {loading === true &&
                <div className="row profile-row profile-options-row">
                    <div className="profile-options">
                            <div className="profile-options-element-selected">
                                <p className="profile-options-text">Posts</p>
                            </div>
                            <div className="profile-options-element">
                                <p className="profile-options-text">Lists</p>
                            </div>
                            <div className="profile-options-element">
                                <p className="profile-options-text">Groups</p>
                            </div>
                    </div>
                </div>
            }
            {lowerPage == "Posts" && 
            <div>
                {loading === false && 
                    <div className="row profile-row">
                        <div className="profile-options">
                            <div className="profile-options-element-selected" onClick={() => setLowerPage("Posts")}>
                                <p className="profile-options-text">Posts</p>
                            </div>
                            <div className="profile-options-element" onClick={() => setLowerPage("Lists")}>
                                <p className="profile-options-text">Lists</p>
                            </div>
                            <div className="profile-options-element" onClick={() => setLowerPage("Groups")}>
                                <p className="profile-options-text">Groups</p>
                            </div>
                        </div>
                    </div>
                }

                <div className="row profile-row">
                    {postFilter === 'recent' &&
                    <div className="profile-feed-options">
                        <div className="profile-feed-option-selected">
                            <p className="profile-feed-option-text">Recent</p>
                        </div>
                        <div className="profile-feed-option" onClick={() => {
                            setLoading(true)
                            setPosts([])
                            setPageNumber(1)
                            setPostFilter('top')}}
                            >
                            <p className="profile-feed-option-text">Top</p>
                        </div>
                    </div>
                    }
                    {postFilter === 'top' &&
                    <div className="profile-feed-options">
                        <div className="profile-feed-option" onClick={() => {
                            setLoading(true)
                            setPosts([])
                            setPageNumber(1)
                            setPostFilter('recent')}}>
                            <p className="profile-feed-option-text">Recent</p>
                        </div>
                        <div className="profile-feed-option-selected">
                            <p className="profile-feed-option-text">Top</p>
                        </div>
                    </div>
                    }        
                   
                    <div className="container profile-feed col-12">
                        {loading && 
                            <div>
                            <div className="post-element-loading profile-element-loading">
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
                            <div className="post-element-loading profile-element-loading">
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
                            <div className="post-element-loading profile-element-loading">
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
                        {posts.length == 0 && loading === false && loadingProfile === false && <p className="no-data-text">This user hasn't created any posts yet.</p>}
                        {posts.map((post, index) => {
                            if (posts.length === index + 1) {
                                return (
                                    <div ref={lastPostElementRef} className="profile-last-element" key={post.id}>
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
                </div>
            </div>
            }

            {lowerPage == "Lists" &&

                <div>
                    {loading === false && 
                        <div className="row profile-row">
                            <div className="profile-options">
                                <div className="profile-options-element" onClick={() => setLowerPage("Posts")}>
                                    <p className="profile-options-text">Posts</p>
                                </div>
                                <div className="profile-options-element-selected" onClick={() => setLowerPage("Lists")}>
                                    <p className="profile-options-text">Lists</p>
                                </div>
                                <div className="profile-options-element" onClick={() => setLowerPage("Groups")}>
                                    <p className="profile-options-text">Groups</p>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="row profile-row">
                        <div className="profile-lists-row-1">
                            <div className="card profile-list">
                                <div className="card-header"><h3 className="title-movies">Top Movies</h3></div>
                                <div className="card-body trending-detail-body">
                                    <ol className="profile-detail-list">
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.first_movie && values.first_movie}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.second_movie && values.second_movie}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.third_movie && values.third_movie}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fourth_movie && values.fourth_movie}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fifth_movie && values.fifth_movie}</p>
                                        </li>
                                    </ol>  
                                </div>
                            </div>
                            <div className="card profile-list">
                                <div className="card-header"><h3 className="title-anime">Top Anime</h3></div>
                                <div className="card-body trending-detail-body">
                                    <ol className="profile-detail-list">
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.first_anime && values.first_anime}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.second_anime && values.second_anime}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.third_anime && values.third_anime}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fourth_anime && values.fourth_anime}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fifth_anime && values.fifth_anime}</p>
                                        </li>
                                    </ol>   
                                </div>
                            </div>
                            <div className="card profile-list">
                                <div className="card-header"><h3 className="title-series">Top Series</h3></div>
                                <div className="card-body trending-detail-body">
                                    <ol className="profile-detail-list">
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.first_series && values.first_series}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.second_series && values.second_series}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.third_series && values.third_series}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fourth_series && values.fourth_series}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fifth_series && values.fifth_series}</p>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="card profile-list">
                                <div className="card-header"><h3 className="title-games">Top Games</h3></div>
                                <div className="card-body trending-detail-body">
                                    <ol className="profile-detail-list">
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.first_game && values.first_game}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.second_game && values.second_gane}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.third_game && values.third_game}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fourth_game && values.fourth_game}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fifth_game && values.fifth_game}</p>
                                        </li>
                                    </ol>   
                                </div>
                            </div>
                            <div className="card profile-list">
                                <div className="card-header"><h3 className="title-literature">Top Literature</h3></div>
                                <div className="card-body trending-detail-body">
                                    <ol className="profile-detail-list">
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.first_literature && values.first_literature}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.second_literature && values.second_literature}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.third_literature && values.third_literature}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fourth_literature && values.fourth_literature}</p>
                                        </li>
                                        <li className="profile-list-element">
                                            <p className="profile-list-name">{values.fifth_literature && values.fifth_literature}</p>
                                        </li>
                                    </ol>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {lowerPage == "Groups" &&
            
                <div>
                    {loading === false && 
                        <div className="row profile-row">
                            <div className="profile-options">
                                <div className="profile-options-element" onClick={() => setLowerPage("Posts")}>
                                    <p className="profile-options-text">Posts</p>
                                </div>
                                <div className="profile-options-element" onClick={() => setLowerPage("Lists")}>
                                    <p className="profile-options-text">Lists</p>
                                </div>
                                <div className="profile-options-element-selected" onClick={() => setLowerPage("Groups")}>
                                    <p className="profile-options-text">Groups</p>
                                </div>
                            </div>
                        </div>
                    }     

                    <div className="profile-groups-feed">
                        {loading && <div className="lds-spinner-small"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
                        {groupList.length == 0 && loading === false && <p className="no-data-text">This user hasn't joined any groups yet.</p>}
                        
                        {groupList.map((group) => {
                            return (
                                <div className="group-container" key={group.id} onClick={() => {
                                    navigate("/groups/" + group.name.toString())
                                    }}>
                                    <img className="group-header profile-group-header" src={group.header_image}></img>
                                    <img className="group-image-small" src={group.image}></img>
                                    <p className="group-name">{group.name}</p>
                                    
                                    {group.description.length <= 100 && 
                                        <p className="group-description">{group.description}</p>
                                    }
                                    {group.description.length > 100 && 
                                        <p className="group-description">{group.description.substring(0,100)}...</p>
                                    }
                                    
                                    <div className="members-container">
                                        <div className="members-symbol"></div>
                                        {group.members_count === 1 && 
                                            <p className="members-count">{group.members_count} member</p>
                                        }
                                        {group.members_count !== 1 && 
                                            <p className="members-count">{group.members_count} members</p>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }

        </div>
    </div>
): "";

}