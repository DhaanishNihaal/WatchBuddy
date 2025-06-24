import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import requests from "../../Requests";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [filteredMovie, setFilteredMovie] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Auto-slide effect with smooth transition
  useEffect(() => {
    if (movies.length === 0) return;

    const slideTimer = setInterval(() => {
      const nextIndex = (currentMovieIndex + 1) % movies.length;
      setIsTransitioning(true);
      setCurrentMovieIndex(nextIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 6000); // Total time per slide: 6s (5.5s display + 0.5s transition)

    return () => clearInterval(slideTimer);
  }, [movies.length, currentMovieIndex]);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1`
        );
        const data = await response.json();
        // Filter movies with backdrop images and good overview text
        const validMovies = data.results.filter(
          movie => movie.backdrop_path && movie.overview && movie.overview.length > 100
        );
        setMovies(validMovies.slice(0, 5)); // Take top 5 movies for the slider
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      }
    };

    fetchTopRatedMovies();
  }, []);

  const handleSlideChange = (newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentMovieIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setName(value);

    if (value.trim()) {
      try {
        const response = await fetch(
          `https://movie-recommender-system2.onrender.com/api/movies`
        );
        const data = await response.json();
        const filteredMovies = data.arr
          .filter(movie => 
            movie.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 8);
        setFilteredMovie(filteredMovies);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setFilteredMovie([]);
    }
  };

  const currentMovie = movies[currentMovieIndex];

  return (
    <section className="w-full h-[550px] text-white overflow-hidden mt-16">
      <div className="w-full h-full relative">
        <div className="absolute w-full h-[550px] bg-gradient-to-r from-black z-10"></div>
        {!loading && currentMovie && (
          <>
            <img
              key={currentMovie.id}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
              src={`https://image.tmdb.org/t/p/original/${currentMovie.backdrop_path}`}
              alt={currentMovie.title}
            />
            <div className={`absolute w-full top-[20%] p-4 md:p-8 z-20 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'
            }`}>
              <h1 className="text-3xl md:text-5xl font-bold">
                {currentMovie.title}
              </h1>
              <div className="my-4">
                <button
                  className="border bg-gray-300 text-black border-gray-300 py-2 px-5 hover:bg-[#ECB22E] hover:border-[#ECB22E] transition-colors duration-300"
                  onClick={() => navigate(`/movie/${currentMovie.title}`)}
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Release Date: {currentMovie.release_date}
              </p>
              <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
                {currentMovie.overview}
              </p>
              <div className="flex items-center mt-4">
                <div className="text-[#ECB22E] text-lg mr-2">★</div>
                <div className="text-gray-200">
                  {currentMovie.vote_average.toFixed(1)}/10
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="absolute top-24 right-4 md:right-8 w-72 z-30">
        <input
          onChange={handleSearch}
          value={name}
          className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECB22E]"
          type="text"
          placeholder="Search Movies..."
        />
        {filteredMovie.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
            {filteredMovie.map((movie, index) => (
              <div
                key={index}
                className="text-left text-sm md:text-base text-gray-200 hover:bg-[#3D3D3D] p-3 cursor-pointer border-b border-gray-700 last:border-0"
                onClick={() => {
                  navigate(`/movie/${movie}`);
                  setName("");
                  setFilteredMovie([]);
                }}
              >
                {movie}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentMovieIndex ? 'bg-[#ECB22E] w-6' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            onClick={() => handleSlideChange(index)}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
