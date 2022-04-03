import React, { useState } from "react"
import { ActionBtn } from "./buttons";


const UserPicture = ({ user }) => {
    return(
        <React.Fragment>
            <span className="mx-2 px-3 py-2 rounded-circle bg-success text-white">
                {user.username[0]}
            </span>
        </React.Fragment>
    )
}

export const ParentTweet = ({ tweet, retweeter }) => {
    return tweet.parent ?(
        <div className="row">
            <div className="col-10 mx-auto p-3 border border-success rounded">
                <p className="mb-3 text-muted small">Retweet via @{retweeter}</p>
                <Tweet hideActions tweet={tweet.parent} className={"px-4"} />
            </div>
        </div>
    ) : null
}

export const Tweet = ({ tweet, didRetweet, hideActions, className }) => {
    const [actionTweet, setActionTweet] = useState(tweet ? tweet : null)
    const path = window.location.pathname;
    const match = path.match(/(?<tweetid>\d+)/)
    const urlTweetId = match ? match.groups.tweetid : -1
    const is_Detail = `${tweet.id}` === `${urlTweetId}`

    const handleLink = (e) => {
        e.preventDefault();
        window.location.href = `/${tweet.id}`
    }

    const didPerformAction = (newResponse, status) => {
        if(status === 200){
            setActionTweet(newResponse)
        }else if(status === 201){
            if(didRetweet){
                didRetweet(newResponse)
            }
        }                    
    }

    const handleUserLink = (e) => {
        e.preventDefault();
        window.location.href =`/profile/${tweet.user.username}`
    }

    return(
        <div className={className}>
            <div>
            <h5>
                <p onClick={handleUserLink} className=" w-50 pointer">
                    <span>
                        <UserPicture user={tweet.user} />
                    </span>
                    {" "}{tweet.user.first_name}{" "}
                    {tweet.user.last_name}
                </p>
                <p onClick={handleUserLink} className="fw-light fst-italic pointer">
                    @{tweet.user.username}
                </p>
            </h5>
                <p>{tweet.content}</p>
                <div className="btn btn-group px-0">
                {(actionTweet && hideActions !== true) && 
                    <React.Fragment key={tweet.id}>
                        <ActionBtn tweet={actionTweet} didPerformAction={didPerformAction} action={{type:"like", display:"Likes"}} />
                        <ActionBtn tweet={actionTweet} didPerformAction={didPerformAction} action={{type:"unlike", display:"Unlikes"}} />
                        <ActionBtn tweet={actionTweet} didPerformAction={didPerformAction} action={{type:"retweet", display:"Retweet"}} />
                    </React.Fragment>
                }
                    {is_Detail === true ? null : <button className="btn btn-outline-primary mx-1 rounded-pill" onClick={handleLink}>View</button>}
                </div>
                <ParentTweet tweet={tweet} retweeter={tweet.user.username} />
            </div>
        </div>
    )
}