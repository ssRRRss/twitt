import { backendLookup } from "./components"


export const apiTweetCreate = (newTweet, callback) => {
    backendLookup("POST", "create/", callback, {content:newTweet});
}

export const apiTweetAction = (tweetId, action, callback) => {
    const data = {id:tweetId, action:action}
    backendLookup("POST", "action/", callback, data);
}

export const apiTweetFeed = (callback, nextUrl) => {
    let endpoint = "feed/"
    if(nextUrl !== null && nextUrl !== undefined){
        endpoint = nextUrl.replace("http://localhost:8000/api/tweets/", "")
    }
    backendLookup("GET", endpoint, callback);
}

export const apiTweetList = (username, callback, nextUrl) => {
    let endpoint = ""
    if(username){
        endpoint = `?username=${username}`
    }
    if(nextUrl !== null && nextUrl !== undefined){
        endpoint = nextUrl.replace("http://localhost:8000/api/tweets/", "")
    }
    backendLookup("GET", endpoint, callback);
}

export const apiTweetDetail = (tweetId, callback) => {
    backendLookup("GET", `${tweetId}/`, callback);
}