import React, { useState, useRef, useCallback } from 'react';
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'
import { useNavigate } from "react-router"
import GroupInfoPopup from "./GroupInfoPopup"

export default function PostGroupPopup(props) {

    const [groupList, setGroupList] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [filters, setFilters] = React.useState('')
    const [currentSearch, setCurrentSearch] = React.useState('')
    const [getGroups, setGetGroups] = React.useState(0)
    const [hasMore, setHasMore] = React.useState(false)

    const [outside, setOutside] = React.useState(true)
    const [clicks, setClicks] = React.useState(0)

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
        if (outside === true) {
            props.setTrigger(false)
        }
    }, [clicks])

    React.useEffect(() => {
        setGroupList([])
        setError(false)
        setLoading(true)
        
        axios({
            method: 'GET',
            url: window.location.origin + '/api/groups/',
            params: {type:filters, name:currentSearch, isPost:true}
        }).then(res => {
            setLoading(false)
            setGroupList(res.data.results)

        }).catch(e => {
            setError(true)
            console.log(e)
        })

    }, [filters, currentSearch, getGroups])

    function searchOnSubmit(e) {
        e.preventDefault()
        setGroupList([])
        setLoading(true)
        setGetGroups(getGroups+1)
        setLoading(true)
        setCurrentSearch(e.target.elements.groupSearch.value)
    }

    return (props.trigger) ? (
        <div>
        <div className="post-group-popup-container" onClick={() => {setClicks(clicks+1)}}>
            <div className="post-group-popup-inner" onMouseEnter={() => {setOutside(false)}} onMouseLeave={() => {setOutside(true)}}>
                <img className="close-btn close-btn-post-group" onClick={() => {
                    setCurrentSearch('')
                    props.setTrigger(false)
                    }} src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" />
                <div className="groups-header">
                    <h1 className="groups-header-label">Discover your favorite subgenres.</h1>
                    <label className="groups-header-text">Anyone can create a custom group. The possibilities are endless.</label>
                    
                    <form onSubmit={searchOnSubmit} className="group-search-form-popup">
                        <div className="group-search-container">
                            <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                            <input name="groupSearch" type="text" placeholder="Explore groups" className="groups-header-input"></input>
                        </div>
                    </form>

                </div>
                {loading && 
                    <div className="group-popup-feed">
                        <div className="post-group-container post-group-cancel-container">
                            <img className="cancel-group-btn" src="https://mediareviewer.s3.amazonaws.com/static/images/X.png"></img>
                        </div>
                        <div className="post-group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading post-group-image-small">
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
                        <div className="post-group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading post-group-image-small">
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
                        <div className="post-group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading post-group-image-small">
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
                        <div className="post-group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading post-group-image-small">
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
                        <div className="post-group-container">
                            <div className="group-header-loading">
                            </div>
                            <div className="group-image-small-loading post-group-image-small">
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
                {!loading && 
                    <div className="group-popup-feed">
                    <div className="post-group-container post-group-cancel-container" onClick={() => {
                        if (props.currentGroup === 1) {
                            props.setGroup1('')
                            props.setGroup1Value(0)
                            props.setTrigger(false)
                            setCurrentSearch('')
                        }
                        if (props.currentGroup === 2) {
                            props.setGroup2('')
                            props.setGroup2Value(0)
                            props.setTrigger(false)
                            setCurrentSearch('')
                        }
                        if (props.currentGroup === 3) {
                            props.setGroup3('')
                            props.setGroup3Value(0)
                            props.setTrigger(false)
                            setCurrentSearch('')
                        }
                    }
                    }>
                    <img className="cancel-group-btn" src="https://mediareviewer.s3.amazonaws.com/static/images/X.png"></img>
                    </div>
                    
                    {groupList.map((group, index) => {
                            return (
                            <div className="post-group-container" key={group.id} onClick={() => {
                                if (props.currentGroup === 1) {
                                    props.setGroup1(group.name)
                                    props.setGroup1Value(group.id)
                                    props.setTrigger(false)
                                }
                                if (props.currentGroup === 2) {
                                    props.setGroup2(group.name)
                                    props.setGroup2Value(group.id)
                                    props.setTrigger(false)
                                }
                                if (props.currentGroup === 3) {
                                    props.setGroup3(group.name)
                                    props.setGroup3Value(group.id)
                                    props.setTrigger(false)
                                }
                            }
                            }>
                                <img className="group-header" src={group.header_image}></img>
                                <img className="group-image-small post-group-image-small" src={group.image}></img>
                                {group.name.length <= 24 && 
                                    <p className="group-name">{group.name}</p>
                                }
                                {group.name.length > 24 && 
                                    <p className="group-name">{group.name.substring(0, 20)}...</p>
                                }
                                
                                {group.description.length <= 110 && 
                                    <p className="group-description">{group.description}</p>
                                }
                                {group.description.length > 110 && 
                                    <p className="group-description">{group.description.substring(0,110)}...</p>
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
                        
                    )}
                </div>
                }
                
                
            </div>         
        </div>
        <div className="post-group-popup-container-phone">
            <div className="post-group-popup-inner">
                <img className="close-btn close-btn-post-group" onClick={() => {
                    setCurrentSearch('')
                    props.setTrigger(false)
                    }} src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" />
                <div className="groups-header">
                    <h1 className="groups-header-label">Discover your favorite subgenres.</h1>
                    <label className="groups-header-text">Anyone can create a custom group. The possibilities are endless.</label>
                    
                    <form onSubmit={searchOnSubmit} className="group-search-form-popup">
                        <div className="group-search-container">
                            <img className="search-icon" src="https://mediareviewer.s3.amazonaws.com/static/images/Search.png"></img>
                            <input name="groupSearch" type="text" placeholder="Explore groups" className="groups-header-input"></input>
                        </div>
                    </form>

                </div>

                <div className="group-popup-feed">
                    {loading && <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
                    {loading === false && 
                        <div className="post-group-container post-group-cancel-container" onClick={() => {
                            if (props.currentGroup === 1) {
                                props.setGroup1('')
                                props.setGroup1Value(0)
                                props.setTrigger(false)
                                setCurrentSearch('')
                            }
                            if (props.currentGroup === 2) {
                                props.setGroup2('')
                                props.setGroup2Value(0)
                                props.setTrigger(false)
                                setCurrentSearch('')
                            }
                            if (props.currentGroup === 3) {
                                props.setGroup3('')
                                props.setGroup3Value(0)
                                props.setTrigger(false)
                                setCurrentSearch('')
                            }
                        }
                        }>
                            <img className="cancel-group-btn" src="https://mediareviewer.s3.amazonaws.com/static/images/X.png"></img>
                        </div>
                    }
                    {groupList.map((group, index) => {
                            return (
                            <div className="post-group-container" key={group.id} onClick={() => {
                                if (props.currentGroup === 1) {
                                    props.setGroup1(group.name)
                                    props.setGroup1Value(group.id)
                                    props.setTrigger(false)
                                }
                                if (props.currentGroup === 2) {
                                    props.setGroup2(group.name)
                                    props.setGroup2Value(group.id)
                                    props.setTrigger(false)
                                }
                                if (props.currentGroup === 3) {
                                    props.setGroup3(group.name)
                                    props.setGroup3Value(group.id)
                                    props.setTrigger(false)
                                }
                            }
                            }>
                                <img className="group-header" src={group.header_image}></img>
                                <img className="group-image-small post-group-image-small" src={group.image}></img>
                                {group.name.length <= 24 && 
                                    <p className="group-name">{group.name}</p>
                                }
                                {group.name.length > 24 && 
                                    <p className="group-name">{group.name.substring(0, 20)}...</p>
                                }
                                
                                {group.description.length <= 110 && 
                                    <p className="group-description">{group.description}</p>
                                }
                                {group.description.length > 110 && 
                                    <p className="group-description">{group.description.substring(0,110)}...</p>
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
                        
                    )}
                </div>
            </div>         
        </div>
        </div>
        
    ): '';
}