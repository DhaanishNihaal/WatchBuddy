import React, { useState, useCallback } from "react";
import requests from "../Requests";
import Hero from "./Hero/Hero";
import Loading from "./Loading/Loading";
import Slider from "./Slider/Slider";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState([]);

  let movie = localStorage.getItem("movie") || "Avatar";
  const apiKey = "8321fba1bd0a71fd23430a1b4d42bfd9";

  const getRecommendationMovie = useCallback(async (data) => {
    try {
      setLoading(true);
      const recommendedMovies = await Promise.all(
        data.movies.map(async (movie) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`
          );
          const data = await response.json();
          return data.results[0];
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

  React.useEffect(() => {
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
          setRecommendation(popularData.results);
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
          <Slider
            moviess={recommendation}
            id={!localStorage.getItem("movie") ? 1 : 2}
            name={movie}
          />
        </div>
      )}
    </>
  );
};

export default Home;
