import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { FeedComponent, TweetComponent, TweetDetailComponent } from './post';
import { ProfileBadgeComponent } from "./profiles/badge"


const appEl = document.getElementById('root');
if (appEl) {
    ReactDOM.render( < App / > , appEl);
}


const e = React.createElement

const tweetsEl = document.getElementById("tweets_2");
if (tweetsEl) {
    ReactDOM.render(
        e(TweetComponent, tweetsEl.dataset), tweetsEl
    )
}


const tweetFeedEl = document.getElementById("tweets_2_feed");
if (tweetFeedEl) {
    ReactDOM.render(
        e(FeedComponent, tweetFeedEl.dataset), tweetFeedEl
    )
}


const tweetDetailEl = document.querySelectorAll("#tweet_2_detail")
tweetDetailEl.forEach((container) => {
    ReactDOM.render(
        e(TweetDetailComponent, container.dataset), container
    )
})


const profileBadgeEl = document.querySelectorAll("#tweet_2_badge")
profileBadgeEl.forEach((container) => {
    ReactDOM.render(
        e(ProfileBadgeComponent, container.dataset), container
    )
})



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();