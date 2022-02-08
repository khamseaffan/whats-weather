const weatherInfoCard = document.querySelector(".weather");

let newsFetcher = {
  randomFnc: () => {
    console.log("Affan Khamse");
  },

  fetchNewsReport: function (searchedCity) {
    console.log("Fetching Started");
    document.querySelector(".newsSection").innerHTML = "<h4>Loading....</h4>";
    let newsUrl = `https://newsapi.org/v2/everything?q=${searchedCity}&sortBy=popularity&apiKey=403af102e6e94d4f899f8d23cf8cb4e3`;
    fetch(newsUrl)
      .then((response) => response.json())
      .then((data) => newsFetcher.loadNews(data));
  },
  loadNews: function (data) {
    console.log(data);
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
    document.querySelector(".newsSection").innerHTML = "";
    document.querySelector(".newsSection").innerHTML = news;
  },
};

let weather = {
  api_key: "6fabf0a356ff6bd0c36843891fe87692",
  fetchWeather: function (city) {
    if (!weatherInfoCard.classList.contains("loading")) {
      weatherInfoCard.classList.add("loading");
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
    weatherInfoCard.classList.remove("loading");
  },
};

function handleClick() {
  let searchedCity = document.querySelector(".search-bar").value;
  if (!searchedCity) {
    console.log("city Value to search not enterrd");
    return;
  }

  weather.fetchWeather(searchedCity);
  newsFetcher.randomFnc();
  newsFetcher.fetchNewsReport(searchedCity);
}

document.querySelector(".search button").addEventListener("click", function () {
  location.reload();
  handleClick();
});

// document.addEventListener("keydown", (event) => {
//   if (event.key == "Enter") {
//     weather.handleClick();
//   }
// });

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      handleClick();
    }
  });

// weather.fetchWeather("california");
