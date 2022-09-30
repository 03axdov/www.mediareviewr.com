import React from 'react'

function StreamingPopup(props) {
    const [checked, setChecked] = React.useState({
        'Start': true,
        'Netflix': true,
        'HBOMax': true,
        'PrimeVideo': true,
        'Disney': true,
        'Hulu': true,
    })

    function handleOnChange(e) {
        setChecked({...checked, 'Start': false, [e.target.name]: !checked[e.target.name] })
    }

    function formOnSubmit(e) {
        e.preventDefault()
        if (checked['Netflix'] === true) {
            props.setStreaming1('Netflix')
        } else {
            props.setStreaming1('None')
        }
        
        if (checked['HBOMax'] === true) {
            props.setStreaming2('HBOMax')
        } else {
            props.setStreaming2('None')
        }
        
        if (checked['PrimeVideo'] === true) {
            props.setStreaming3('PrimeVideo')
        } else {
            props.setStreaming3('None')
        }

        if (checked['Disney'] === true) {
            props.setStreaming4('Disney')
        } else {
            props.setStreaming4('None')
        }

        if (checked['Hulu'] === true) {
            props.setStreaming5('Hulu')
        } else {
            props.setStreaming5('None')
        }
        props.setLoading(true)
        props.setStreamingIcon('')
        props.setHomeIcon('home-icon-selected')
        props.setFilters(props.filters+1)
        props.setTrigger(false)
    }

    return (props.trigger) ? (
        <div className="streaming-popup">
            <div className="streaming-popup-container">
                <h2 className="streaming-title">Streaming Platforms</h2>
                <p className="streaming-info">Filter by where media can be streamed. Posts where the user hasn't uploaded any streaming service may still appear in your feed.
                Selecting all services will also show posts where the author hasn't specified any streaming services. Be aware that some media may not be available in your particular country.
                </p>
                <div className="streaming-container">
                    <form className="streaming-form" onSubmit={formOnSubmit}>
                        <div className="streaming-element">
                            <input name="Netflix" className="streaming-filter streaming-filter-netflix" type="checkbox" checked={checked.Netflix} onChange={handleOnChange}></input>
                            <label className="streaming-label">Netflix</label>
                        </div>
                        <div className="streaming-element">
                            <input name="HBOMax" className="streaming-filter streaming-filter-hbomax" type="checkbox" checked={checked.HBOMax} onChange={handleOnChange}></input>
                            <label className="streaming-label">HBO Max</label>
                        </div>
                        <div className="streaming-element">
                            <input name="PrimeVideo" className="streaming-filter streaming-filter-primevideo" type="checkbox" checked={checked.PrimeVideo} onChange={handleOnChange}></input>
                            <label className="streaming-label">Prime Video</label>
                        </div>
                        <div className="streaming-element">
                            <input name="Disney" className="streaming-filter streaming-filter-disney" type="checkbox" checked={checked.Disney} onChange={handleOnChange}></input>
                            <label className="streaming-label">Disney+</label>
                        </div>
                        <div className="streaming-element">
                            <input name="Hulu" className="streaming-filter streaming-filter-hulu" type="checkbox" checked={checked.Hulu} onChange={handleOnChange}></input>
                            <label className="streaming-label">Hulu</label>
                        </div>
                        <button type="submit" className="streaming-button-submit">Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    ) : "";
}

export default StreamingPopup