const amount = document.getElementById("amount");
const convertAm = document.getElementById("converted-amount");
const convertBtn = document.getElementById("convert");
const historyBtn = document.getElementById("historical-rates");
const historyRate = document.getElementById("historical-rates-container");
const favBtn = document.getElementById("save-favorite");
const favBtnPairs = document.getElementById("favorite-currency-pairs");
const base = document.getElementById("base-currency");
const target = document.getElementById("target-currency");

let myHeaders = new Headers();
myHeaders.append("apikey", "mDXvex3ulofSEWwr8GBm15bW6wi9pp2m");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders
};

const list = () => {
  fetch(`https://api.apilayer.com/exchangerates_data/latest`, requestOptions)
    .then(response => response.text())
    .then(results => {
      let obj = JSON.parse(results);
      let currencyList = Object.keys(obj.rates);
      currencyList.map(i => {
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        base.append(option);
      });
      currencyList.map(i => {
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        target.append(option);
      });
    })
    .catch(error => {
      console.log("error", error);
      alert("Something went wrong. Please try again in a few minutes.");
    });
};

const convert = (c1, c2, a) => {
  fetch(`https://api.apilayer.com/exchangerates_data/convert?from=${c1}&to=${c2}&amount=${a}`, requestOptions)
    .then(response => response.text())
    .then(results => (convertAm.innerText = JSON.parse(results).result))
    .catch(error => {
      console.log("error", error);
      convertAm.innerText = "Couldn't compare. Try again.";
    });
};

const history = (c1, c2) => {
  fetch(`https://api.apilayer.com/exchangerates_data/2000-04-03?base=${c1}&symbols=${c2}`, requestOptions)
    .then(response => response.text())
    .then(results => {
      let obj = JSON.parse(results);
      historyRate.innerText = `04/03/2000: 1 ${c1} = ${Object.values(obj.rates)[0]} ${c2}`;
    })
    .catch(error => {
      console.log("error", error);
      historyRate.innerText = "Couldn't compare historical rates. Try again";
    });
};

list();

convertBtn.addEventListener("click", e => {
  e.preventDefault();
  convert(base.value, target.value, amount.value);
  historyRate.innerHTML = "";
});

historyBtn.addEventListener("click", e => {
  e.preventDefault();
  history(base.value, target.value);
});

favBtn.addEventListener("click", e => {
  e.preventDefault();
  let baseVal = base.value;
  let targetVal = target.value;
  const newBtn = document.createElement("button");
  favBtnPairs.append(newBtn);
  newBtn.innerText = `${baseVal}/${targetVal}`;
  newBtn.addEventListener("click", e => {
    e.preventDefault();
    convert(baseVal, targetVal, amount.value);
    base.value = baseVal;
    target.value = targetVal;
  });
});
