import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import requests from "../../Requests";

const TVHero = () => {
  const [shows, setShows] = useState([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [filteredShows, setFilteredShows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedShows = async () => {
      try {
        const response = await fetch(requests.requestTopRatedTV);
        const data = await response.json();
        // Filter shows with backdrop images and good overview text
        const validShows = data.results.filter(
          show => show.backdrop_path && show.overview && show.overview.length > 100
        );
        setShows(validShows.slice(0, 5)); // Take top 5 shows for the slider
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top rated shows:", error);
      }
    };

    fetchTopRatedShows();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (shows.length === 0) return;

    const interval = setInterval(() => {
      setCurrentShowIndex((prevIndex) => (prevIndex + 1) % shows.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [shows]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setName(value);

    if (value.trim()) {
      try {
        const response = await fetch(requests.requestSearchTV + value);
        const data = await response.json();
        const shows = data.results
          .filter(show => show.name && show.poster_path)
          .map(show => show.name);
        setFilteredShows(shows.slice(0, 8));
      } catch (error) {
        console.error("Error searching shows:", error);
      }
    } else {
      setFilteredShows([]);
    }
  };

  const currentShow = shows[currentShowIndex];

  return (
    <section className="w-full h-[550px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-full h-[550px] bg-gradient-to-r from-black"></div>
        {!loading && currentShow && (
          <>
            <img
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/original/${currentShow.backdrop_path}`}
              alt={currentShow.name}
            />
            <div className="absolute w-full top-[20%] p-4 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold">{currentShow.name}</h1>
              <div className="my-4">
                <button
                  className="border bg-gray-300 text-black border-gray-300 py-2 px-5 hover:bg-[#ECB22E] hover:border-[#ECB22E]"
                  onClick={() => navigate(`/tv/${currentShow.name}`)}
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                First Air Date: {currentShow.first_air_date}
              </p>
              <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
                {currentShow.overview}
              </p>
              <div className="flex items-center mt-4">
                <div className="text-[#ECB22E] text-lg mr-2">★</div>
                <div className="text-gray-200">
                  {currentShow.vote_average.toFixed(1)}/10
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="absolute top-24 right-4 md:right-8 w-72">
        <input
          onChange={handleSearch}
          value={name}
          className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECB22E]"
          type="text"
          placeholder="Search TV Shows..."
        />
        {filteredShows.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
            {filteredShows.map((show, index) => (
              <div
                key={index}
                className="text-left text-sm md:text-base text-gray-200 hover:bg-[#3D3D3D] p-3 cursor-pointer border-b border-gray-700 last:border-0"
                onClick={() => {
                  navigate(`/tv/${show}`);
                  setName("");
                  setFilteredShows([]);
                }}
              >
                {show}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {shows.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentShowIndex ? 'bg-[#ECB22E] w-4' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentShowIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default TVHero; 