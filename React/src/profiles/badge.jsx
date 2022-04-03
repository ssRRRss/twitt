import React, { useState, useEffect } from 'react';
import { apiProfileDetail, apiProfileFollowToggle } from "./lookup"

const numeral = require("numeral")


const UserPicture = ({ profileData }) => {
    return(
        <React.Fragment>
            <span className="mx-2 px-3 py-2 rounded-circle bg-success text-white">
                {profileData.username[0]}
            </span>
        </React.Fragment>
    )
}


const UserDisplay = ({ user, includeFullname, hideLink, profileData })=>{
    const nameDisplay = includeFullname === false ? `${profileData.first_name} ${profileData.last_name}` : null;
    const handleUserLink = (e) => {
        e.preventDefault();
        window.location.href =`/profile/${profileData.username}`
    }
    return(
        <React.Fragment>
            {nameDisplay}
            {hideLink === false ? <p>@{profileData.username}</p> : 
                <div>
                    <h5 className=" w-75 pointer d-flex flex-row">
                        <div onClick={handleUserLink}>
                            <UserPicture profileData={profileData} />
                        </div>
                        <div onClick={handleUserLink}>
                            {" "}{profileData.first_name}{" "}
                            {profileData.last_name}
                        </div>
                    </h5>
                    <p onClick={handleUserLink} className="w-25 fw-light fst-italic pointer">
                        @{profileData.username}
                    </p>
                </div>
                }
        </React.Fragment>
    )
}


const ProfileBadge = ({ user, didFollowToggle, profileLoading, profileData }) => {
    let currentVerb = (user && user.is_following) ? "Unfollow" : "Follow"
    currentVerb = profileLoading ? "Loading..." : currentVerb

    const handleFollowToggle = (e) => {
        e.preventDefault()
        if(didFollowToggle && !profileLoading){
            didFollowToggle(currentVerb)   //callback function
        }
    }
    return user ? (
        <div className="w-25 m-auto mt-5 p-5 border border-success rounded">
            <UserDisplay user={user} includeFullname hideLink profileData={profileData} />
            <div className="mb-3 d-flex flex-row">
                <h5 className="mx-4">{numeral(user.follower_count).format("0 a")} Follower</h5>
                <h5>{numeral(user.following_count).format("0 a")} Followeing</h5>
            </div>
            <p className="mt-4 mb-4">Location : {user.location}</p>
            <p className="">Bio : {user.bio}</p>
            <div className="d-flex flex-row-reverse mx-2">
                <button className="btn btn-primary" onClick={handleFollowToggle}> {currentVerb} </button>
            </div>
        </div>) : null
}


export const ProfileBadgeComponent = ({ username }) => {
    const [didLookup, setDidLookup] = useState(false)
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileData, setProfileData] = useState(null)

    const handleBackendLookup = (response, status) => {
        console.log(response, status)
        if(status === 200){
            setProfileData(response)
            setProfile(response)
        }
    }

    const handleNewFollow = (actionVerb) => {
        apiProfileFollowToggle(username, actionVerb, (response, status) => {
            if(status === 200){
                setProfile(response) 
                //apiProfileDetail(username, handleBackendLookup)
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)
    }

    useEffect(() => {
        if(didLookup === false){
            apiProfileDetail(username, handleBackendLookup)
            setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])

    return didLookup === false ? "Looding..." : profile ? <ProfileBadge user={profile} didFollowToggle={handleNewFollow} profileLoading={profileLoading} profileData={profileData}/> : null
}