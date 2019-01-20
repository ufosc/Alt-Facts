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
    console.log("About to search");
    //TODO: GET GOOGLE SEARCH RESULTS HERE based on searchQuery (only use recommened domains)
    let xhttp = new XMLHttpRequest();
    let url = `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${searchQuery}+"site:"+${recommended[0]}+" OR "+${recommended[1]}+&count=10&offset=0&mkt=en-us&safesearch=Moderate`
    xhttp.onreadystatechange = function() {
        console.log("Before ready");
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log("results: ", xhttp.responseText);
            let response = JSON.parse(xhttp.responseText);

            //bingResults is the domain and the path params from the response, domainResults is just the domain from the response
            let bingResults = [];
            let domainResults = [];

            bingResults.push(response["webPages"]["value"][0].url);
            bingResults.push(response["webPages"]["value"][1].url);
            domainResults[0] = bingResults[0].match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "");
            domainResults[1] = bingResults[1].match(/^((?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+))/img, "");

            console.log("Test area:")
            console.log(recommended[0])
            console.log(recommended[1])
            console.log(bingResults[0])
            console.log(bingResults[1])
            console.log(domainResults[0])
            console.log(domainResults[1])
            //TODO: APPLY LINKS TO RECOMMENDED ARRAY BASED FROM THE RESULTS OF THE GOOGLE SEARCH

            //Match the images with links and display them in correct location
            document.getElementById("current-news-link").href = result[0].url;
            document.getElementById("current-news-image").src = dict[currentSite];

            //TODO: Replace links with accurate ones once google results are implemented
            document.getElementById("recommended-news-first-link").href = bingResults[0];
            document.getElementById("recommended-news-first-image").src = dict[domainResults[0]];
            document.getElementById("recommended-news-second-link").href = bingResults[1].url;
            document.getElementById("recommended-news-second-image").src = dict[domainResults[1]];
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", "380ffeed758e4b99be10b3b5fb1cc143");
    xhttp.send();
    

    
    
    
});

console.log(`Alt-Facts: Was loaded!`);