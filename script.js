function search() {
    let banner = document.getElementById("banner");
    banner.getElementsByTagName("img")[0].setAttribute("src",null);
    banner.style.backgroundColor=null;
    banner.style.backgroundImage=null;
    document.getElementById("posts").innerHTML=null;
    let request = new XMLHttpRequest();
    let name = document.getElementById("searchBar").value
    let url = "https://www.reddit.com/r/" + name + ".json";
    let redditLinks = new Array();
    let res = null;

    request.open("GET", url, true);
    request.onload = function() {
        let data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            let links = getBannerImg(name);

            let banLink = links[0];
            let iconLink = links[1];
            console.log("the links are " + links);
            console.log("Icon link is " + iconLink);
            console.log("Banner Link is " + banLink)
            if (banLink == "" || banLink == null) {
                banner.style.backgroundColor="#add8e6";
            }
            else {
                banner.style.backgroundImage = "url(" + banLink + ")";
            }
            if (iconLink == "" || iconLink == null) {

                banner.getElementsByTagName("img")[0].setAttribute("src", "http://s3.amazonaws.com/sp.reddit.com/alienFlap.gif");
            }
            else {
                banner.getElementsByTagName("img")[0].setAttribute("src", iconLink);
            }
            banner.getElementsByTagName("h1")[0].innerHTML = "r/" + name;

            for (let i = 0; i < data["data"].children.length; i++) {
                //title
                let title = data["data"].children[i].data.title;
                //Amount of upvotes
                let numUps = data["data"].children[i].data.ups;
                //Who wrote the post
                let author = data["data"].children[i].data.author;
                //Converts the unix to est
                let dateCreated = new Date(data["data"].children[i].data.created_utc * 1000).toString();
                //Value of thumnail value to see if there is even an image
                let thumbVal = data["data"].children[i].data.thumbnail;
                //VAriable that will store the current post
                let post;
                //the post's content 
                let text = data["data"].children[i].data.selftext;

                let posts = document.getElementById("posts")
                console.log(convertDate(dateCreated.toString()));



                if (thumbVal == "self" || thumbVal == "" || thumbVal == null) {
                    post = createTextPost(title, author, dateCreated, numUps, text);
                    posts.appendChild(post);
                }
                else {
                    let imageURL = data["data"].children[i].data.url;
                    post = createImagePost(title, author, dateCreated, numUps, imageURL);
                    posts.appendChild(post);
                }
            }
        }
    };
    request.send();
}

function getBannerImg(name) {
    let banRequest = new XMLHttpRequest();
    let url = "https://www.reddit.com/r/" + name + "/about.json";
    let source = new Array();
    banRequest.open("GET", url, false);
    banRequest.onload = function() {
        let data = JSON.parse(this.response);
        if (banRequest.status >= 200 && banRequest.status < 400) {
            source[0] = data["data"].banner_background_image;
            source[1] = data["data"].icon_img;
        }

    };
    console.log(source);
    banRequest.send();
    banRequest.DONE;
    return source;
}

function createTextPost(title, author, date, ups, text) {
    let post = document.createElement("div");
    post.classList.add("post");

    post.classList.add("row");
    post.appendChild(document.createElement("div"));
    post.appendChild(document.createElement("div"));
    post.childNodes[0].classList.add("col-lg-1");
    post.childNodes[1].classList.add("col-lg-11");
    post.childNodes[1].appendChild(document.createElement("h6"));
    post.childNodes[1].appendChild(document.createElement("h4"));
    post.childNodes[1].appendChild(document.createElement("p"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("i"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("b"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("i"));
    post.getElementsByTagName("i")[0].classList.add("fas")
    post.getElementsByTagName("i")[0].classList.add("fa-arrow-up")
    post.getElementsByTagName("i")[1].classList.add("fas")
    post.getElementsByTagName("i")[1].classList.add("fa-arrow-down")
    post.getElementsByTagName("b")[0].innerHTML = ups;
    console.log(convertDate(date));
    post.getElementsByTagName("h6")[0].innerHTML = "Created by " + author + "\tUploaded: " + convertDate(date);
    post.getElementsByTagName("h4")[0].innerHTML = title;
    post.getElementsByTagName("p")[0].innerHTML = text;
    return post;
}

function createImagePost(title, author, date, ups, imageURL) {
    console.log("image running")
    let post = document.createElement("div");
    post.classList.add("post");

    post.classList.add("row");
    post.appendChild(document.createElement("div"));
    post.appendChild(document.createElement("div"));
    post.childNodes[0].classList.add("col-lg-1");
    post.childNodes[1].classList.add("col-lg-11");
    post.childNodes[1].appendChild(document.createElement("h6"));
    post.childNodes[1].appendChild(document.createElement("h4"));
    post.childNodes[1].appendChild(document.createElement("img"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("i"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("b"));
    post.getElementsByClassName("col-lg-1")[0].appendChild(document.createElement("i"));
    post.getElementsByTagName("i")[0].classList.add("fas")
    post.getElementsByTagName("i")[0].classList.add("fa-arrow-up")
    post.getElementsByTagName("i")[1].classList.add("fas")
    post.getElementsByTagName("i")[1].classList.add("fa-arrow-down")
    post.getElementsByTagName("b")[0].innerHTML = ups;
    post.getElementsByTagName("h6")[0].innerHTML = "Created by " + author + "\t Uploaded: " + convertDate(date);
    post.getElementsByTagName("h4")[0].innerHTML = title;
    post.getElementsByTagName("img")[0].setAttribute("src", imageURL);
    return post;
}

function convertDate(date) {
    var d = date.substring(4, 15);
    let year = d.substring(d.lastIndexOf(" ") + 1);
    d = d.substring(0, d.lastIndexOf(" ")) + "," + year;
    var time = date.substring(16, date.lastIndexOf(":"));
    console.log("Time before conversion:" + time);
    let hour = time.substring(0, time.indexOf(":"));
    console.log(hour);
    let min = time.substring(time.indexOf(":"));
    if (hour > 12) {
        hour -= 12;
        time = hour + min + "PM";
    }
    else {
        time += "AM"
    }

    let message = d + " " + time;

    return message;

}
