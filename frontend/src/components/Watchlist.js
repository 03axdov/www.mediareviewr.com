import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router"
import PostElement from "./PostElement"
import Popup from "./Popup"
import Post from "./Post"
import TrendingPopup from "./TrendingPopup"
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'

export default function Watchlist(props) {
    const [currentProfile, setCurrentProfile] = React.useState({
        user: '',
        name: '',
        following: [],
        following_names: [],
        following_pictures: [],
        following_statuses: [],
        watchlist: ''
    })

    let navigate = useNavigate()

    React.useEffect(() => {
        setCurrentProfile(props.currentProfile)
    }, [props])

    function watchlistOnSubmit(e) {
        e.preventDefault()
        axios.defaults.withCredentials = true;
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
        axios.defaults.xsrfCookieName = 'csrftoken';

        const URL = window.location.origin + '/api/update-watchlist/'
        const config = {headers: {'Content-Type': 'application/json'}}

        axios.post(URL, currentProfile.watchlist, config)
        .then((res) => {
            props.setCurrentProfile({...currentProfile, watchlist: res.data.watchlist})
            console.log("COMPLETE")
        })
        .catch((err) => console.log(err))
    }

    function watchlistOnChange(e) {
        setCurrentProfile({ ...currentProfile, watchlist:e.target.value})
    }

    return (props.trigger) ? (
        <div className="container-fluid watchlist-container">
            <div className="watchlist-inner">
                <h1 className="watchlist-title">{currentProfile.name}'s Watchlist</h1>
                <form className="watchlist-form" onSubmit={watchlistOnSubmit}>
                    <textarea className="watchlist" value={currentProfile.watchlist} onChange={watchlistOnChange} placeholder="Write something..."></textarea>
                    {currentProfile.watchlist === props.currentProfile.watchlist && 
                        <button type="submit" className="form-submit-button watchlist-submit-saved">Saved</button>
                    }
                    {currentProfile.watchlist !== props.currentProfile.watchlist && 
                        <button type="submit" className="form-submit-button watchlist-submit-save">Save</button>
                    }
                </form>
            </div>
        </div>
    ) : "";
    
}