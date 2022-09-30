import React, { useState, useRef, useCallback } from 'react';
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'
import { useNavigate } from "react-router"
import GroupInfoPopup from "./GroupInfoPopup"

export default function Groups(props) {

    let navigate = useNavigate()

    const [groupList, setGroupList] = React.useState([])

    const [pageNumber, setPageNumber] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [hasMore, setHasMore] = React.useState(false)

    const [filters, setFilters] = React.useState('')
    const [currentSearch, setCurrentSearch] = React.useState('')
    const [infoPopup, setInfoPopup] = React.useState(false)

    const [searchCount, setSearchCount] = React.useState(0)

    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
    })

    const [allIcon, setAllIcon] = React.useState('home-icon-selected')
    const [movieIcon, setMovieIcon] = React.useState('')
    const [animeIcon, setAnimeIcon] = React.useState('')
    const [seriesIcon, setSeriesIcon] = React.useState('')
    const [gameIcon, setGameIcon] = React.useState('')
    const [literatureIcon, setLiteratureIcon] = React.useState('')

    const observer = useRef()
    const lastGroupElementRef = useCallback(node => {
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
        document.title = "MediaReviewr | Groups"
    }, [])

    React.useEffect(() => {
        setCurrentProfile(props.currentProfile)
    }, [props])


    React.useEffect(() => {
        setError(false)
        setLoading(true)
        
        axios({
            method: 'GET',
            url: window.location.origin + '/api/groups/',
            params: {type:filters, page:pageNumber, name:currentSearch}
        }).then(res => {
            setGroupList(prevGroups => {

                let arr = [...prevGroups, ...res.data.results]
                const ids = arr.map(o => o.id)
                const filtered = arr.filter(({id}, index) => !ids.includes(id, index + 1))
                
                return filtered
            })
            setLoading(false)

        }).catch(e => {
            setError(true)
            console.log(e)
        })

    }, [filters, searchCount])

    function allOnClick() {
        setAllIcon('home-icon-selected')
        setMovieIcon('')
        setAnimeIcon('')
        setSeriesIcon('')
        setGameIcon('')
        setLiteratureIcon('')

        if (filters !== "") {
            setGroupList([])
            setFilters("")
        }
    }
    function movieOnClick() {
        setAllIcon('')
        setMovieIcon('home-icon-selected')
        setAnimeIcon('')
        setSeriesIcon('')
        setGameIcon('')
        setLiteratureIcon('')

        if (filters !== "Movie") {
            setGroupList([])
            setFilters("Movie")
        }
    }
    function animeOnClick() {
        setAllIcon('')
        setMovieIcon('')
        setAnimeIcon('home-icon-selected')
        setSeriesIcon('')
        setGameIcon('')
        setLiteratureIcon('')

        if (filters !== "Anime") {
            setGroupList([])
            setFilters("Anime")
        }
    }
    function seriesOnClick() {
        setAllIcon('')
        setMovieIcon('')
        setAnimeIcon('')
        setSeriesIcon('home-icon-selected')
        setGameIcon('')
        setLiteratureIcon('')

        if (filters !== "Series") {
            setGroupList([])
            setFilters("Series")
        }
    }
    function gameOnClick() {
        setAllIcon('')
        setMovieIcon('')
        setAnimeIcon('')
        setSeriesIcon('')
        setGameIcon('home-icon-selected')
        setLiteratureIcon('')

        if (filters !== "Game") {
            setGroupList([])
            setFilters("Game")
        }
    }
    function literatureOnClick() {
        setAllIcon('')
        setMovieIcon('')
        setAnimeIcon('')
        setSeriesIcon('')
        setGameIcon('')
        setLiteratureIcon('home-icon-selected')

        if (filters !== "Literature") {
            setGroupList([])
            setFilters("Literature")
        }
    }

    function searchOnSubmit(e) {
        e.preventDefault()
        setGroupList([])
        setLoading(true)
        setCurrentSearch(e.target.elements.groupSearch.value)
        setSearchCount(searchCount + 1)
    }

    function infoOnClick() {
        setInfoPopup(true)
    }

    return (
        <div className="groups-container">
            <GroupInfoPopup trigger={infoPopup} setTrigger={setInfoPopup}/>
            <AdditionalNav>
                <div className="navbar-elements navbar-elements-groups">
                    <div className="nav-text-element">
                        <p className="explore-nav-element">Groups</p>
                    </div>

                    <div className="all-element navbar-element navbar-element-group" onClick={allOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Additional.png"></img>
                        <img className={"icon-image grey-icon " + allIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Current.png"></img>
                        
                        {filters == '' && 
                            <p className="icon-text icon-text-all">All</p>
                        }
                        {filters !== '' && 
                            <p className="icon-text">All</p>
                        }
                    </div>

                    <div className="all-element navbar-element navbar-element-group" onClick={movieOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Movie-Navbar.png"></img>
                        <img className={"icon-image grey-icon " + movieIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Movie.png"></img>
                        
                        {filters == 'Movie' && 
                            <p className="icon-text icon-text-movie">Movies</p>
                        }
                        {filters !== 'Movie' && 
                            <p className="icon-text">Movies</p>
                        }
                    </div>
                

                    <div className="all-element navbar-element navbar-element-group" onClick={animeOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Anime-Navbar.png"></img>
                        <img className={"icon-image grey-icon " + animeIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Anime.png"></img>
                        
                        {filters == 'Anime' && 
                            <p className="icon-text icon-text-anime">Anime</p>
                        }
                        {filters !== 'Anime' && 
                            <p className="icon-text">Anime</p>
                        }
                    </div>

                    <div className="all-element navbar-element navbar-element-group" onClick={seriesOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Series-Navbar.png"></img>
                        <img className={"icon-image grey-icon " + seriesIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Series.png"></img>
                        
                        {filters == 'Series' && 
                            <p className="icon-text icon-text-series">Series</p>
                        }
                        {filters !== 'Series' && 
                            <p className="icon-text">Series</p>
                        }
                    </div>

                    <div className="all-element navbar-element navbar-element-group" onClick={gameOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Game-Navbar.png"></img>
                        <img className={"icon-image grey-icon " + gameIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Game.png"></img>
                        
                        {filters == 'Game' && 
                            <p className="icon-text icon-text-game">Games</p>
                        }
                        {filters !== 'Game' && 
                            <p className="icon-text">Games</p>
                        }
                    </div>

                    <div className="all-element navbar-element navbar-element-group" onClick={literatureOnClick}>
                        <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Literature-Navbar.png"></img>
                        <img className={"icon-image grey-icon " + literatureIcon} src="https://mediareviewer.s3.amazonaws.com/static/images/Literature.png"></img>
                        
                        {filters == 'Literature' && 
                            <p className="icon-text icon-text-literature">Literature</p>
                        }
                        {filters !== 'Literature' && 
                            <p className="icon-text">Literature</p>
                        }
                    </div>

                    {currentProfile.user !== '' && 
                        <div className="all-element navbar-element navbar-groups-create navbar-element-group" onClick={() => {navigate("/create-group/")}}>
                            <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Additional.png"></img>
                            <p className="icon-text">Create</p>
                        </div>
                    }
                    {currentProfile.user === '' && 
                        <div className="all-element navbar-element navbar-groups-create navbar-element-group" onClick={() => {
                            props.setAccountPopup(true)
                            }}>
                            <img className="icon-image" src="https://mediareviewer.s3.amazonaws.com/static/images/Plus-Additional.png"></img>
                            <p className="icon-text">Create</p>
                        </div>
                    }

                    
                </div>
                
            </AdditionalNav>
            <div className="groups-header">
                <h1 className="groups-header-label">Discover posts from your favorite subgenres.</h1>
                <label className="groups-header-text">Anyone can create a group and anyone can upload a review or post to a group.</label>
                
                <form onSubmit={searchOnSubmit} className="group-search-form">
                    <div className="group-search-container">
                        <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                        <input name="groupSearch" type="text" placeholder="Explore groups" className="groups-header-input"></input>
                    </div>
                    
                </form>
                
                {currentProfile.user !== '' && 
                <div className="group-create-plus" onClick={() => {navigate("/create-group/")}}>
                    <img className="group-create" src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Create.png"></img>
                </div>
                }
                {currentProfile.user === '' && 
                <div className="group-create-plus" onClick={() => {
                    props.setAccountPopup(true)
                    }}>
                    <img className="group-create" src="https://mediareviewer.s3.amazonaws.com/static/images/Group-Create.png"></img>
                </div>
                }
                
                <div className="group-info-container" onClick={infoOnClick}>
                    <img className="group-info" src="https://mediareviewer.s3.amazonaws.com/static/images/Info.png"></img>
                </div>
            </div>

            {loading && 
                <div className="groups-feed">
                        <div className="post-create-btn-container group-create-btn-phone">
                        {currentProfile.user !== '' && 
                        <div onClick={() => navigate("/create-group/")} className="post-create-btn group-create-btn-hidden">
                            <span className="group-create-plus-btn">&#43;</span>
                            <div className="post-create-text">
                                <h3 className="post-create-btn-title">Create group</h3>
                                <p className="group-create-btn-text">Help users find posts they're looking for.</p>
                            </div>
                        </div>
                        }
                        {currentProfile.user === '' && 
                        <div onClick={() => {
                            props.setAccountPopup(true)
                            }} className="post-create-btn group-create-btn-hidden">
                            <span className="group-create-plus-btn">&#43;</span>
                            <div className="post-create-text">
                                <h3 className="post-create-btn-title">Create group</h3>
                                <p className="group-create-btn-text">Help users find posts they're looking for.</p>
                            </div>
                        </div>
                        }
                        
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                        <div className="group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading">
                            </div>
                            <p className="group-name-loading"></p>
                            <p className="group-description-loading"></p>
                            <div className="members-container">
                                <p className="members-count-loading"></p>
                            </div>
                            <div className="group-type-container">
                                <p className="group-type-loading"></p>
                            </div>
                        </div>
                    </div>
            }
            {loading === false && 
            <div className="groups-feed">
            <div className="post-create-btn-container group-create-btn-phone">
                {currentProfile.user !== '' && 
                <div onClick={() => navigate("/create-group/")} className="post-create-btn group-create-btn-hidden">
                    <span className="group-create-plus-btn">&#43;</span>
                    <div className="post-create-text">
                        <h3 className="post-create-btn-title">Create group</h3>
                        <p className="group-create-btn-text">Help users find posts they're looking for.</p>
                    </div>
                </div>
                }
                {currentProfile.user === '' && 
                <div onClick={() => {
                    props.setAccountPopup(true)
                    }} className="post-create-btn group-create-btn-hidden">
                    <span className="group-create-plus-btn">&#43;</span>
                    <div className="post-create-text">
                        <h3 className="post-create-btn-title">Create group</h3>
                        <p className="group-create-btn-text">Help users find posts they're looking for.</p>
                    </div>
                </div>
                }
                
            </div>
            {groupList.map((group, index) => {
                if (groupList.length === index + 1) {
                    return (
                        <div ref={lastGroupElementRef} className="group-container" key={group.id} onClick={() => {
                            navigate("/groups/" + group.name.toString())
                            }}>
                            <img className="group-header" src={group.header_image}></img>
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
                            <div className="group-type-container">
                                <p className="group-type">{group.type}</p>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="group-container" key={group.id} onClick={() => {
                            navigate("/groups/" + group.name.toString())
                            }}>
                            <img className="group-header" src={group.header_image}></img>
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
                            <div className="group-type-container">
                                <p className="group-type">{group.type}</p>
                            </div>
                        </div>
                    )
                }
                }
                
            )}
            
            </div>
            }
            
        </div>
    )

}