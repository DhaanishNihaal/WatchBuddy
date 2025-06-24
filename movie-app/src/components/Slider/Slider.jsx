import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Movie from "../Movie";

const Slider = ({ moviess, id, name, title, isTV = false }) => {
  const [movies, setMovies] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Get watch history from localStorage
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setRecentHistory(history);
    setMovies(moviess);
  }, [moviess]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    setIsScrolling(true);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => {
        slider.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const slideLeft = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = sliderRef.current.scrollLeft - 500;
    }
  }, []);

  const slideRight = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = sliderRef.current.scrollLeft + 500;
    }
  }, []);

  // Only render movies that are likely to be visible
  const getVisibleMovies = useCallback(() => {
    if (!movies || movies.length === 0) return [];
    const itemWidth = 280; // Maximum width of a movie item
    const containerWidth = window.innerWidth;
    const visibleItems = Math.ceil(containerWidth / itemWidth) + 2; // Add buffer
    
    return movies.slice(0, visibleItems * 2); // Show 2 screens worth of items
  }, [movies]);

  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white rounded-full absolute left-0 opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        <div
          ref={sliderRef}
          id={`slider-${id}`}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
          style={{
            scrollBehavior: isScrolling ? 'auto' : 'smooth'
          }}
        >
          {getVisibleMovies().map((item, index) => (
            <Movie key={index} item={item} isTV={isTV} />
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="bg-white rounded-full absolute right-0 opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>
    </>
  );
};

export default React.memo(Slider);
