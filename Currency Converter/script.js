const dropList = document.querySelectorAll(".drop-list select");
 FromCurrency = document.querySelector(".from select");
 toCurrency = document.querySelector(".to select");

getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(currency_code in country_code) {
        let selected;
        // Selecting USD by default as FROM currency and NPR as TO currency
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i ==1) {
            selected = currency_code == "NPR" ? "selected" : "";
        }

        //Creates option with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e=> {
        loadFlag(e.target); //Calling loadFlag with passing target element as an argument 
    });
}

function loadFlag(element) {
    for(code in country_code) {
        if(code == element.value){ // if currency code is equal to option value

            let imgTag = element.parentElement.querySelector("img") //Selecting img tag of particular drop list

            //Passes country code of a selected currency code thru an image url
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault(); //Prevents form from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=> { //When the exchange icon is clicked, run this code.

    let tempCode = FromCurrency.value; // Stores the current "From" currency temporarily before swapping

    FromCurrency.value = toCurrency.value; //Puts the "To" currency into the "From" dropdown

    toCurrency.value = tempCode; //Puts the saved old "From" currency inside the "To" dropdown

    loadFlag(FromCurrency); // Load From Currency flags

    loadFlag(toCurrency); // Load To Currency flags

    getExchangeRate(); // Update exchange rate
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input"), //Finds the <input> inside the element with the class .amount and Stores that HTML input element in the variable amount.
    exchangeRateTxt = document.querySelector(".exchange-rate"); //Finds the element with the class .exchange-rate and Stores the element in the variable exchangeRateTxt.
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let amountVal = amount.value;
    //if user does not enter value or enter 0 then 1 will be the value
    if(amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    //Creates the API URL that will be used to get exchange rates and ${FromCurrency.value} inserts the selected currency.
    let url = `https://v6.exchangerate-api.com/v6/0eaa5b3f72e6871c59088451/latest/${FromCurrency.value}`; 
    // Fetches exchange rates, calculates conversion, and displays the result
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]; //gets the specific currency rate from the API response.
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2); //does the calculation
        exchangeRateTxt.innerText = `${amountVal} ${FromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`; //displays the result on the page.
    }).catch(() => { //If user is offline or any other error occured when fetching data
        exchangeRateTxt.innerText = "Something went wrong";
    });
}