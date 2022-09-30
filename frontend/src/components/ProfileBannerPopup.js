import React, { useState, useRef, useCallback } from 'react';
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'
import { useNavigate } from "react-router"
import GroupInfoPopup from "./GroupInfoPopup"

export default function ProfileBannerPopup(props) {

    const [name, setName] = React.useState('')

    const bannerOnChange = (e) => {
        props.setClicks(props.clicks+1)
        props.setBanner(e.target.files[0])

    };

    React.useEffect(() => {
        setName(props.currentProfile.name)
    }, [props.currentProfile.name])

    return (props.trigger) ? (
        <div className="banner-popup">
            <div className="banner-popup-inner">
                <button className="close-btn-list close-btn-banner" onClick={() => {props.setTrigger(false)}}>Done</button>
                <h3 className="profile-create-name">{name}</h3>
                <div className="profile-create-banner-container">
                    <label className="profile-banner-upload">
                    <input className="profile-create-banner" name="banner" key="file-upload" type="file" accept="image/*" onChange={bannerOnChange} />
                    {props.bannerURL && 
                    <img src={props.bannerURL} className="profile-create-uploaded-banner"></img>
                    }
                
                    </label>
                </div>
                
            </div>         
        </div>
    ): '';
}