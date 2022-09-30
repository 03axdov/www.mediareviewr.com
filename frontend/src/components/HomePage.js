import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router"
import PostElement from "./PostElement"
import Popup from "./Popup"
import Post from "./Post"
import Watchlist from "./Watchlist"
import TrendingPopup from "./TrendingPopup"
import StreamingPopup from "./StreamingPopup"
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'

export default function HomePage(props) {
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
    const [currentFilters, setCurrentFilters] = React.useState('Movie Anime Series Game Literature Other')
    const [pageNumber, setPageNumber] = React.useState(1)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [hasMore, setHasMore] = React.useState(false)

    const [media, setMedia] = React.useState("")
    const [averageRating, setAverageRating] = React.useState(0)
    const [ratingStars, setRatingStars] = React.useState([])

    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: '',
        following: [],
        following_names: [],
        following_pictures: [],
        following_statuses: [],
        watchlist: '',
    })
    const [trending, setTrending] = React.useState([])
    const [trendingPopup, setTrendingPopup] = React.useState(false)
    const [friendsPopup, setFriendsPopup] = React.useState(false)
    const [watchlistPopup, setWatchlistPopup] = React.useState(false)
    const [streamingPopup, setStreamingPopup] = React.useState(false)

    const [saved, setSaved] = React.useState("")

    const [trendingTotal, setTrendingTotal] = React.useState([])
    const [friendName, setFriendName] = React.useState("")
    const [profileList, setProfileList] = React.useState([])
    const [getProfile, setGetProfile] = React.useState(0)
    const [getFriendName, setGetFriendName] = React.useState(0)
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
        isSaved: false,
        streaming1: '',
        streaming2: '',
        streaming3: '',
        streaming4: '',
        streaming5: '',
    })
    const [currentSearch, setCurrentSearch] = React.useState('')

    const [sorting, setSorting] = React.useState(Math.floor(Math.random() * (5 - 0)) + 0)

    const [mediaName, setMediaName] = React.useState('')

    const [streaming1, setStreaming1] = React.useState('None')
    const [streaming2, setStreaming2] = React.useState('None')
    const [streaming3, setStreaming3] = React.useState('None')
    const [streaming4, setStreaming4] = React.useState('None')
    const [streaming5, setStreaming5] = React.useState('None')

    const [homeIcon, setHomeIcon] = React.useState('home-icon-selected')
    const [streamingIcon, setStreamingIcon] = React.useState('')
    const [trendingIcon, setTrendingIcon] = React.useState('')
    const [savedIcon, setSavedIcon] = React.useState('')
    const [watchlistIcon, setWatchlistIcon] = React.useState('')

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

    let navigate = useNavigate()

    React.useEffect(() => {
        document.title = "MediaReviewr | Home"
    }, [])

    React.useEffect(() => {
        setCurrentProfile(props.currentProfile)
    }, [props])

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: window.location.origin + '/api/trending/',
        }).then(res => {
            setTrending(
                res.data[0]
            )
            setTrendingTotal(
                res.data
            )
        }).catch(e => {
            setError(true)
            console.log(e)
        })
    
    }, [getProfile])

    React.useEffect(() => {
        setPosts([])
    }, [filters])

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
            params: {type:currentFilters, page:pageNumber, media:media, saved:saved, current:currentProfile.name, randnum:sorting,
                     streaming1: streaming1, streaming2: streaming2, streaming3: streaming3, streaming4: streaming4, streaming5: streaming5}
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

        if (media !== '') {
            axios({
                method: 'GET',
                url: window.location.origin + '/api/get-media/',
                params: {media:media}
            }).then(res => {
                if (res.data !== '') {
                    setAverageRating(res.data.average_rating)
                    setMediaName(res.data.media)
                } else {
                    setAverageRating('')
                }
    
            }).catch(e => {
                setError(true)
                console.log(e)
            })
        }
        if (media === '') {
            setAverageRating('')
        }

    }, [filters, pageNumber, saved])

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: window.location.origin + '/api/add-friend/',
            params: {name: friendName}
        }).then(res => {
                setProfileList(
                    res.data.results
                )
        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }, [friendName, getFriendName])

    function handleOnChange(e) {
        setChecked({...checked, 'Start': false, [e.target.name]: !checked[e.target.name] })
    }

    function filterOnSubmit(e) {
        e.preventDefault()
        setPosts([])
        setPageNumber(1)
        setLoading(true)
        
        let URL = window.location.origin + '/api/posts/'
        let filterUrl = ''

        if (checked['Start'] === false) {
            URL += '?type='
            for (const [key, value] of Object.entries(checked)) {
                if (value==true) {
                    filterUrl += key + ' '
                }
            }
            URL += filterUrl
            setCurrentFilters(filterUrl)
        }

        setFilters(filters+1)
    }

    function searchOnChange(e) {
        setCurrentSearch(e.target.value)
    }

    function searchOnSubmit(e) {
        e.preventDefault()
        setPosts([])
        setLoading(true)
        setPageNumber(1)
        setWatchlistPopup(false)
        setTrendingPopup(false)
        setMedia(e.target.mediaSearch.value)
        setFilters(filters+1)
        setTrendingPopup(false)
    }

    function trendOnClick(e) {
        setHomeIcon('home-icon-selected')
        setTrendingIcon('')

        setPosts([])
        setCurrentSearch(e.target.innerText)
        setLoading(true)
        setPageNumber(1)
        setMedia(e.target.innerText)
        setFilters(filters+1)
        setTrendingPopup(false)
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

    function feedOnClick() {
        setHomeIcon("home-icon-selected")
        setStreamingIcon('')
        setTrendingIcon('')
        setSavedIcon('')
        setWatchlistIcon('')

        if (watchlistPopup == true) {
            setWatchlistPopup(false)
        } else if (trendingPopup == true) {
            setTrendingPopup(false)
        } else if (streamingPopup == true) {
            setStreamingPopup(false)
        } else {
            setLoading(true)
            setPosts([])
            setPageNumber(1)
            setMedia('')
            setCurrentSearch('')
            setCurrentFilters('Movie Anime Series Game Literature Other')
            setChecked({
                'Start': true,
                'Movie': true,
                'Anime': true,
                'Series': true,
                'Game': true,
                'Literature': true,
                'Other': true
            })
            setFilters(filters+1)
            setSaved("")
        }
        
    }

    function trendingOnClick() {
        setStreamingIcon('')
        setHomeIcon('')
        setTrendingIcon('home-icon-selected')
        setSavedIcon('')
        setWatchlistIcon('')

        setTrendingPopup(true)
        setWatchlistPopup(false)
        setSaved("")
        setStreamingPopup(false)
    }

    function streamingOnClick() {
        setStreamingIcon("home-icon-selected")
        setHomeIcon('')
        setTrendingIcon('')
        setSavedIcon('')
        setWatchlistIcon('')

        setStreamingPopup(true)
        setWatchlistPopup(false)
        setTrendingPopup(false)
        setSaved("")
    }

    function savedOnClick() {
        setStreamingIcon('')
        setHomeIcon('')
        setTrendingIcon('')
        setSavedIcon('home-icon-selected')
        setWatchlistIcon('')

        setLoading(true)
        setPosts([])
        setCurrentSearch('')
        setSaved("true")
        setChecked({
            'Start': true,
            'Movie': true,
            'Anime': true,
            'Series': true,
            'Game': true,
            'Literature': true,
            'Other': true
        })
        setCurrentFilters('Movie Anime Series Game Literature Other')
        setMedia('')
        setFilters(filters+1)
        setTrendingPopup(false)
        setStreamingPopup(false)
        setWatchlistPopup(false)
    }

    function watchlistOnClick() {
        setStreamingIcon('')
        setHomeIcon('')
        setTrendingIcon('')
        setSavedIcon('')
        setWatchlistIcon('home-icon-selected')

        setWatchlistPopup(true)
        setTrendingPopup(false)
        setStreamingPopup(false)
        setSaved('')
    }

    function postMediaOnClick(m) {
        setLoading(true)
        setPosts([])
        setPageNumber(1)
        setCurrentSearch(m)
        setMedia(m)
        setFilters(filters+1)
    }

    return (
        <div className="container-fluid homepage">

            {currentPost.author !== '' && <Post post={currentPost} postBackClick={postBackClick} currentProfile={currentProfile} 
            postMediaOnClick={postMediaOnClick} setAccountPopup={props.setAccountPopup}/>}
            <AdditionalNav>
                <div className="navbar-elements">
                    <div className="nav-text-element">
                        <p className="explore-nav-element">MediaReviewr</p>
                    </div>
                    <div className="all-element navbar-element home-nav-element" onClick={feedOnClick}>
                        <img className={"home-icon-image grey-icon " + homeIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Home-Current.png"></img>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Home-Additional.png"></img>

                        {trendingPopup === false && saved === '' && watchlistPopup === false && streamingPopup === false &&
                            <p className="icon-text icon-text-all">Feed</p>
                        }
                        {(trendingPopup || saved !== '' || watchlistPopup || streamingPopup) && 
                            <p className="icon-text">Feed</p>
                        }
                    </div>
                    
                    <div className="all-element navbar-element home-nav-element" onClick={streamingOnClick}>
                        <img className={"home-icon-image grey-icon " + streamingIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Streaming-Current.png"></img>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Streaming.png"></img>
                        {streamingPopup === false && 
                            <p className="icon-text">Streaming</p>
                        }
                        {streamingPopup && 
                            <p className="icon-text icon-text-streaming">Streaming</p>
                        }

                    </div>

                    <div className="all-element navbar-element home-nav-element" onClick={trendingOnClick}>
                        <img className={"home-icon-image grey-icon " + trendingIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Trending-Current.png"></img>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Trending.png"></img>

                        {trendingPopup === false && 
                            <p className="icon-text">Trending</p>
                        }
                        {trendingPopup && 
                            <p className="icon-text icon-text-trending">Trending</p>
                        }
                    </div>

                    {currentProfile.user !== '' && 
                    <div className="all-element navbar-element home-nav-element" onClick={savedOnClick}>
                        <img className={"home-icon-image grey-icon " + savedIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Saved-Current.png"></img>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Saved.png"></img>
                        {saved === '' && 
                            <p className="icon-text">Saved</p>
                        }
                        {saved && 
                            <p className="icon-text icon-text-saved">Saved</p>
                        }
                    </div>
                    }
                    {currentProfile.user === '' &&
                    <div className="all-element navbar-element home-nav-element" onClick={() => {
                        props.setAccountPopup(true)
                        }}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Saved.png"></img>
                        {saved === '' && 
                            <p className="icon-text">Saved</p>
                        }
                        {saved && 
                            <p className="icon-text icon-text-saved">Saved</p>
                        }
                    </div>
                    }

                    {currentProfile.user !== '' && 
                    <div className="all-element navbar-element home-nav-element" onClick={watchlistOnClick}>
                        <img className={"home-icon-image grey-icon " + watchlistIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist-Current.png"></img>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist.png"></img>
                        {!watchlistPopup && 
                            <p className="icon-text">Watchlist</p>
                        }
                        {watchlistPopup && 
                            <p className="icon-text icon-text-watchlist">Watchlist</p>
                        }
                    </div>
                    }
                    {currentProfile.user === '' &&
                    <div className="all-element navbar-element home-nav-element" onClick={() => {
                        props.setAccountPopup(true)
                        }}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist.png"></img>
                        {!watchlistPopup && 
                            <p className="icon-text">Watchlist</p>
                        }
                        {watchlistPopup && 
                            <p className="icon-text icon-text-watchlist">Watchlist</p>
                        }
                    </div>
                    }
                    
                    {currentProfile.user !== '' && 
                        <div className="all-element navbar-element home-nav-element" onClick={() => {navigate("/create-post/")}}>
                            <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Additional.png"></img>
                            <p className="icon-text">Create</p>
                        </div>
                    }
                    {currentProfile.user === '' && 
                        <div className="all-element navbar-element home-nav-element" onClick={() => {
                            props.setAccountPopup(true)
                            }}>
                            <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Additional.png"></img>
                            <p className="icon-text">Create</p>
                        </div>
                    }
                    
                    
                </div>
                

            </AdditionalNav>
            <nav className="home-phone-nav">
                    <form className="phone-search-form" onSubmit={searchOnSubmit}>
                        <input name="mediaSearch" className="media-searchbar" type="text" placeholder="Search for media" onChange={searchOnChange} value={currentSearch}></input>
                    </form>
                    {trendingPopup === false && saved === '' && watchlistPopup === false &&
                    <div className="all-element navbar-element" onClick={feedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Home-Current.png"></img>
                    </div>
                    }
                    {trendingPopup === true && 
                    <div className="all-element navbar-element" onClick={feedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/home-additional.png"></img>
                    </div>
                    }
                    {saved !== '' && 
                    <div className="all-element navbar-element" onClick={feedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/home-additional.png"></img>
                    </div>
                    }
                    {watchlistPopup && 
                    <div className="all-element navbar-element" onClick={feedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/home-additional.png"></img>
                    </div>
                    }
                    {trendingPopup === false && 
                    <div className="all-element navbar-element" onClick={trendingOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Trending.png"></img>
                    </div>
                    }
                    {trendingPopup === true && 
                    <div className="all-element navbar-element">
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Trending-Current.png"></img>
                    </div>
                    }
                    {saved === 'true' && 
                    <div className="all-element navbar-element" onClick={savedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Saved-Current.png"></img>
                    </div>
                    }
                    {saved !== 'true' && currentProfile.user !== '' &&
                    <div className="all-element navbar-element" onClick={savedOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Saved.png"></img>

                    </div>
                    }
                    {saved !== 'true' && currentProfile.user === '' &&
                    <div className="all-element navbar-element" onClick={() => {
                        props.setAccountPopup(true)
                    }}>
                    <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Saved.png"></img>
                    </div>
                    }
                    {watchlistPopup &&
                    <div className="all-element navbar-element" onClick={watchlistOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist-Current.png"></img>
                    </div>
                    }
                    {watchlistPopup === false && currentProfile.user !== '' &&  
                    <div className="all-element navbar-element" onClick={watchlistOnClick}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist.png"></img>
                    </div>
                    }
                    {watchlistPopup === false && currentProfile.user === '' &&  
                    <div className="all-element navbar-element" onClick={() => {
                        props.setAccountPopup(true)
                        }}>
                        <img className="home-icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Watchlist.png"></img>
                    </div>
                    }
            </nav>
            <div className="row">
                <div className="col-3 column-1">
                
                </div>
                <div className="col-6 column-2">
                    <TrendingPopup trigger={trendingPopup} setTrigger={setTrendingPopup} trending={trendingTotal} trendOnClick={trendOnClick}/>
                    <StreamingPopup setHomeIcon={setHomeIcon} trigger={streamingPopup} setTrigger={setStreamingPopup} setStreaming1={setStreaming1} setLoading={setLoading} setStreamingIcon={setStreamingIcon}
                     setStreaming2={setStreaming2} setStreaming3={setStreaming3} setStreaming4={setStreaming4} setStreaming5={setStreaming5} setFilters={setFilters} filters={filters}/>
                    <Watchlist trigger={watchlistPopup} setTrigger={setWatchlistPopup} currentProfile={currentProfile} setCurrentProfile={setCurrentProfile}/>
                </div>
            </div>
            <div className="row">
                <div className="col-3 column-1">
                    
                </div>
                <div className="col-6 column-2 feed-col">
                    <div className="center-piece">
                    
                        <div className="feed">
                            
                            <div className="post-create-btn-container">
                                {currentProfile.user !== '' && 
                                <div onClick={() => navigate("/create-post/")} className="post-create-btn">
                                    <span className="post-create-plus">&#43;</span>
                                    <div className="post-create-text">
                                        <h3 className="post-create-btn-title">Create post</h3>
                                        <p className="post-create-btn-text">Share your thoughts.</p>
                                    </div>
                                </div>
                                }
                                {currentProfile.user === '' && 
                                <div onClick={() => {
                                    props.setAccountPopup(true)
                                    }} className="post-create-btn">
                                    <span className="post-create-plus">&#43;</span>
                                    <div className="post-create-text">
                                        <h3 className="post-create-btn-title">Create post</h3>
                                        <p className="post-create-btn-text">Share your thoughts.</p>
                                    </div>
                                </div>
                                }
                                 
                            </div>

                            <form className="media-search-form" onSubmit={searchOnSubmit}>
                                <div className="media-search-container">
                                    <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                                    <input name="mediaSearch" className="media-searchbar" type="text" placeholder="Search for media" onChange={searchOnChange} value={currentSearch}></input>
                                    <button className="search-button" type="submit">
                                        Search
                                    </button>
                                </div>
                            </form>

                            <form className="filters" onSubmit={filterOnSubmit}>
                                <div className="filter-container">
                                    <input name="Movie" className="filter filter-movie" type="checkbox" checked={checked.Movie} onChange={handleOnChange}></input>
                                    <label className="filter-label">Movie</label>
                                </div>
                                <div className="filter-container">
                                    <input name="Anime" className="filter filter-anime" type="checkbox" checked={checked.Anime} onChange={handleOnChange}></input>
                                    <label className="filter-label">Anime</label>
                                </div>
                                <div className="filter-container">
                                    <input name="Series" className="filter filter-series" type="checkbox" checked={checked.Series} onChange={handleOnChange}></input>
                                    <label className="filter-label">Series</label>
                                </div>
                                <div className="filter-container">
                                    <input name="Game" className="filter filter-game" type="checkbox" checked={checked.Game} onChange={handleOnChange}></input>
                                    <label className="filter-label">Game</label>
                                </div>
                                <div className="filter-container">
                                    <input name="Literature" className="filter filter-literature" type="checkbox" checked={checked.Literature} onChange={handleOnChange}></input>
                                    <label className="filter-label">Literature</label>
                                </div>
                                <div className="filter-container">
                                    <input name="Other" className="filter filter-other" type="checkbox" checked={checked.Other} onChange={handleOnChange}></input>
                                    <label className="filter-label">Other</label>
                                </div>
                                <button className="filter-button" type="submit">
                                    Confirm
                                </button>
                            </form>

                            <button className="streaming-button-phone" onClick={() => {
                                setStreamingPopup(true)
                            }}>
                                Filter by Streaming Platforms
                            </button>

                            {averageRating !== '' && loading === false &&
                                <div className="search-media-container">
                                    <p className="search-media-title">{mediaName}</p>
                                    <div className="post-rating-container search-media-rating-container">
                                    <div className="stars-container">  
                                        <p className="average-rating">{Math.round(averageRating)}%</p>
                                        <div className="stars-container-color">
                                        </div>
                                        <div className={"right-part-rating-element rating-" + averageRating.toString()}></div>
                                    </div>
                                    </div>
                                </div>
                            }
                            
                            {loading && 
                            <div>
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
                            {posts.map((post, index) => {
                                if (posts.length === index + 1) {
                                    return (
                                        <div ref={lastPostElementRef} key={post.id} className="last-element">
                                            <PostElement
                                            {...post}
                                            postOnClick={postOnClick}
                                            currentProfile={currentProfile}
                                            postMediaOnClick={postMediaOnClick}
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
                                        postMediaOnClick={postMediaOnClick}
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
                <div className="col-3 column-3">

                </div>
                
                
            </div>
        </div>
    )
    
}