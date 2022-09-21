let allergenNames = ["soy", "wheat", "milk", "eggs", "fish", "shellfish", "treenuts", "peanuts"];
let allergens = [true, true, true, true, true, true, true, true];

let wheat = ["wheat", "bulgar", "couscous", "durum", "einkorn", "emmer", "farina", "farro", "freekeh", "kamut", "matzoh", "flour", "pasta", "seitan", "spelt", "tritcale"];
let egg = ["albumin", "albumen", "apovitellin", "egg", "eggnog", "lysozyme", "mayonnaise", "meringue", "ovalbumin", "ovomucoid", "ovovitellin", "surimi", "vitellin"];
let peanut = ["arachis", "peanut", "nuts", "lupin", "mandelonas", "nut"];
let milk = ["butter", "buttermilk", "casein", "caseinates", "cheese", "cream", "curds", "custard", "ghee", "halfandhalf", "lactalbumin", "lactoferrin", "lactoglobulin", "lactose", "lactulose", "milk", "pudding", "recaldent", "simplesse", "tagatose", "whey", "yogurt"];
let soy = ["soy", "edamame", "miso", "natto", "okara", "shoyu", "soya", "soybean", "tamari", "tempeh", "tofu"];
let treeNut = ["almonds", "nuts", "breechnut", "walnut", "butternut", "cashew", "chestnut", "chinquapin", "coconut", "filbert", "hazelnut", "gianduja", "ginkgo", "litchi", "lichee", "lychee", "macadamia", "marzipan", "nangai", "nut", "pecan", "pesto", "pili", "pistachio", "praline", "shea"];
let shellfish = ["barnacle", "crab", "crawfish", "krill", "lobster", "prawns", "shrimp"];
let fish = ["anchovies", "bass", "catfish", "cod", "flounder", "grouper", "haddock", "hake", "halibut", "herring", "mahi", "perch", "pike", "pollock", "salmon", "scrod", "sole", "snapper", "swordfish", "tilapia", "trout", "tuna", "fish"];
let other = [];

let completeList = [soy, wheat, milk, egg, fish, shellfish, treeNut, peanut, other];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ allergens });
    chrome.storage.sync.set({ completeList });

    console.log('Allergens set to true are:');
    for (let i = 0; i < allergens.length; i++){
        if(allergens[i] == true){
            console.log(allergenNames[i])
        }
    }
});