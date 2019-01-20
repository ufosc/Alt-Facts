//News organizations that we will use to tell which link needs to be "recommended"
const orgs = ["https://www.foxnews.com", "https://www.bbc.com", "https://www.msnbc.com"];
let recommended = [];
const dict = {
    "https://www.foxnews.com": "images/fox.png",
    "https://www.bbc.com": "images/bbc.jpeg",
    "https://www.msnbc.com": "images/msnbc.png"
}

//Query info to get active tabs
let queryInfo = {
    "active": true,
}

//Get info from the current active browser using the queryInfo object
let querying = browser.tabs.query(queryInfo).then((result) => {

    //Search google with this title
    console.log("Title: ", result);
    let searchQuery = result[0].title;

    //Figure out which news site this current article is on. Find the current domain, get the recommended domains, apply the links
    let currentSite = result[0].url.match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "")[0];
    console.log("current Site: ", currentSite);

    //Disable website if not on supported organization
    console.log(orgs)
    if(!orgs.includes(currentSite)) {
        console.log("NOT SUPPORTED");
        //Remove all children of popup html
        let popup = document.getElementById("popup");
        removeChildNodes(popup);
        let error = document.createElement("div");
        error.innerHTML = 'Webpage not supported.'
        popup.appendChild(error);
    }
   
    //Iterate through the differents orgs and push the non current domains into reccomended domains
    orgs.forEach(org => {
        if(org != currentSite) {
            recommended.push(org);
        }
    });
    console.log("About to search");
    //TODO: GET GOOGLE SEARCH RESULTS HERE based on searchQuery (only use recommened domains)
    
    let urlArray = [];
    urlArray[0] = `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${searchQuery} site: ${recommended[0]}&count=10&offset=0&mkt=en-us&safesearch=Moderate`
    urlArray[1] = `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${searchQuery} site: ${recommended[1]}&count=10&offset=0&mkt=en-us&safesearch=Moderate`

    for(let i = 0; i < 2; i++) {
        requestURL(i, urlArray[i], result, currentSite);
    }

});

function requestURL(i, url, result, currentSite) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log("Before ready");
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log("results: ", JSON.parse(xhttp.responseText));
            let response = JSON.parse(xhttp.responseText);


            //Match the images with links and display them in correct location
            document.getElementById("current-news-link").href = result[0].url;
            document.getElementById("current-news-image").src = dict[currentSite];

            console.log("i", i);
            //TODO: Replace links with accurate ones once google results are implemented
            if(i == 0) {
                
                //bingResults is the domain and the path params from the response, domainResults is just the domain from the response
                let bingResults = [];
                let domainResults = [];
                bingResults[0] = response["webPages"]["value"][0].url;
                domainResults[0] = bingResults[0].match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "");
                document.getElementById("recommended-news-first-link").href = bingResults[0];
                console.log("search: " + i + " ", bingResults[0]);
                document.getElementById("recommended-news-first-image").src = dict[domainResults[0]];
            }
            else if(i == 1) {
                
                
                //bingResults is the domain and the path params from the response, domainResults is just the domain from the response
                let bingResults = [];
                let domainResults = [];
                bingResults[0] = response["webPages"]["value"][0].url;
                domainResults[0] = bingResults[0].match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "");
                document.getElementById("recommended-news-second-link").href = bingResults[0];
                console.log("search: " + i + " ", bingResults[0]);
                document.getElementById("recommended-news-second-image").src = dict[domainResults[0]];
            }
            
            
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", "380ffeed758e4b99be10b3b5fb1cc143");
    xhttp.send();

}

function removeChildNodes(parentDiv){
    if(parentDiv != null)
    {
        while (parentDiv.hasChildNodes()) {
            parentDiv.removeChild(parentDiv.firstChild);
        }
    }
    
}


console.log(`Alt-Facts: Was loaded!`);