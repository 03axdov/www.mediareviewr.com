import React, { useState } from "react";
import FormInput from "./FormInput";
import jQuery from 'jquery';  // important dependency
import { useNavigate } from "react-router"
import axios from 'axios'

export default function PostTypePage() {
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        window.setTimeout(loadingFalse, 1);
    }, [])

    function loadingFalse() {
        setLoading(false);
    }

    React.useEffect(() => {
        document.title = "MediaReviewr | Create post"
    }, [])

    let navigate = useNavigate();

    return (
        <div>
            {loading === false && 
            <div className="post-type-container">
                <p className="post-type-title">Choose a post type</p>
                <div className="post-types">
                    <div className="review-type-btn" onClick={() => navigate("/create-post/review")}>
                        <div className="post-type-content">
                            <span className="post-type-symbol"><p className="post-type-symbol-text">Aa</p></span>
                            <p className="post-type-text">Create a review</p>
                            <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                        </div>
                    </div>
                    <div className="character-review-type-btn" onClick={() => navigate("/create-post/character-review")}>
                        <div className="post-type-content">
                            <span className="post-type-symbol"><p className="post-type-symbol-text">Aa</p></span>
                            <p className="post-type-text">Create a character review</p>
                            <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                        </div>
                    </div>
                    <div className="post-type-btn" onClick={() => navigate("/create-post/post")}>
                        <div className="post-type-content">
                            <span className="post-type-symbol"><p className="post-type-symbol-text">Aa</p></span>
                            <p className="post-type-text">Create a post</p>
                            <img className="arrow-right-phone" src="https://mediareviewer.s3.amazonaws.com/static/images/rightarrow.png"></img>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
        
    );
};