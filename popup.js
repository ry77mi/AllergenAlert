// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

function getLinks(){
    list = [];
    let itemLinks = document.getElementsByClassName('w_CQ');
    for (item of itemLinks){
        if(item.parentNode.tagName == 'A'){
            list.push(item.parentNode.href)
        }
    }
    return list;
}

async function navPage(url, currentId){
    let repeat = false;
    return new Promise(function(resolve, reject){

        //update url and fire when complete
        chrome.tabs.update({url: url});
        chrome.tabs.onUpdated.addListener(async function openPage(tabID, changeInfo){
            if (currentId == tabID && changeInfo.status === 'complete'){
                chrome.tabs.onUpdated.removeListener(openPage);
                
                //fire when script sends message
                chrome.runtime.onMessage.addListener(function getDOMInfo(message){
                    chrome.runtime.onMessage.removeListener(getDOMInfo);
                    
                    //print message
                    if(repeat == false){
                        repeat = true;
                        console.log(message);
                    }
                });
                //get tab id
                let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                //execute script to get ingredients
                chrome.scripting.executeScript({
                    target: { tabId : tab.id},
                    files: ['content.js'],
                }, function(){
                    resolve();
                });
            }
        });
    });
}
//wait for x seconds
async function waitSeconds(seconds){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, seconds * 1000);
    });  
}

//when button is clicked
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    //retrieves and stores links to product pages
    linkList = [];
    chrome.scripting.executeScript({
        target: { tabId : tab.id },
        function: getLinks,
    },
    async (results) => {
        console.log(results[0].result);
        linkList = (results[0].result);

        for (let i = 0; i < linkList.length - 20; i++){
            await navPage(linkList[i], tab.id);

            await waitSeconds(1);
        }
        chrome.tabs.update({url: tab.url});
    });
    console.log(tab.url);
});

