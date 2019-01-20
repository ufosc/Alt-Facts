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
    
    //Iterate through the differents orgs and push the non current domains into reccomended domains
    orgs.forEach(org => {
        if(org != currentSite) {
            recommended.push(org);
        }
    });

    //TODO: GET GOOGLE SEARCH RESULTS HERE based on searchQuery (only use recommened domains)

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

console.log(`Alt-Facts: Was loaded!`);