const weatherInfoCard = document.querySelector(".weather");

let apiKeys = {
  news_api_key: "",
  weather_api_key: ""
};

// Function to fetch API keys
function fetchApiKeys() {
  return fetch('config.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      return response.json();
    })
    .then((data) => {
      apiKeys.news_api_key = data.news_api_key;
      apiKeys.weather_api_key = data.weather_api_key;
    })
    .catch((error) => {
      console.error('Error fetching API keys:', error);
    });
}

let newsFetcher = {
  fetchNewsReport: function (searchedCity) {
    document.querySelector(".newsSection").innerHTML = "<h4>Loading....</h4>";
    let newsUrl = `https://newsapi.org/v2/everything?q=${searchedCity}&sortBy=popularity&apiKey=${apiKeys.news_api_key}`;
    fetch(newsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => this.loadNews(data))
      .catch((error) => {
        console.error("Fetch error: ", error);
        document.querySelector(".newsSection").innerHTML = "<h4>Failed to load news.</h4>";
      });
  },
  loadNews: function (data) {
    if (!data.articles || data.articles.length === 0) {
      document.querySelector(".newsSection").innerHTML = "<h4>No news found.</h4>";
      return;
    }
    
    let news = "";
    let count = 0;
    for (let i = 0; i < data.articles.length && count < 5; i++) {
      let { title, description, url, urlToImage } = data.articles[i];

      if (!urlToImage) continue; // Skip articles without an image

      if (title.length > 60) {
        title = title.substring(0, 55) + "...";
      }
      if (description.length > 180) {
        description = description.substring(0, 178) + "...";
      }

      news += `<a class="newsTile" href="${url}" target="_blank">
                <img src="${urlToImage}" alt="News Image" />
                <div class="content">
                  <p><span class="title">${title}</span></p>
                  <p class="description">${description}</p>
                </div>
              </a>\n`;
      count++;
    }
    document.querySelector(".newsSection").innerHTML = news || "<h4>No suitable news found.</h4>";
  },
};

let eventsFetcher = {
  fetchEventsReport: function (searchedCity) {
    document.querySelector(".eventsSection").innerHTML = "<h4>Loading....</h4>";
    let eventsUrl = `https://newsapi.org/v2/everything?q=${searchedCity} events&sortBy=popularity&apiKey=${apiKeys.news_api_key}`;
    fetch(eventsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => this.loadEvents(data))
      .catch((error) => {
        console.error("Fetch error: ", error);
        document.querySelector(".eventsSection").innerHTML = "<h4>Failed to load events.</h4>";
      });
  },
  loadEvents: function (data) {
    if (!data.articles || data.articles.length === 0) {
      document.querySelector(".eventsSection").innerHTML = "<h4>No events found.</h4>";
      return;
    }
    
    let events = "";
    let count = 0;
    for (let i = 0; i < data.articles.length && count < 5; i++) {
      let { title, description, url, urlToImage } = data.articles[i];

      if (!urlToImage) continue; // Skip articles without an image

      if (title.length > 60) {
        title = title.substring(0, 55) + "...";
      }
      if (description.length > 180) {
        description = description.substring(0, 178) + "...";
      }

      events += `<a class="eventsTile" href="${url}" target="_blank">
                <img src="${urlToImage}" alt="Event Image" />
                <div class="content">
                  <p><span class="title">${title}</span></p>
                  <p class="description">${description}</p>
                </div>
              </a>\n`;
      count++;
    }
    document.querySelector(".eventsSection").innerHTML = events || "<h4>No suitable events found.</h4>";
  },
};

let weather = {
  fetchWeather: function (city) {
    if (!weatherInfoCard.classList.contains("loading")) {
      weatherInfoCard.classList.add("loading");
    }
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKeys.weather_api_key}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => {
        console.error("Fetch error: ", error);
        weatherInfoCard.innerHTML = "<h4>Failed to load weather data.</h4>";
        weatherInfoCard.classList.remove("loading");
      });
  },
  displayWeather: function (data) {
    if (!data || !data.weather || data.weather.length === 0) {
      weatherInfoCard.innerHTML = "<h4>Invalid weather data received.</h4>";
      weatherInfoCard.classList.remove("loading");
      return;
    }

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
    weatherInfoCard.classList.remove("loading");
  },
};

function handleClick() {
  let searchedCity = document.querySelector(".search-bar").value;
  if (!searchedCity) {
    console.log("City value to search not entered");
    return;
  }

  weather.fetchWeather(searchedCity);
  newsFetcher.fetchNewsReport(searchedCity);
  eventsFetcher.fetchEventsReport(searchedCity);
}

document.querySelector(".search button").addEventListener("click", function () {
  handleClick();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      handleClick();
    }
  });

// Fetch API keys and initialize the application
fetchApiKeys().then(() => {
  
});
