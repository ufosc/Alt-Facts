 //News organizations that we will use to tell which link needs to be "recommended"
 const orgs = ["https://www.foxnews.com", "https://www.bbc.com", "http://www.msnbc.com"];

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
    let recomended = [];
    //Iterate through the differents orgs and push the non current domains into reccomended domains
    orgs.forEach(org => {
        if(org != currentSite) {
            recommended.push(org);
        }
    });

    //TODO: GET GOOGLE SEARCH RESULTS HERE based on searchQuery (only use recommened domains)

    //TODO: APPLY LINKS TO RECOMMENDED ARRAY BASED FROM THE RESULTS OF THE GOOGLE SEARCH

    //TODO: MATCH THE NEWS SITE IMAGES TO THE NEW ARTICLES THAT ARE IN ORGS (BASED FROM GOOGLE SEARCHES)
    

});

console.log(`Alt-Facts: Was loaded!`);