import React from "react"
import { apiTweetAction } from "../get/lookup";


export const ActionBtn = ({tweet, didPerformAction, action}) => {
    const likes = tweet.likes ? tweet.likes : 0
    const actionDisplay = action.type ? action.display : "Action"
    const display = action.type === "like" ? `${likes} ${actionDisplay}` : actionDisplay
    const handleBackendEvent = (response, status) => {
        console.log(response, status);
        if((status === 200 || status === 201) && didPerformAction){
            didPerformAction(response, status)
        }
    }
    const handleClick = (e) => {
        e.preventDefault();
        apiTweetAction(tweet.id, action.type, handleBackendEvent);
    }
    return (
        <button className="btn btn-primary btn-sm mx-1 rounded-pill" onClick={handleClick}>
            {display}
        </button>
    )
}