import React from "react"
import { apiTweetCreate } from "../get/lookup";


export const TweetCreate = ({ className, didTweet }) => {
    const textAreaRef = React.createRef();
    const handleBackendUpdate = (response, status) => {
        if(status === 201){
            didTweet(response);
        }else if(status === 400){
            console.log(response);
            alert("An error occured");
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newVal = textAreaRef.current.value;
        apiTweetCreate(newVal, handleBackendUpdate);
        textAreaRef.current.value = "";
    }
    return(
        <div className={className}>
            <form onSubmit={handleSubmit}>
                <textarea ref={textAreaRef} required={true} className="form-control" name="tweet">
                            
                </textarea>
                <button type="submit" className="btn btn-primary my-3">
                            Tweet
                </button>
            </form>
        </div>
    )
}