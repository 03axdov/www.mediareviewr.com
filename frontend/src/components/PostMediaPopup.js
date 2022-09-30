import React from 'react'

function PostMediaPopup(props) {
  return (props.trigger) ? (
    <div className="post-media-popup">
        <p className="media-label">Choose a media type</p>
        <div className="media-row">
            <div className="media-container media-movie" onClick={() => props.mediaOnClick('Movie')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">M</p></span>
                    <p className="post-media-text">Movie</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            <div className="media-container media-anime" onClick={() => props.mediaOnClick('Anime')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">A</p></span>
                    <p className="post-media-text">Anime</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            <div className="media-container media-series" onClick={() => props.mediaOnClick('Series')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">S</p></span>
                    <p className="post-media-text">Series</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            <div className="media-container media-game" onClick={() => props.mediaOnClick('Game')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">G</p></span>
                    <p className="post-media-text">Game</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            <div className="media-container media-literature" onClick={() => props.mediaOnClick('Literature')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">L</p></span>
                    <p className="post-media-text">Literature</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            {props.group === false && 
            <div className="media-container media-other" onClick={() => props.mediaOnClick('Other')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">O</p></span>
                    <p className="post-media-text">Other</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            }
            {props.group === true && 
            <div className="media-container media-other" onClick={() => props.mediaOnClick('Any')}>
                <div className="post-media-content">
                    <span className="post-media-symbol"><p className="post-media-image">A</p></span>
                    <p className="post-media-text">Any</p>
                    <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                </div>
            </div>
            }
            
        </div>     
    </div>
  ) : "";
}

export default PostMediaPopup