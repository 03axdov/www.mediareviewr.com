import React, { useState } from "react";
import FormInput from "./FormInput";
import jQuery from 'jquery';  // important dependency
import { useNavigate } from "react-router"
import axios from 'axios'

export default function PostTypePage(props) {
    const [image, setImage] = React.useState('')
    const [imageURL, setImageURL] = React.useState('')

    React.useEffect(() => {
        setImage(props.image)
        setImageURL(props.imageURL)
    }, [props])

    return (props.trigger) ? (
        <div className="post-image-popup">
            <div className="post-create-top">
                {!imageURL && 
                    <button className="next-button" onClick={() => {props.setTrigger(false)}}>Skip</button>
                }
                {imageURL && 
                    <button className="next-button-selected" onClick={() => {props.setTrigger(false)}}>Next</button>
                }
            </div>
            <label className="post-popup-upload">
                <input className="post-create-image" name="image" key="file-upload" type="file" accept="image/*, video/mp4" onChange={props.imageOnChange} />
                {imageURL !== '' && 
                    <div className="post-popup-uploaded-image-container">
                    {image.name.slice(-3) == 'MP4' && 
                        <video className="post-popup-uploaded-image" controls="controls">
                        <source src={imageURL} type="video/mp4"></source>
                        </video>
                    }
                    {image.name.slice(-3) != 'MP4' && 
                        <img src={imageURL} className="post-popup-uploaded-image"></img>
                    } 
                    </div>
                    
                }
                {imageURL === '' && 
                    <div className="upload-file-container">
                    <img src="https://mediareviewer.s3.amazonaws.com/static/images/upload.png" className="upload-image"></img>
                    <p className="upload-text">Upload an image or video</p>
                    </div>
                }
            </label>
            
        </div>
        
    ) : "";
};