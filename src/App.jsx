import { useEffect, useState, useRef } from "react";
import axios from "axios";

function App() {
  let [loading, setLoading] = useState(false);
  let [active, setActive] = useState(false);
  let [cityName, setCityName] = useState("Kathmandu");
  let [imgURL, setImgURL] = useState("");
  let [weatherData, setWeatherData] = useState(null);
  let [dataError, setDataError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // autofocus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!active) return; // only fetch if active triggered
    setLoading(true);
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2a1f42ab95bf5a4ae08ebfe370c3afa4&units=metric`;

    axios
      .get(apiURL)
      .then((res) => {
        if (res.status === 200) {
          setDataError(false);
          setWeatherData({ ...res.data });
          setImgURL(
            `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
          );
        } else {
          setDataError(true);
          setWeatherData(null);
        }
      })
      .catch(() => {
        setDataError(true);
        setWeatherData(null);
      })
      .finally(() => {
        setLoading(false);
        setActive(false);
      });
  }, [active, cityName]);

  function handleCityChange(e) {
    setCityName(e.target.value);
  }

  function handleCitySet() {
    if (cityName.trim() === "") {
      setDataError(true);
      setWeatherData(null);
      return;
    }
    setActive(true);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleCitySet();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-600 flex flex-col items-center justify-start p-4 sm:p-8">
      <header className="text-white text-4xl font-extrabold mb-8 drop-shadow-lg text-center">
        Weather Forecast
      </header>

      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
          <label
            htmlFor="city__field"
            className="text-gray-700 font-semibold mb-1 sm:mb-0"
          >
            Place Name:
          </label>
          <input
            id="city__field"
            ref={inputRef}
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={cityName}
            onChange={handleCityChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter city name"
            aria-label="City name input"
          />
          <button
            className={`mt-3 sm:mt-0 bg-blue-600 text-white rounded-md px-5 py-2 font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed`}
            onClick={handleCitySet}
            disabled={loading}
            aria-label="Fetch weather"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>

        {dataError && (
          <div className="text-red-600 text-center font-semibold mb-4">
            No Data Found. Please check the city name.
          </div>
        )}

        {weatherData && !loading && (
          <div className="flex flex-col items-center gap-4">
            <img
              className="drop-shadow-lg"
              src={imgURL}
              alt={weatherData.weather[0].description || "Weather Icon"}
              width={120}
              height={120}
            />
            <p className="text-lg font-semibold text-gray-700 capitalize drop-shadow-sm">
              {weatherData.weather[0].main} Sky
            </p>

            <div className="w-full bg-blue-50 rounded-lg p-4 shadow-inner">
              <p className="flex justify-between text-gray-800 mb-1">
                <span>Temperature:</span>{" "}
                <span className="font-bold">{weatherData.main.temp} °C</span>
              </p>
              <p className="flex justify-between text-gray-800 mb-1">
                <span>Wind Speed:</span>{" "}
                <span className="font-bold">{weatherData.wind.speed} km/h</span>
              </p>
              <p className="flex justify-between text-gray-800">
                <span>Humidity:</span>{" "}
                <span className="font-bold">{weatherData.main.humidity} %</span>
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 drop-shadow-md mt-3">
              {weatherData.name}
            </h2>
          </div>
        )}

        {!weatherData && !loading && !dataError && (
          <p className="text-center text-gray-500">Enter a city to get started.</p>
        )}
      </div>
    </div>
  );
}

export default App;
