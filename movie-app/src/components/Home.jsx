import React, { useState, useCallback, useEffect } from "react";
import requests from "../Requests";
import Hero from "./Hero/Hero";
import Loading from "./Loading/Loading";
import Slider from "./Slider/Slider";

const Home = ({ showTV = false }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  
  // TV states
  const [popularTV, setPopularTV] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);

  let movie = localStorage.getItem("movie") || "Avatar";
  const apiKey = "66804e1a9ce59ec83f1a0275eeab5d6f";

  // Batch fetch recommendations
  const getRecommendationMovies = useCallback(async (movieTitles) => {
    try {
      // Create a query string with all movie titles
      const query = movieTitles.join('|');
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=1`
      );
      const data = await response.json();
      return data.results.filter(movie => movie.poster_path);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }, [apiKey]);

  // Fetch trending and recent movies, and TV shows
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const promises = [
          fetch(requests.requestTrending),
          fetch(requests.requestRecent)
        ];

        if (showTV) {
          promises.push(
            fetch(requests.requestPopularTV),
            fetch(requests.requestTrendingTV),
            fetch(requests.requestTopRatedTV)
          );
        }

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));

        // Set trending and recent movies
        setTrendingMovies(data[0].results.filter(movie => movie.poster_path));
        setRecentMovies(data[1].results.filter(movie => movie.poster_path));

        // Set TV data if showTV is true
        if (showTV && data.length > 2) {
          setPopularTV(data[2].results.filter(show => show.poster_path));
          setTrendingTV(data[3].results.filter(show => show.poster_path));
          setTopRatedTV(data[4].results.filter(show => show.poster_path));
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchMoviesData();
  }, [showTV]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [moviesResponse, recommendationResponse] = await Promise.all([
          fetch("https://movie-recommender-system2.onrender.com/api/movies"),
          movie ? fetch(`https://movie-recommender-system2.onrender.com/api/similarity/${movie}`) : null
        ]);

        const moviesData = await moviesResponse.json();
        setMovies(moviesData.arr);

        if (movie) {
          const recommendationData = await recommendationResponse.json();
          const recommendedMovies = await getRecommendationMovies(recommendationData.movies);
          setRecommendation(recommendedMovies);
        } else {
          const popularResponse = await fetch(requests.requestPopular);
          const popularData = await popularResponse.json();
          setRecommendation(popularData.results.filter(movie => movie.poster_path));
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movie, getRecommendationMovies]);

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="md:mt-20">
          <Hero movies={movies} />

          {/* Current movie recommendations */}
          <Slider
            moviess={recommendation}
            id={!localStorage.getItem("movie") ? 1 : 2}
            name={movie}
            title={localStorage.getItem("movie") ? `Because you watched ${movie}` : "Popular Movies"}
          />

          {/* Trending movies section */}
          {trendingMovies.length > 0 && (
            <Slider
              moviess={trendingMovies}
              id={3}
              title="Trending Movies This Week"
            />
          )}

          {/* Similar movies section */}
          {recommendation.length > 0 && (
            <Slider
              moviess={recommendation.slice(Math.floor(recommendation.length / 2))}
              id={4}
              title={`More like ${movie}`}
            />
          )}

          {/* TV Series Sections - only shown when showTV is true */}
          {showTV && (
            <>
              {popularTV.length > 0 && (
                <Slider
                  moviess={popularTV}
                  id="popular-tv"
                  title="Popular TV Shows"
                  isTV={true}
                />
              )}

              {trendingTV.length > 0 && (
                <Slider
                  moviess={trendingTV}
                  id="trending-tv"
                  title="Trending TV Shows"
                  isTV={true}
                />
              )}

              {topRatedTV.length > 0 && (
                <Slider
                  moviess={topRatedTV}
                  id="top-rated-tv"
                  title="Top Rated TV Shows"
                  isTV={true}
                />
              )}
            </>
          )}

          {/* Recently Added Movies */}
          {recentMovies.length > 0 && (
            <Slider
              moviess={recentMovies}
              id="recent"
              title="Recently Added Movies"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
