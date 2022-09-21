let saveButton = document.getElementById("saveButton");

let soy = document.getElementById("soyWords");
let wheat = document.getElementById("wheatWords");
let milk = document.getElementById("milkWords");
let eggs = document.getElementById("eggWords");
let fish = document.getElementById("fishWords");
let shellfish = document.getElementById("shellfishWords");
let treenuts = document.getElementById("treenutWords");
let peanuts = document.getElementById("peanutWords");
let other = document.getElementById("otherWords");

chrome.storage.sync.get("completeList", (data) => {
    soy.innerHTML = data.completeList[0];
    wheat.innerHTML = data.completeList[1];
    milk.innerHTML = data.completeList[2];
    eggs.innerHTML = data.completeList[3];
    fish.innerHTML = data.completeList[4];
    shellfish.innerHTML = data.completeList[5];
    treenuts.innerHTML = data.completeList[6];
    peanuts.innerHTML = data.completeList[7];
    other.innerHTML = data.completeList[8];
})

function checkText(list){
    let pass = true;
    for(let p = 0; p < list.length; p++){
        for(word of list[p]){
            for(let i = 0; i < word.length; i++){
                if(word[i].toLowerCase() == word[i].toUpperCase() || word[i].toUpperCase() == word[i]){
                    pass = false;
                }
            }
        }
        if(!pass)
        return p;
    }
    return 10;
}

saveButton.addEventListener('click', async() =>
{
    let newsoy = document.getElementById("soyWords").value.split(',');
    let newwheat = document.getElementById("wheatWords").value.split(',');
    let newmilk = document.getElementById("milkWords").value.split(',');
    let neweggs = document.getElementById("eggWords").value.split(',');
    let newfish = document.getElementById("fishWords").value.split(',');
    let newshellfish = document.getElementById("shellfishWords").value.split(',');
    let newtreenuts = document.getElementById("treenutWords").value.split(',');
    let newpeanuts = document.getElementById("peanutWords").value.split(',');
    let newother = document.getElementById("otherWords").value.split(',');

    let completeList = [newsoy, newwheat, newmilk, neweggs, newfish, newshellfish, newtreenuts, newpeanuts, newother];

    let test = checkText(completeList);
    if(test == 10){
        console.log(completeList);
        chrome.storage.sync.set({ completeList });
    }
    else{
        switch (test){
            case 0:
                document.getElementById("soyWords").style.borderColor = "red";
                break;
            case 1:
                document.getElementById("wheatWords").style.borderColor = "red";
                break;
            case 2:
                document.getElementById("milkWords").style.borderColor = "red";
                break;
            case 3:
                document.getElementById("eggWords").style.borderColor = "red";
                break;
            case 4:
                document.getElementById("fishWords").style.borderColor = "red";
                break;
            case 5:
                document.getElementById("shellfishWords").style.borderColor = "red";
                break;
            case 6:
                document.getElementById("treenutWords").style.borderColor = "red";
                break;
            case 7:
                document.getElementById("peanutWords").style.borderColor = "red";
                break;
            default:
                document.getElementById("otherWords").style.borderColor = "red";
        }
        alert("Entries can only cantain lower case letters separated by commas.")
    }
});