//News organizations that we will use to tell which link needs to be "recommended"
const orgs = ["https://www.foxnews.com", "https://www.bbc.com", "http://www.msnbc.com"];
let recommended = [];
const dict = {
    "https://www.foxnews.com": "images/fox.png",
    "https://www.bbc.com": "images/bbc.jpeg",
    "http://www.msnbc.com": "images/msnbc.png"
}

//Query info to get active tabs
let queryInfo = {
    "active": true,
}

console.log(gapi)

//Get info from the current active browser using the queryInfo object
let querying = browser.tabs.query(queryInfo).then((result) => {

    //Search google with this title
    console.log("Title: ", result);
    let searchQuery = result[0].title; 

    //Figure out which news site this current article is on. Find the current domain, get the recommended domains, apply the links
    let currentSite = result[0].url.match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "")[0];
    console.log("title name: ", currentSite);

    //Disable website if not on supported organization
    if(!orgs.includes(currentSite)) {
        console.log("NOT SUPPORTED");
        //Remove all children of popup html
        let popup = document.getElementById("popup");
        while(popup.hasChildNodes) {
            popup.removeChild(popup.firstChild);
        }
        let error = document.createElement("div");
        let errorMessage = document.createTextNode("Website not supported");
        error.appendChild(errorMessage);
        popup.append(error);
    }
   
    //Iterate through the differents orgs and push the non current domains into reccomended domains
    orgs.forEach(org => {
        if(org != currentSite) {
            recommended.push(org);
        }
    });

    //TODO: GET GOOGLE SEARCH RESULTS HERE based on searchQuery (only use recommened domains)
    
    loadClient().then(() => {
        execute(searchQuery);

        //TODO: APPLY LINKS TO RECOMMENDED ARRAY BASED FROM THE RESULTS OF THE GOOGLE SEARCH

        //Match the images with links and display them in correct location
        document.getElementById("current-news-link").href = result[0].url;
        document.getElementById("current-news-image").src = dict[currentSite];

        //TODO: Replace links with accurate ones once google results are implemented
        document.getElementById("recommended-news-first-link").href = result[0].url;
        document.getElementById("recommended-news-first-image").src = dict[currentSite];
        document.getElementById("recommended-news-second-link").href = result[0].url;
        document.getElementById("recommended-news-second-image").src = dict[currentSite];
    });
    
    

    



});

function loadClient() {
    console.log("in loadClient")
    let test = null;
    let test2;
    console.log(test)
    console.log(test2)
    console.log(gapi.load)
    gapi.client.setApiKey(AIzaSyBwYfVMhEL8QPZ2RGfGYIhTE0LWH6sXGN4);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded before calling this method.
function execute(query) {
	console.log("in execute")
    return gapi.client.search.cse.list({
        "q": query,
        "cx": "004649689299812298879:wkbvmvrnja8"
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        },
        function(err) { console.error("Execute error", err); });
}

console.log(`Alt-Facts: Was loaded!`);