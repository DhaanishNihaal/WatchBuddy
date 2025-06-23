import React, { useState, useCallback, useEffect } from "react";
import requests from "../Requests";
import Hero from "./Hero/Hero";
import Loading from "./Loading/Loading";
import Slider from "./Slider/Slider";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);

  let movie = localStorage.getItem("movie") || "Avatar";
  const apiKey = "8321fba1bd0a71fd23430a1b4d42bfd9";

  // Fetch trending and recent movies
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        // Fetch trending movies
        const trendingResponse = await fetch(requests.requestTrending);
        const trendingData = await trendingResponse.json();
        setTrendingMovies(trendingData.results.filter(movie => movie.poster_path));

        // Fetch recent movies
        const recentResponse = await fetch(requests.requestRecent);
        const recentData = await recentResponse.json();
        // Filter out movies without posters
        const moviesWithPosters = recentData.results.filter(movie => movie.poster_path);
        setRecentMovies(moviesWithPosters);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMoviesData();
  }, []);

  const getRecommendationMovie = useCallback(async (data) => {
    try {
      setLoading(true);
      const recommendedMovies = await Promise.all(
        data.movies.map(async (movie) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`
          );
          const data = await response.json();
          // Return first result that has a poster
          return data.results.find(m => m.poster_path);
        })
      );
      setRecommendation(recommendedMovies.filter(movie => movie !== undefined));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch recommendations");
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all movies
        const moviesResponse = await fetch("https://movie-recommender-system2.onrender.com/api/movies");
        const moviesData = await moviesResponse.json();
        setMovies(moviesData.arr);

        // Get recommendations based on selected movie or popular movies
        if (!movie) {
          const popularResponse = await fetch(requests.requestPopular);
          const popularData = await popularResponse.json();
          setRecommendation(popularData.results.filter(movie => movie.poster_path));
        } else {
          const recommendationResponse = await fetch(
            `https://movie-recommender-system2.onrender.com/api/similarity/${movie}`
          );
          const recommendationData = await recommendationResponse.json();
          await getRecommendationMovie(recommendationData);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movie, getRecommendationMovie]);

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
              title="Trending This Week"
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

          {/* Recently Added Movies */}
          {recentMovies.length > 0 && (
            <Slider
              moviess={recentMovies}
              id="recent"
              title="Recently Added"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
