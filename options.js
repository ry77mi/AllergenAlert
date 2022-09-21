let page = document.getElementById("buttonDiv");
const allergenNames = ["soy", "wheat", "milk", "eggs", "fish", "shellfish", "treenuts", "peanuts"];

function handleCheckbox(event){
    let allergen = parseInt(event.target.dataset.allergen);
    chrome.storage.sync.get("allergens", (data) => {
        let allergens = data.allergens;
        if(event.target.checked){
            allergens[allergen] = true;
            console.log(allergens);
        }
        else{
            allergens[allergen] = false;
            console.log(allergens);

        }
        chrome.storage.sync.set({allergens})
    });
}

function constructOptions(names){
    chrome.storage.sync.get("allergens", (data) => {
        console.log(data.allergens);
        
        for (let i = 0; i < names.length; i++){

            let space = document.createElement("br");
            let lable = document.createElement("lable");
            lable.innerHTML = names[i];
            
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            if(data.allergens[i]){
                checkbox.setAttribute("checked", "true");
            }
            checkbox.dataset.allergen = i;

            checkbox.addEventListener("change", handleCheckbox);
            page.appendChild(checkbox);
            page.appendChild(lable);
            page.appendChild(space);

        }
    });
}

constructOptions(allergenNames);