import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Redirect } from "react-router-dom";
import HomePage from "./components/HomePage";
import PostCreatePage from "./components/PostCreatePage";
import PostTypePage from "./components/PostTypePage"
import Post from "./components/Post"
import Profile from "./components/Profile"
import Profiles from "./components/Profiles"
import Groups from "./components/Groups"
import Group from "./components/Group"
import CreateGroup from "./components/CreateGroup"
import ProfileEdit from "./components/ProfileEdit"
import { useNavigate } from "react-router"
import axios from 'axios'
import Popup from "./components/Popup"
import AccountPopup from "./components/AccountPopup"
import RankPopup from "./components/RankPopup"
import { useLocation } from "react-router-dom";
 
export default function App() {
    const navigate = useNavigate()

    const location = useLocation()

    const [currentProfile, setCurrentProfile] = useState({
        user: '',
        name: '',
        bio: '',
        location: '',
        status: '',
        picture: '',
        followers: [],
        following: [],
        following_names: [],
        following_pictures: [],
        following_statuses: [],
        watchlist: '',
    })
    const [error, setError] = React.useState(false)
    const [friendsPopup, setFriendsPopup] = React.useState(false)
    const [profileList, setProfileList] = React.useState([])
    const [friendName, setFriendName] = React.useState("")
    const [getFriendName, setGetFriendName] = React.useState(0)
    const [getProfileDetail, setGetProfileDetail] = React.useState(0)
    const [loadingFriends, setLoadingFriends] = React.useState(true)
    const [loadingCurrentProfile, setLoadingCurrentProfile] = React.useState(true)

    const [loadingAddFriends, setLoadingAddFriends] = React.useState(false)

    const [formSubmit, setFormSubmit] = React.useState(0)
    const [followButtonClicked, setFollowButtonClicked] = React.useState(false)

    const [accountPopup, setAccountPopup] = React.useState(false)

    const [rankPopup, setRankPopup] = React.useState(false)

    const [selectedClass, setSelectedClass] = React.useState('')

    const [isOnProfileElement, setIsOnProfileElement] = React.useState(true)

    const [homeIcon, setHomeIcon] = React.useState('')
    const [createIcon, setCreateIcon] = React.useState('')
    const [groupIcon, setGroupIcon] = React.useState('')
    const [friendIcon, setFriendIcon] = React.useState('')

    useEffect(() => {
        axios({
            method: 'GET',
            url: window.location.origin + '/api/get-current-profile/',
        }).then(res => {
            if (res.data !== '') {
                setCurrentProfile({
                    user: res.data.user,
                    name: res.data.name,
                    bio: res.data.bio,
                    location: res.data.location,
                    status: res.data.status,
                    picture: res.data.picture,
                    banner: res.data.banner,
                    followers: res.data.followers,
                    following: res.data.following,
                    following_names: res.data.following_names,
                    following_pictures: res.data.following_pictures,
                    following_statuses: res.data.following_statuses,
                    watchlist: res.data.watchlist,
                    first_movie: res.data.first_movie,
                    second_movie: res.data.second_movie,
                    third_movie: res.data.third_movie,
                    fourth_movie: res.data.fourth_movie,
                    fifth_movie: res.data.fifth_movie,
                    first_anime: res.data.first_anime,
                    second_anime: res.data.second_anime,
                    third_anime: res.data.third_anime,
                    fourth_anime: res.data.fourth_anime,
                    fifth_anime: res.data.fifth_anime,
                    first_series: res.data.first_series,
                    second_series: res.data.second_series,
                    third_series: res.data.third_series,
                    fourth_series: res.data.fourth_series,
                    fifth_series: res.data.fifth_series,
                    first_game: res.data.first_game,
                    second_game: res.data.second_game,
                    third_game: res.data.third_game,
                    fourth_game: res.data.fourth_game,
                    fifth_game: res.data.fifth_game,
                    first_literature: res.data.first_literature,
                    second_literature: res.data.second_literature,
                    third_literature: res.data.third_literature,
                    fourth_literature: res.data.fourth_literature,
                    fifth_literature: res.data.fifth_literature,
                    
                })
            }  
            setLoadingFriends(false)
            setLoadingCurrentProfile(false)
        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }, [getProfileDetail])

    React.useEffect(() => {
        if (!followButtonClicked) {
            setLoadingAddFriends(true)
        }
        axios({
            method: 'GET',
            url: window.location.origin + '/api/add-friend/',
            params: {name: friendName}
        }).then(res => {
            setLoadingAddFriends(false)
            setFollowButtonClicked(false)
            setProfileList(
                res.data.results
            )
        }).catch(e => {
            setError(true)
            console.log(e)
        })

    }, [formSubmit, getFriendName])

    function friendNameOnChange(e) {
        setFriendName(e.target.value)
    }

    function formOnSubmit(e) {
        e.preventDefault()
        setFollowButtonClicked(false)
        setFormSubmit(formSubmit + 1)
    }

    function followPopupButtonOnClick(e) {
        const user = e
        setFollowButtonClicked(true)
        axios({
            method: 'GET',
            url: window.location.origin + '/api/follow/',
            params: {user: user}
        }).then(res => {
            setGetProfileDetail(getProfileDetail + 1)
            setGetFriendName(getFriendName + 1)

        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }

   function getProfileInfo() {
       setGetProfileDetail(getProfileDetail + 1)
   }

    React.useEffect(() => {
        if (window.location.pathname == "/") {
            setSelectedClass('home-selected')

            setHomeIcon('home-icon-selected')
            setCreateIcon('')
            setGroupIcon('')
            setFriendIcon('')
        }
        if (window.location.pathname.substring(0, 13) == "/create-post/") {
            setSelectedClass('plus-selected')
            
            setHomeIcon('')
            setCreateIcon('home-icon-selected')
            setGroupIcon('')
            setFriendIcon('')
        }
        if (window.location.pathname.substring(0, 8) == "/groups/") {
            setSelectedClass('group-selected')

            setHomeIcon('')
            setCreateIcon('')
            setGroupIcon('home-icon-selected')
            setFriendIcon('')
        }
        if (window.location.pathname.substring(0, 14) == "/create-group/") {
            setSelectedClass('group-selected')
        }
        if (window.location.pathname.substring(0, 9) == "/profile/") {
            setSelectedClass('profile-selected')
        }
        if (window.location.pathname.substring(0, 10) == "/profiles/") {
            setSelectedClass('profile-selected')
        }
        if (window.location.pathname.substring(0, 14) == "/edit-profile/") {
            setSelectedClass('profile-selected')
        }

    }, [location])
    
    return (
        <div className="app-child">
            <AccountPopup trigger={accountPopup} setTrigger={setAccountPopup}></AccountPopup>
            <RankPopup trigger={rankPopup} setTrigger={setRankPopup}></RankPopup>
            <Popup trigger={friendsPopup} setTrigger={setFriendsPopup} setFriendName={setFriendName} setFormSubmit={setFormSubmit} formSubmit={formSubmit}>
                <h2 className="add-friend-title">+ Add friends</h2>
                {!loadingCurrentProfile && !loadingAddFriends &&
                    <ul className="add-friend-list">
                    <form className="profile-search-form" onSubmit={formOnSubmit}>
                        <div className="profile-search-container">
                            <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                            <input className="profile-searchbar" type="text" placeholder="Search for users" onChange={friendNameOnChange} value={friendName}></input>
                        </div>
                    </form>
                    
                    {profileList.map((profile) => {
                        return (
                            <li className="add-friend-element" key={profile.name} onClick={() => {
                                if (isOnProfileElement) {
                                    setFriendIcon('')
                                    if (window.location.pathname.substring(0,10) === "/profiles/") {
                                        setFriendsPopup(false)
                                        navigate("/profile/" + profile.name.toString())
                                    } else {
                                        setFriendsPopup(false)
                                        navigate("/profiles/" + profile.name.toString())
                                    }   
                                }
                                
                            }}>
                                <p className="add-friend-name"><img src={profile.picture} className="profile-image-small add-friend-img" />{profile.name}</p>
                                {currentProfile.following.indexOf(profile.user) == -1 && currentProfile.user != profile.user && currentProfile.user !== '' && <button onClick={() => {
                                    followPopupButtonOnClick(profile.user.toString())
                                }} className={'follow-button-true add-friend-follow phone-add-friend'} onMouseEnter={() => {setIsOnProfileElement(false)}} onMouseLeave={() => {setIsOnProfileElement(true)}}>Follow</button>}
                                {currentProfile.following.indexOf(profile.user) != -1 && currentProfile.user != profile.user && currentProfile.user !== '' && <button onClick={() => {
                                    followPopupButtonOnClick(profile.user.toString())
                                }} className={'follow-button-false add-friend-follow phone-add-friend'} onMouseEnter={() => {setIsOnProfileElement(false)}} onMouseLeave={() => {setIsOnProfileElement(true)}}>Unfollow</button>}

                            </li>
                        )
                    })

                    }
                    </ul>
                }
                {!loadingCurrentProfile && loadingAddFriends &&
                    <ul className="add-friend-list">
                    <form className="profile-search-form" onSubmit={formOnSubmit}>
                        <div className="profile-search-container">
                            <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                            <input className="profile-searchbar" type="text" placeholder="Search for users" onChange={friendNameOnChange} value={friendName}></input>
                        </div>  
                    </form>
                    
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    <li className="add-friend-element">
                        <div className="add-friend-name-loading">
                            <span className="add-friend-img-loading" />
                            <p className="friend-text-loading"></p>
                        </div>
                        <button className="add-friend-button-loading"></button>

                    </li>
                    </ul>
                }
                
            </Popup>
            <nav className="navbar horizontal-nav">
                <img className="logo" src="https://mediareviewer.s3.amazonaws.com/static/images/Logo.png" onClick={() => {
                    navigate('/')
                }}></img>
                <div className={"selected " + selectedClass}></div>
                <div className="home-icon" onClick={() => {
                    navigate("/")
                }}>
                    {window.location.pathname == "/" && <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Home-Current.png"></img>}
                    {window.location.pathname != "/" && <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Home.png"></img>}
                </div>
                <div className="plus-icon" onClick={() => {
                    if (!loadingCurrentProfile && currentProfile.user !== '') {
                        navigate("/create-post/")
                    } else if (!loadingCurrentProfile && currentProfile.user === '') {
                        setAccountPopup(true)
                    }
                    }}>
                    {window.location.pathname.substring(0, 13) == "/create-post/" && <img className="plus-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Current.png"></img>}
                    {window.location.pathname.substring(0, 13) != "/create-post/" && <img className="plus-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus.png"></img>}
                </div>
                <div className="group-icon" onClick={() => {
                    navigate("/groups/")
                }}>
                    {window.location.pathname.substring(0, 14) === "/create-group/" && <img className="group-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Current.png"></img>}
                    {window.location.pathname.substring(0, 8) == "/groups/" && window.location.pathname.substring(0, 14) !== "/create-group/" && <img className="group-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Current.png"></img>}
                    {window.location.pathname.substring(0, 8) != "/groups/" && window.location.pathname.substring(0, 14) !== "/create-group/" && <img className="group-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Group.png"></img>}
                </div>
                <div className="line">
                </div>
                {loadingCurrentProfile !== true && currentProfile.user !== '' &&  
                    <div className="profile-icon" onClick={() => {
                        if (window.location.pathname.substring(0,10) === "/profiles/") {
                            navigate("/profile/" + currentProfile.name.toString())
                        } else {
                            navigate("/profiles/" + currentProfile.name.toString())
                        }
                        }}>
                        <img className="profile-image-nav" src={currentProfile.picture}></img>
                    </div>   
                }
                {loadingCurrentProfile === true && 
                    <div className="profile-loading-icon"></div>
                }

                {loadingCurrentProfile !== true && currentProfile.user !== '' && 
                    <div className="add-friend-icon" onClick={() => {setFriendsPopup(true)}}>
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/AddFriendNav.png" className="add-friend-image"></img>
                    </div>
                }

                {loadingCurrentProfile !== true && currentProfile.user == '' && window.location.pathname.substring(0,10) !== "/profiles/" && window.location.pathname.substring(0,10) !== "/profile/" &&
                    <div className="add-friend-icon users-popup-button" onClick={() => {
                        setFriendsPopup(true)
                        }}>
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/Friend.png" className="add-friend-image"></img>
                    </div>
                }

                {window.location.pathname.substring(0,10) === "/profiles/" && currentProfile.user == '' && !loadingCurrentProfile &&
                    <div className="add-friend-icon users-popup-button" onClick={() => {
                        setFriendsPopup(true)
                        }}>
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/Friend-Selected.png" className="add-friend-image"></img>
                    </div>
                }

                {window.location.pathname.substring(0,9) === "/profile/" && currentProfile.user == '' && !loadingCurrentProfile &&
                    <div className="add-friend-icon users-popup-button" onClick={() => {
                        setFriendsPopup(true)
                        }}>
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/Friend-Selected.png" className="add-friend-image"></img>
                    </div>
                }

                {loadingCurrentProfile !== true && currentProfile.user !== '' && 
                    <div className="logout-icon" onClick={() => {
                        window.location.href = window.location.origin + "/accounts/logout/"
                    }} >
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/Logout.png" className="logout-image-nav"></img>
                    </div>
                }
                {loadingCurrentProfile !== true && currentProfile.user === '' && 
                    <div className="logout-icon" onClick={() => {
                        setAccountPopup(true)
                    }} >
                        <img src="https://mediareviewer.s3.amazonaws.com/static/images/Lock-Nav.png" className="login-image-nav"></img>
                    </div>
                }
                
                
            </nav>
            <nav className="nav-phone">
                <div className="home-icon" onClick={() => {
                    setFriendsPopup(false)
                    navigate("/")
                    }}>
                    <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/HomePhone.png"></img>
                    <img className={"home-image grey-icon " + homeIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Home-Current.png"></img>
                </div>
                <div className="plus-icon" onClick={() => {
                    setFriendsPopup(false)
                    if (!loadingCurrentProfile && currentProfile.user !== '') {
                        navigate("/create-post/")
                    } else if (!loadingCurrentProfile && currentProfile.user === '') {
                        setAccountPopup(true)
                    }
                    }}>
                    <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/PlusPhone.png"></img>
                    <img className={"home-image grey-icon " + createIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Current.png"></img>
                </div>
                <div className="group-icon" onClick={() => {
                    setFriendsPopup(false)
                    navigate("/groups/")
                    }}>
                    <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/GroupPhone.png"></img>
                    <img className={"home-image grey-icon " + groupIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Current.png"></img>
                </div>
                <div className="friends-icon" onClick={() => {
                        setHomeIcon('')
                        setCreateIcon('')
                        setGroupIcon('')
                        setFriendIcon('home-icon-selected')

                        setFriendsPopup(true)
                        setAccountPopup(false)
                    }}>
                    <img className="home-image" src="https://mediareviewer.s3.amazonaws.com/static/images/AddFriend.png"></img>
                    <img className={"home-image grey-icon " + friendIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/AddFriendCurrent.png"></img>
                </div>
                {loadingCurrentProfile !== true && currentProfile.user !== '' &&
                    <div className="profile-icon" onClick={() => {
                        setFriendsPopup(false)
                        if (window.location.pathname.substring(0,10) === "/profiles/") {
                            navigate("/profile/" + currentProfile.name.toString())
                        } else {
                            navigate("/profiles/" + currentProfile.name.toString())
                        }
                        }}>
                        <img className="profile-image-nav" src={currentProfile.picture}></img>
                    </div>   
                }
                {loadingCurrentProfile !== true && currentProfile.user == '' &&
                    <div className="profile-icon" onClick={() => {
                        setAccountPopup(true)
                        setFriendsPopup(false)
                        }}>
                        <img className="profile-image-nav no-user-image-nav" src="https://mediareviewer.s3.amazonaws.com/static/images/Lock.png"></img>
                    </div>   
                }
                {loadingCurrentProfile === true && 
                    <div className="profile-loading-icon"></div>
                }

            </nav>
            {window.location.pathname.substring(0, 13) !== "/create-post/" && window.location.pathname.substring(0,15) !== "/create-group/" && window.location.pathname.substring(0,14) !== "/edit-profile/" &&
                <div className="card text-white bg-danger mb-3 friends-container">
                <div className="card-header"><h3 className="friends-title">Friends</h3></div>
                <div className="card-body friends-body">
                    {!loadingFriends && currentProfile.user !== '' && currentProfile.following_names.length === 0 && 
                        <p className="no-data-text">You haven't added any friends.</p>
                    }
                    {!loadingFriends && currentProfile.user === '' && 
                        <p className="no-data-text">Sign in to add friends, create posts, comment and more.</p>
                    }
                    {!loadingFriends && currentProfile.user != '' && currentProfile.following_names.length !== 0 && 
                    <ul className="friends-list">
                        {currentProfile.following_pictures.map((follower_picture, index) => {
                            return(
                                <li className="friends-element" key={currentProfile.following_names[index]}
                                onClick={() => {
                                    if (window.location.pathname.substring(0,10) === "/profiles/") {
                                        navigate("/profile/" + currentProfile.following_names[index].toString())
                                    } else {
                                        navigate("/profiles/" + currentProfile.following_names[index].toString())
                                    }
                                    }}>
                                    <img src={follower_picture} className="profile-image-small" border="0" />
                                    <div className="name-status-container">
                                        {!(currentProfile.following_statuses[index]) && <p className="friend-name alone">{currentProfile.following_names[index]}</p>}
                                        {currentProfile.following_statuses[index] && <p className="friend-name">{currentProfile.following_names[index]}</p>}
                                        {currentProfile.following_statuses[index] && currentProfile.following_statuses[index].length < 25 && <p className="friend-status">{currentProfile.following_statuses[index]}</p>}
                                        {currentProfile.following_statuses[index] && currentProfile.following_statuses[index].length > 25 && <p className="friend-status">{currentProfile.following_statuses[index].substring(0, 25)}...</p>}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {loadingFriends && 
                    <ul className="friends-list">
                        <li className="friends-element loading-friends-element">
                            <div className="loading-profile-image-small">

                            </div>
                            <div className="name-status-container">
                                <p className="friend-name-loading">

                                </p>
                                <p className="friend-status-loading">

                                </p>
                            </div>
                        </li>
                        <li className="friends-element loading-friends-element">
                            <div className="loading-profile-image-small">

                            </div>
                            <div className="name-status-container">
                                <p className="friend-name-loading">

                                </p>
                                <p className="friend-status-loading">

                                </p>
                            </div>
                        </li>
                        <li className="friends-element loading-friends-element">
                            <div className="loading-profile-image-small">

                            </div>
                            <div className="name-status-container">
                                <p className="friend-name-loading">

                                </p>
                                <p className="friend-status-loading">

                                </p>
                            </div>
                        </li>
                    </ul>
                    }
                    

                    {!loadingCurrentProfile && currentProfile.user !== '' && 
                        <button className="add-friend-btn" onClick={() => {
                            setFriendsPopup(true)
                            setFriendName("")
                        }}>+ Add friends</button>
                    }
                    {!loadingCurrentProfile && currentProfile.user === '' && 
                        <button className="add-friend-btn" onClick={() => {
                            window.location.href = window.location.origin + "/accounts/login/"
                            }}>Sign in</button>
                    }

                    </div>
                </div>
            }
            
            <div className="main">
                <Routes>
                    <Route exact path="/" element={<HomePage currentProfile={currentProfile} setAccountPopup={setAccountPopup}/>} />
                    <Route path="/post/:postId/" element={<Post setAccountPopup={setAccountPopup}/>} />
                    <Route exact path="/create-post/" element={<PostTypePage />} />
                    <Route path="/create-post/:postType/" element={<PostCreatePage />} />
                    <Route path="/profile/:name/" element={<Profile currentProfile={currentProfile} getProfileInfo={getProfileInfo} setAccountPopup={setAccountPopup} setRankPopup={setRankPopup} setFriendsPopup={setFriendsPopup}/>}/>
                    <Route path="/edit-profile/" element={<ProfileEdit currentProfile={currentProfile} getProfileInfo={getProfileInfo}/>}/>
                    <Route path="/profiles/:name/" element={<Profiles currentProfile={currentProfile} getProfileInfo={getProfileInfo} setAccountPopup={setAccountPopup} setRankPopup={setRankPopup} setFriendsPopup={setFriendsPopup}/>}/>
                    <Route exact path="/groups/" element={<Groups currentProfile={currentProfile} setAccountPopup={setAccountPopup}/>}/>
                    <Route path="/groups/:groupName" element={<Group currentProfile={currentProfile}  setAccountPopup={setAccountPopup}/>}/>
                    <Route path="/create-group/" element={<CreateGroup currentProfile={currentProfile}/>}/>
                </Routes>
            </div>
        </div>
    )

}