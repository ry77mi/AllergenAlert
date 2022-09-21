

//the window url
let myURL = window.location.href;


//webscrape the page for the ingredients
async function getIngredients(site){
    //delcaring variables
    let ingredients;
    let parentDiv;

    if (site == 'amazon'){
        parentDiv = document.getElementsByClassName("content");
    }
    else if(site == 'walmart'){
        parentDiv = document.getElementsByClassName("pb2");
    }
    else if(site == 'kroger'){
        parentDiv = document.getElementsByClassName("NutritionIngredients-Ingredients");
    }

    if(site == 'kroger'){
        ingredients = (parentDiv[0].lastChild.nodeValue.split(" "));
    }
    
    for (let i = 0; i < parentDiv.length; i++){
        if(parentDiv[i].firstElementChild.innerHTML == "Ingredients"){
            if(site == 'amazon'){
                ingredients = (parentDiv[i].childNodes[4].innerHTML.split(" "));

            }
            else if(site == 'walmart'){
                ingredients = (parentDiv[i].lastChild.innerHTML.split(" "));
            }
        }
    }

    return ingredients;
}

//make sure the ingredient list only include letters
async function sanatize(list){
    let sanList = [];
    for(str of list){
        let tempStr = "";
        for(char of str){
            if(await isLetter(char)){
                tempStr += char;
            }
        }
        sanList.push(tempStr.toLowerCase());
    }
    return sanList;
}

//check if each char is a letter
async function isLetter(c){
    return c.toLowerCase() != c.toUpperCase();
}

async function crossReference(list, allergenList){
    for(word of list){
        for(allergen of allergenList){
            if(word == allergen){
                console.log(word + " = " + allergen);
                return true;
            }
        }
    }
    return false;
}

//["soy", "wheat", "milk", "eggs", "fish", "shellfish", "treenuts", "peanuts"]
//returns true if an allergy is listed
async function findAllergens(list){
    let contains = [];
    chrome.storage.sync.get("allergens", async (data) => {
        console.log(data.allergens);
        chrome.storage.sync.get("completeList", async (key) => {
            console.log(key.completeList);

            if(data.allergens[0] == true && key.completeList[0][0] != ''){
                if(await crossReference(list, key.completeList[0])){
                    contains.push("soy")
                }
            }
            if(data.allergens[1] == true && key.completeList[1][0] != ''){
                if(await crossReference(list, key.completeList[1])){
                    contains.push("wheat")
                }
            }
            if(data.allergens[2] == true && key.completeList[2][0] != ''){
                if(await crossReference(list, key.completeList[2])){
                    contains.push("milk")
                }
            }
            if(data.allergens[3] == true && key.completeList[3][0] != ''){
                if(await crossReference(list, key.completeList[3])){
                    contains.push("egg")
                }
            }
            if(data.allergens[4] == true && key.completeList[4][0] != ''){
                if(await crossReference(list, key.completeList[4])){
                    contains.push("fish")
                }
            }
            if(data.allergens[5] == true && key.completeList[5][0] != ''){
                if(await crossReference(list, key.completeList[5])){
                    contains.push("shellfish")
                }
            }
            if(data.allergens[6] == true && key.completeList[6][0] != ''){
                if(await crossReference(list, key.completeList[6])){
                    contains.push("tree nut")
                }
            }
            if(data.allergens[7] == true && key.completeList[7][0] != ''){
                if(await crossReference(list, key.completeList[7])){
                    contains.push("peanut")
                }
            }
            if(key.completeList[8] && key.completeList[8][0] != ''){
                if(await crossReference(list, key.completeList[8])){
                    contains.push("other allergens")
                }
            }
            console.log(contains);
            if(contains.length > 0){
                chrome.runtime.sendMessage(null, contains);
                displayAlert(contains);
            }
        });
    });
}

async function displayAlert(allergens){
    //the message the alert will display
    let message = "This product likely contains: "
    for(let i = 0; i < allergens.length; i++){
        if(!allergens[i+1] && i > 0){
            message += " and ";
        }
        message += allergens[i];
        if(allergens.length > 2 && allergens[i+1]){
            message += ",";
            if(allergens[i+2]){
                message += ' ';
            }
        }
    }
    console.log(message);

    //creating the alert
    let bubble = document.createElement("div");
    bubble.style.backgroundColor = 'lightgray';
    bubble.innerHTML =  message;
    bubble.style.position = 'absolute';
    bubble.style.top = '20vh';
    bubble.style.left = '25vw';
    bubble.style.width = '35vw';
    bubble.style.paddingLeft = '1vw';
    bubble.style.paddingRight = '1vw';
    bubble.style.border = 'solid';
    bubble.style.borderColor = 'red';
    bubble.style.textAlign = 'center';
    bubble.id = "allergyAlert";
    document.body.appendChild(bubble);
}

function callObserver(){
    let repeat = false;
    let target;
    target = document.body;

    let options = {
        characterData: false, 
        attributes: false, 
        childList: true, 
        subtree: false
    }

    const observer = new MutationObserver(newPage);

    observer.observe(target, options);

    function newPage(observer){
        if(repeat){
            return;
        }
        else{
            repeat = true;
            console.log("new page");
    
            if (myURL.indexOf("walmart.com/ip") != -1){
                setTimeout(function(){
                startIP('walmart');
                console.log("new walmart page");
                },1000);
                
            }

            if (/amazon.com\/\S*\/dp\/\S*/.test(myURL)){
                //wait a second after page load to start
                setTimeout(function(){
                    console.log("new amazon page")
                    startIP('amazon');
                },1000);
            }

            if (myURL.indexOf("kroger.com/p/") != -1){
                //wait a second after page load to start
                setTimeout(function(){
                    console.log("new kroger page")
                    startIP('kroger');
                },1000);
            }
        }
    }
}

//starts the product info script
async function startIP(site){
    if(document.getElementById("allergyAlert")){
        document.getElementById("allergyAlert").remove();
    }
    let ingredients = await getIngredients(site);
    if(ingredients){
        ingredients = await sanatize(ingredients);
    }
    console.log(ingredients);
    findAllergens(ingredients);

    setTimeout(function(){
        callObserver();
    },1000);
}

if (myURL.indexOf("walmart.com/ip") != -1){
    //wait half a second after page load to start
    setTimeout(function(){
        console.log("running walmart")
        startIP('walmart');
    },400);
}

if (/amazon.com\/\S*\/dp\/\S*/.test(myURL)){
    //wait half a second after page load to start
    setTimeout(function(){
        console.log("running amazon")
        startIP('amazon');
    },500);
}

if (myURL.indexOf("kroger.com/p/") != -1){
    //wait half a second after page load to start
    setTimeout(function(){
        console.log("running kroger")
        startIP('kroger');
    },500);
}