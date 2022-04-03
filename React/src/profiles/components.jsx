
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export const profileBackendLookup = (method, endpoint, callback, data) => {
    let jsonData;
    if(data){
        jsonData = JSON.stringify(data);
    }
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:8000/api/profile/${endpoint}`;
    console.log(url)
    const csrftoken = getCookie('csrftoken');
    xhr.responseType = "json";
    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    if(csrftoken){
        //xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
    xhr.onload = (e) => {
        if(xhr.status === 403){
            const detail = xhr.response.detail
            if(detail === "Authentication credentials were not provided."){
                window.location.href = "/login?showLoginRequired=true"
            }
        }
        //console.log(xhr.response, xhr.status)
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = (e) => {
        //console.log("error", e)
        callback({"message":"The request was Error"}, 400)
    }
    //console.log(jsonData);
    xhr.send(jsonData);
}

