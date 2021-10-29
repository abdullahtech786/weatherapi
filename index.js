/** @format */

const UI = {
  loadSelector() {
    const cityElm = document.querySelector(".city");
    const cityInfoElm = document.querySelector(".w-city");
    const iconElm = document.querySelector(".w-icon");
    const temperatureElm = document.querySelector(".w-temp");
    const pressureElm = document.querySelector(".w-pressure");
    const humidityElm = document.querySelector(".w-humidity");
    const feelElm = document.querySelector(".w-feel");
    const formElm = document.querySelector(".form");
    const countryElm = document.querySelector(".country");
    const messageElm = document.querySelector(".messageWrapper");

    return {
      cityElm,
      cityInfoElm,
      iconElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      formElm,
      countryElm,
      messageElm,
    };
  },

  hidemessgae() {
    const { messageElm } = this.loadSelector();
    setTimeout(() => {
      messageElm.innerHTML = "";
    }, 2000);
  },
  showmessage(msg) {
    const { messageElm } = this.loadSelector();
    const elem = `<div class="text-white display-5 mb-3 bg-danger p-3">${msg} </div>`;
    messageElm.innerHTML = elem;
    this.hidemessgae();
  },

  validateInput(city, country) {
    if (city === "" && country === "") {
      this.showmessage("Please type your city and country as well");
      return false;
    }
    return true;
  },
  getInput() {
    const { countryElm, cityElm } = this.loadSelector();
    const country = countryElm.value;
    const city = cityElm.value;
    const isvalidated = this.validateInput(city, country);
    return { city, country, isvalidated };
  },
  clearInput() {
    const { countryElm, cityElm } = this.loadSelector();
    countryElm.value = "";
    cityElm.value = "";
  },
  getIcon(iconCode) {
    return "https://openweathermap.org/img/w/" + iconCode + ".png";
  },

  async getAndPopulateUI() {
    const { city, country } = storage.getData();
    weatherData.city = city;
    weatherData.country = country;
    const data = await weatherData.getData();
    this.populateUI(data);
  },
  populateUI(data) {
    const {
      cityInfoElm,
      iconElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      messageElm,
    } = this.loadSelector();
    const { weather, main, name: cityName } = data;
    const url = this.getIcon(weather[0].icon);
    cityInfoElm.textContent = cityName;
    temperatureElm.textContent = `Temperature: ${main.temp} °C`;
    pressureElm.textContent = `Pressure: ${main.pressure} KPA`;
    humidityElm.textContent = `Humidity: ${main.humidity}`;
    feelElm.textContent = weather[0].main;
    iconElm.setAttribute("src", url);
  },
  init() {
    const { formElm } = this.loadSelector();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { city, country, isvalidated } = this.getInput();

      this.clearInput();

      if (isvalidated) {
        // Setting city and country
        weatherData.city = city;
        weatherData.country = country;
        // Saving data into local storage
        storage.city = city;
        storage.country = country;
        // Saving to local storage
        storage.saveData();
        const data = await weatherData.getData();
        // Populate UI
        if (data) {
          this.populateUI(data);
        }
      }
    });
    window.addEventListener("DOMContentLoaded", () => {
      console.log(this);
      this.getAndPopulateUI();
    });
  },
};
UI.init();

// Temp Data store and dealing with that data
weatherData = {
  city: "",
  country: "",
  APP_ID: "4b59587f4250a4d7dc78e29bf999f202",
  async getData() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city}, ${this.country}&units=metric&appid=${this.APP_ID}`
      );
      const data = await res.json();
      if (data.cod >= 400) {
        UI.showMessage(data.message);
        return false;
      } else {
        return data;
      }
    } catch (err) {
      UI.showMessage("Problem in fetching weather");
    }
  },
};

// Local storage

storage = {
  city: "",
  country: "",
  saveData() {
    localStorage.setItem("BD_WEATHER_CITY", this.city);
    localStorage.setItem("BD_WEATHER_COUNTRY", this.country);
  },
  getData() {
    const city = localStorage.getItem("BD_WEATHER_CITY") || "Dhaka";
    const country = localStorage.getItem("BD_WEATHER_COUNTRY") || "BD";
    return {
      city,
      country,
    };
  },
};
