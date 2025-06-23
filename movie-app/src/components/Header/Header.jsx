import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import requests from "../../Requests";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isTV = location.pathname.startsWith("/tv");

  useEffect(() => {
    // Reset search when switching between movies and TV shows
    setSearchQuery("");
    setSuggestions([]);
    setShowSearch(false);
  }, [isTV]);

  useEffect(() => {
    // Fetch movies for suggestions
    fetch("https://movie-recommender-system2.onrender.com/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.arr))
      .catch((error) => console.error("Error fetching movies:", error));

    // Fetch TV shows for suggestions
    const fetchTVShows = async () => {
      try {
        const [popularRes, topRatedRes] = await Promise.all([
          fetch(requests.requestPopularTV),
          fetch(requests.requestTopRatedTV)
        ]);
        
        const popularData = await popularRes.json();
        const topRatedData = await topRatedRes.json();
        
        // Combine and deduplicate shows
        const allShows = [...popularData.results, ...topRatedData.results];
        const uniqueShows = Array.from(new Set(allShows.map(show => show.name)))
          .map(name => allShows.find(show => show.name === name));
        
        setTvShows(uniqueShows);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }
    };

    fetchTVShows();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${isTV ? 'tv' : 'movie'}/${searchQuery}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSearch(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      if (isTV) {
        // Filter TV shows
        const filtered = tvShows
          .filter(show => 
            show.name.toLowerCase().includes(value.toLowerCase()) ||
            (show.original_name && show.original_name.toLowerCase().includes(value.toLowerCase()))
          )
          .slice(0, 5)
          .map(show => ({
            id: show.id,
            title: show.name,
            original_title: show.original_name
          }));
        setSuggestions(filtered);
      } else {
        // Filter movies
        const filtered = movies
          .filter((movie) => movie.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5);
        setSuggestions(filtered);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    const title = typeof item === 'string' ? item : item.title;
    navigate(`/${isTV ? 'tv' : 'movie'}/${title}`);
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
        <div className="flex items-center gap-8">
          <button
            className="font-bold tracking-widest md:text-lg text-sm hover:text-[#ECB22E] hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            WatchBuddy
          </button>

          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => navigate("/")}
              className={`hover:text-[#ECB22E] transition-colors ${
                isActive("/") ? "text-[#ECB22E]" : ""
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => navigate("/tv")}
              className={`hover:text-[#ECB22E] transition-colors ${
                isActive("/tv") ? "text-[#ECB22E]" : ""
              }`}
            >
              TV Shows
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="search-container relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-l-md text-white bg-[#2D2D2D] border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#ECB22E] text-sm"
                  placeholder={`Search ${isTV ? 'TV shows' : 'movies'}...`}
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
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm text-gray-200 hover:bg-[#3D3D3D] cursor-pointer border-b border-gray-700 last:border-0"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {typeof item === 'string' ? item : (
                          <>
                            {item.title}
                            {item.original_title && item.original_title !== item.title && (
                              <span className="text-gray-400 text-sm ml-2">
                                ({item.original_title})
                              </span>
                            )}
                          </>
                        )}
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
