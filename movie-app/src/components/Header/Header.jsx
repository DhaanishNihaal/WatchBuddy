import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch all movies for suggestions
    fetch("https://movie-recommender-system2.onrender.com/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.arr))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movie/${searchQuery}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSearch(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Filter movies for suggestions
    if (value.trim()) {
      const filtered = movies.filter((movie) =>
        movie.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movie) => {
    navigate(`/movie/${movie}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSearch(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#1F1F1F] text-white h-16 z-10 flex items-center fixed top-0 w-full transition-all duration-300 border-b border-gray-800">
      <div className="md:mx-5 flex items-center justify-between p-4 w-full">
        <button
          className="font-bold tracking-widest md:text-lg text-sm hover:text-[#ECB22E] hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          WatchBuddy
        </button>

        <div className="flex items-center gap-4">
          <div className="search-container relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-l-md text-white bg-[#2D2D2D] border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#ECB22E] text-sm"
                  placeholder="Search movies..."
                />
                <button
                  type="submit"
                  className="bg-[#ECB22E] text-white px-3 py-1 rounded-r-md hover:bg-[#2D2D2D] border border-[#ECB22E] transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-[#2D2D2D] rounded-md shadow-lg overflow-hidden z-50 border border-gray-700">
                    {suggestions.map((movie, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm text-gray-200 hover:bg-[#3D3D3D] cursor-pointer border-b border-gray-700 last:border-0"
                        onClick={() => handleSuggestionClick(movie)}
                      >
                        {movie}
                      </div>
                    ))}
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-[#ECB22E] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
          </div>
          <h2 className="font-thin tracking-widest md:text-base text-sm hover:text-[#ECB22E]">
            Hello' Dhaanish Nihaal
          </h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
