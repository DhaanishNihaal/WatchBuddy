import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Movie from "../Movie";

const Slider = ({ moviess, id, name, title }) => {
  const [movies, setMovies] = useState(moviess);
  const [recentHistory, setRecentHistory] = useState([]);
  const [categories, setCategories] = useState({
    recent: [],
    popular: [],
    trending: [],
    similar: []
  });

  useEffect(() => {
    // Get watch history from localStorage
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setRecentHistory(history);

    // Organize movies into categories
    if (movies && movies.length > 0) {
      const movieChunks = chunk(movies, Math.ceil(movies.length / 4));
      setCategories({
        recent: movieChunks[0] || [],
        popular: movieChunks[1] || [],
        trending: movieChunks[2] || [],
        similar: movieChunks[3] || []
      });
    }
  }, [movies]);

  useEffect(() => {
    setMovies(moviess);
  }, [moviess]);

  // Helper function to chunk array into smaller arrays
  const chunk = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const slideLeft = (sliderId) => {
    const slider = document.getElementById(sliderId);
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = (sliderId) => {
    const slider = document.getElementById(sliderId);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <section className="md:px-20 px-5 mt-7">
      <h1 className="font-bold text-[#ECB22E] text-left font-mono text-sm md:text-lg mb-4">
        {title || `More like ${name?.split(':')[0] || 'these'}`}
      </h1>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={() => slideLeft(`slider-${id}`)}
          className="bg-[#2D2D2D] text-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        <div
          id={`slider-${id}`}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          <div className="flex gap-2 items-stretch">
            {movies?.map((item, idx) => (
              <div key={idx} className="inline-block flex-shrink-0">
                <Movie item={item} />
              </div>
            ))}
          </div>
        </div>
        <MdChevronRight
          onClick={() => slideRight(`slider-${id}`)}
          className="bg-[#2D2D2D] text-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>
    </section>
  );
};

export default Slider;
