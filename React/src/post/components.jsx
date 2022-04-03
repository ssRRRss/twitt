import React, { useEffect, useState } from "react"
import { TweetList } from "./list"
import { TweetCreate } from "./create"
import { apiTweetDetail } from "../get/lookup"
import { Tweet } from "./detail"
import { FeedList } from "./feed"


export const FeedComponent = ({ className, canTweet, username }) => {
    //console.log(username);
    //console.log(canTweet);
    const [newTweets, setNewTweets] = useState([]);
    const can_tweet = canTweet === "false" ? false : true;
    const handleNewTweet = (newTweet) => {
        let tempNewTweets = [...newTweets];
        tempNewTweets.unshift(newTweet);
        setNewTweets(tempNewTweets);
    }
    return(
        <div className={className}>
            {can_tweet === true && <TweetCreate className={"col-12 mb-3 mt-5 w-50 mx-auto"} didTweet={handleNewTweet} />}
            <FeedList newTweets={newTweets} username={username}/>
        </div>
    )
}


export const TweetComponent = ({ className, canTweet, username }) => {
    //console.log(username);
    //console.log(canTweet);
    const [newTweets, setNewTweets] = useState([]);
    const can_tweet = canTweet === "false" ? false : true;
    const handleNewTweet = (newTweet) => {
        let tempNewTweets = [...newTweets];
        tempNewTweets.unshift(newTweet);
        setNewTweets(tempNewTweets);
    }
    return(
        <div className={className}>
            {can_tweet === true && <TweetCreate className={"col-12 mb-3 mt-5 w-50 mx-auto"} didTweet={handleNewTweet} />}
            <TweetList newTweets={newTweets} username={username}/>
        </div>
    )
}                   


export const TweetDetailComponent = ({ tweetId, className }) => {
    const [didLookup, setDidLookup] = useState(false)
    const [tweet, setTweet] = useState(null)
    const handleBackendLookup = (response, status) => {
        //console.log(response, status)
        if(status === 200){
            setTweet(response)
        }else{
            alert("There was an error finding your tweet")
        }
    }
    useEffect(() => {
        if(didLookup === false){
            apiTweetDetail(tweetId, handleBackendLookup)
            setDidLookup(true)
        }
    }, [tweetId, didLookup, setDidLookup])

    return(
        tweet === null ? null : <Tweet tweet={tweet} className={className} />
    )
}
