import React, { useState, useRef, useCallback } from 'react';
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'
import { useNavigate } from "react-router"

export default function PostStreamingPopup(props) {

    const [outside, setOutside] = React.useState(true)
    const [clicks, setClicks] = React.useState(0)

    const [checked, setChecked] = React.useState({
        'Netflix': false,
        'HBOMax': false,
        'PrimeVideo': false,
        'Disney': false,
        'Hulu': false,
    })

    React.useEffect(() => {
        if (outside === true) {
            props.setTrigger(false)
        }
    }, [clicks])

    function handleOnChange(e) {
        setChecked({...checked, 'Start': false, [e.target.name]: !checked[e.target.name] })
    }

    function formOnSubmit(e) {
        e.preventDefault()
        if (checked['Netflix'] === true) {
            props.setStreaming1('Netflix')
        } else {
            props.setStreaming1('')
        }
        
        if (checked['HBOMax'] === true) {
            props.setStreaming2('HBOMax')
        } else {
            props.setStreaming2('')
        }
        
        if (checked['PrimeVideo'] === true) {
            props.setStreaming3('PrimeVideo')
        } else {
            props.setStreaming3('')
        }

        if (checked['Disney'] === true) {
            props.setStreaming4('Disney')
        } else {
            props.setStreaming4('')
        }

        if (checked['Hulu'] === true) {
            props.setStreaming5('Hulu')
        } else {
            props.setStreaming5('')
        }
        props.setTrigger(false)
    }

    return (props.trigger) ? (
        <div className="post-streaming-popup-container" onClick={() => {setClicks(clicks+1)}}>
            <div className="post-streaming-popup-inner" onMouseEnter={() => {setOutside(false)}} onMouseLeave={() => {setOutside(true)}}>
                <h2 className="streaming-title">Streaming Platforms</h2>
                <p className="post-streaming-info">Users can filter by where media can be streamed. Posts where the user hasn't uploaded which streaming services the media can be viewed on may not perform as well as they would have.
                
                Try using <a href="https://www.justwatch.com/" target="_blank">this website</a> to browse where your media can be streamed</p>
                <div className="streaming-container">
                    <form className="streaming-form" onSubmit={formOnSubmit}>
                        <div className="post-streaming-element">
                            <input name="Netflix" className="post-streaming-filter streaming-filter-netflix" type="checkbox" checked={checked.Netflix} onChange={handleOnChange}></input>
                            <label className="streaming-label">Netflix</label>
                        </div>
                        <div className="post-streaming-element">
                            <input name="HBOMax" className="post-streaming-filter streaming-filter-hbomax" type="checkbox" checked={checked.HBOMax} onChange={handleOnChange}></input>
                            <label className="streaming-label">HBO Max</label>
                        </div>
                        <div className="post-streaming-element">
                            <input name="PrimeVideo" className="post-streaming-filter streaming-filter-primevideo" type="checkbox" checked={checked.PrimeVideo} onChange={handleOnChange}></input>
                            <label className="streaming-label">Prime Video</label>
                        </div>
                        <div className="post-streaming-element">
                            <input name="Disney" className="post-streaming-filter streaming-filter-disney" type="checkbox" checked={checked.Disney} onChange={handleOnChange}></input>
                            <label className="streaming-label">Disney+</label>
                        </div>
                        <div className="post-streaming-element">
                            <input name="Hulu" className="post-streaming-filter streaming-filter-hulu" type="checkbox" checked={checked.Hulu} onChange={handleOnChange}></input>
                            <label className="streaming-label">Hulu</label>
                        </div>
                        <button type="submit" className="streaming-button-submit">Confirm</button>
                    </form>
                </div>
            </div>      
        </div>
        
    ): '';
}