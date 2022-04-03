import React, { useEffect, useState } from "react"
import { Tweet } from "./detail"
import { apiTweetList } from "../get/lookup"


export const TweetList = ({ newTweets, username }) => {
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [tweetsDidSet, setTweetsDidSet] = useState(false);
    const didRetweet = (newResponse) => {
        const updateTweetsInit = [...tweetsInit];
        updateTweetsInit.unshift(newResponse);
        setTweetsInit(updateTweetsInit);
        const updateFinalTweets = [...tweets];
        updateFinalTweets.unshift(tweets);
        setTweets(updateFinalTweets);
    }

    useEffect(() => {
        const final = [...newTweets].concat(tweetsInit);
        if(final.length !== tweets.length){
            setTweets(final);
        }
    },[newTweets,tweetsInit,tweets]);

    useEffect(() =>{
        if(tweetsDidSet === false){
            const handleTweetListLookup = (response, status) =>{
                if(status === 200){
                    setNextUrl(response.next)
                    setTweetsInit(response.results);
                    setTweetsDidSet(true);
                }else{
                    alert("There was an error");
                }
            }
            apiTweetList(username, handleTweetListLookup)
        }           
    },[tweetsInit, tweetsDidSet, setTweetsDidSet, username])
    

    const handleLoadNextUrl = (e) => {
        e.preventDefault();
        if(nextUrl !== null){
            const handleLoadResponse = (response, status) =>{
                console.log(status)
                if(status === 200){
                    setNextUrl(response.next)
                    const newTweets = [...tweets].concat(response.results)
                    setTweetsInit(newTweets);
                    setTweets(newTweets);
                }else{
                    alert("There was an error");
                }
            }
            apiTweetList(username, handleLoadResponse, nextUrl);
        }
    }

    return(
        <React.Fragment>{
            tweets.map((item, index) => {
                return (
                    <Tweet 
                        tweet={item}
                        didRetweet={didRetweet}
                        key={`${index}-{item.id}`} 
                        className="w-50 m-auto mb-5 p-5 border border-primary bg-white text-dark rounded " />
            )
        })}
        <div className="w-50 mx-auto">
        {nextUrl !== null && <button onClick={handleLoadNextUrl} className="btn btn-outline-primary bounded">Load Next</button>}
        </div>
        </React.Fragment>
    )
}