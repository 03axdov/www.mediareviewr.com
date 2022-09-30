import React, { useState, useRef, useCallback } from 'react';
import AdditionalNav from "./AdditionalNav"
import axios from 'axios'
import { useNavigate } from "react-router"
import GroupInfoPopup from "./GroupInfoPopup"

export default function ListPopup(props) {

    const [name, setName] = React.useState('')

    const onChange = (e) => {
        if (e.target.value.length < 100) {
            props.setValues({ ...props.values, [e.target.name]: e.target.value });
        }
    };

    React.useEffect(() => {
        setName(props.currentProfile.name)
    }, [props.currentProfile.name])

    return (props.trigger) ? (
        <div className="list-popup-container">
            <div className="list-popup-inner">
                <button className="close-btn-list" onClick={() => {props.setTrigger(false)}}>Done</button>
                <h3 className="profile-create-name">{name}</h3>
                <div className="list-edit-row-1">
                    <div className="card edit-profile-list">
                        <div className="card-header"><h3 className="title-movies">Top Movies</h3></div>
                        <div className="card-body edit-list-body">
                            <ol className="edit-profile-detail-list">
                                <li className="edit-list-element">
                                    <input name="first_movie" type="text" className="input edit-list-input"value={props.values.first_movie} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="second_movie" type="text" className="input edit-list-input" value={props.values.second_movie} onChange={onChange}></input>  
                                </li>
                                <li className="edit-list-element">
                                    <input name="third_movie" type="text" className="input edit-list-input" value={props.values.third_movie} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fourth_movie" type="text" className="input edit-list-input" value={props.values.fourth_movie} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fifth_movie" type="text" className="input edit-list-input" value={props.values.fifth_movie} onChange={onChange}></input>
                                </li>
                            </ol>  
                        </div>
                    </div>
                    <div className="card edit-profile-list">
                        <div className="card-header"><h3 className="title-anime">Top Anime</h3></div>
                        <div className="card-body edit-list-body">
                            <ol className="edit-profile-detail-list">
                                <li className="edit-list-element">
                                    <input name="first_anime" type="text" className="input edit-list-input" value={props.values.first_anime} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="second_anime" type="text" className="input edit-list-input" value={props.values.second_anime} onChange={onChange}></input>  
                                </li>
                                <li className="edit-list-element">
                                    <input name="third_anime" type="text" className="input edit-list-input" value={props.values.third_anime} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fourth_anime" type="text" className="input edit-list-input" value={props.values.fourth_anime} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fifth_anime" type="text" className="input edit-list-input" value={props.values.fifth_anime} onChange={onChange}></input>
                                </li>
                            </ol>  
                        </div>
                    </div>
                    <div className="card edit-profile-list">
                        <div className="card-header"><h3 className="title-series">Top Series</h3></div>
                        <div className="card-body edit-list-body">
                            <ol className="edit-profile-detail-list">
                                <li className="edit-list-element">
                                    <input name="first_series" type="text" className="input edit-list-input" value={props.values.first_series} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="second_series" type="text" className="input edit-list-input" value={props.values.second_series} onChange={onChange}></input>  
                                </li>
                                <li className="edit-list-element">
                                    <input name="third_series" type="text" className="input edit-list-input" value={props.values.third_series} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fourth_series" type="text" className="input edit-list-input" value={props.values.fourth_series} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fifth_series" type="text" className="input edit-list-input" value={props.values.fifth_series} onChange={onChange}></input>
                                </li>
                            </ol>  
                        </div>
                    </div>
                    <div className="card edit-profile-list">
                        <div className="card-header"><h3 className="title-games">Top Games</h3></div>
                        <div className="card-body edit-list-body">
                            <ol className="edit-profile-detail-list">
                                <li className="edit-list-element">
                                   <input name="first_game" type="text" className="input edit-list-input" value={props.values.first_game} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="second_game" type="text" className="input edit-list-input" value={props.values.second_game} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="third_game" type="text" className="input edit-list-input" value={props.values.third_game} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fourth_game" type="text" className="input edit-list-input" value={props.values.fourth_game} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fifth_game" type="text" className="input edit-list-input" value={props.values.fifth_game} onChange={onChange}></input>
                                </li>
                            </ol>  
                        </div>
                    </div>
                    <div className="card edit-profile-list">
                        <div className="card-header"><h3 className="title-literature">Top Literature</h3></div>
                        <div className="card-body edit-list-body">
                            <ol className="edit-profile-detail-list">
                                <li className="edit-list-element">
                                    <input name="first_literature" type="text" className="input edit-list-input" value={props.values.first_literature} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="second_literature" type="text" className="input edit-list-input" value={props.values.second_literature} onChange={onChange}></input>  
                                </li>
                                <li className="edit-list-element">
                                    <input name="third_literature" type="text" className="input edit-list-input" value={props.values.third_literature} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fourth_literature" type="text" className="input edit-list-input" value={props.values.fourth_literature} onChange={onChange}></input>
                                </li>
                                <li className="edit-list-element">
                                    <input name="fifth_literature" type="text" className="input edit-list-input" value={props.values.fifth_literature} onChange={onChange}></input>
                                </li>
                            </ol>  
                        </div>
                    </div>
                </div>
                
            </div>         
        </div>
    ): '';
}