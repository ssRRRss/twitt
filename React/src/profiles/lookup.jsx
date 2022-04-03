import { profileBackendLookup } from "./components"


export const apiProfileDetail = (username, callback) => {
    profileBackendLookup("GET", `${username}`, callback);
}

export const apiProfileFollowToggle = (username, action, callback) => {
    const data = {"action":`${action && action}`.toLowerCase()}
    profileBackendLookup("POST", `${username}/follow/`, callback, data);
}