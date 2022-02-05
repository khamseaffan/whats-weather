const weatehrInfoCard = document.querySelector(".weather");

let news = {
  fetchNewsReport: function (searchedCity) {
    console.log("Fetching Started");
    let newsUrl = `https://newsapi.org/v2/everything?q=${searchedCity}&sortBy=popularity&apiKey=<NEWSAPI.ORG KEY>`;
    fetch(newsUrl)
      .then((response) => response.json())
      .then((data) => this.loadNews(data));
  },
  loadNews: (data) => {
    news = "";
    for (let i = 0; i < 5; i++) {
      let { title, description, url, urlToImage } = data.articles[i];

      if (title.length > 60) {
        title = title.substring(0, 55) + "...";
      }
      if (description.length > 180) {
        description = description.substring(0, 178) + "...";
      }

      news += `<a class="newsTile" href="${url}">
                <img src="${urlToImage}" alt="" />
                <div class="content">
                  <p><span class="title">${title}</span>
                    <p class="description">${description}</p></p>
                </div>
              </a>\n`;
    }
    document.querySelector(".newsSection").innerHTML = news;
  },
};

let weather = {
  api_key: "<openweatherApp API_KEY>",
  fetchWeather: function (city) {
    if (!weatehrInfoCard.classList.contains("loading")) {
      weatehrInfoCard.classList.add("loading");
    }
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.api_key}`
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp } = data.main;
    const { speed } = data.wind;
    const { humidity } = data.main;

    document.querySelector(".city").textContent = `Weather Of ${name}`;
    document.querySelector(".temp").textContent = `${temp}°C`;
    document.querySelector(
      ".icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").textContent = description;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent = `Wind Speed: ${speed} m/sec`;
    document.body.style.backgroundImage =
      "url(" + `https://source.unsplash.com/1600x900/?${name}` + ")";
    weatehrInfoCard.classList.remove("loading");
  },
  handelClick: () => {
    let searchedCity = document.querySelector(".search-bar").value;
    if (!searchedCity) {
      console.log("city Value to search not enterrd");
      return;
    }

    weather.fetchWeather(searchedCity);
    news.fetchNewsReport(searchedCity);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.handelClick();
});

// document.addEventListener("keydown", (event) => {
//   if (event.key == "Enter") {
//     weather.handelClick();
//   }
// });

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.handelClick();
    }
  });

// weather.fetchWeather("california");
