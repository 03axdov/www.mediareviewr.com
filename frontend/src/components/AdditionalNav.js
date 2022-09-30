import React from 'react';
import { useNavigate } from "react-router"
import axios from 'axios'

export default function AdditionalNav (props) {

    return (
        <div className="navbar navbar-extra">
            {props.children}
        </div>
    )

}