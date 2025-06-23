import React, { useState, useEffect } from "react";
import requests from "../Requests";
import Loading from "./Loading/Loading";
import Slider from "./Slider/Slider";
import TVHero from "./Hero/TVHero";

const TVShows = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularTV, setPopularTV] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [recommendedTV, setRecommendedTV] = useState([]);

  const apiKey = "8321fba1bd0a71fd23430a1b4d42bfd9";

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        // Get watch history
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const lastWatchedShow = history.find(item => item.includes(' ')); // TV show names usually have spaces

        // Fetch TV shows
        const [popularTVRes, trendingTVRes, topRatedTVRes] = await Promise.all([
          fetch(requests.requestPopularTV),
          fetch(requests.requestTrendingTV),
          fetch(requests.requestTopRatedTV)
        ]);

        const popularTVData = await popularTVRes.json();
        const trendingTVData = await trendingTVRes.json();
        const topRatedTVData = await topRatedTVRes.json();

        setPopularTV(popularTVData.results.filter(show => show.poster_path));
        setTrendingTV(trendingTVData.results.filter(show => show.poster_path));
        setTopRatedTV(topRatedTVData.results.filter(show => show.poster_path));

        // Get recommendations based on last watched show or use popular shows
        if (lastWatchedShow) {
          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${lastWatchedShow}`
          );
          const searchData = await searchResponse.json();
          
          if (searchData.results.length > 0) {
            const showId = searchData.results[0].id;
            const recommendationsResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
            );
            const recommendationsData = await recommendationsResponse.json();
            setRecommendedTV(recommendationsData.results.filter(show => show.poster_path));
          } else {
            // If no recommendations found, use popular shows
            setRecommendedTV(popularTVData.results.filter(show => show.poster_path));
          }
        } else {
          // If no watch history, use popular shows
          setRecommendedTV(popularTVData.results.filter(show => show.poster_path));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setError("Failed to fetch TV shows");
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [apiKey]);

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="md:mt-20">
          <TVHero />

          {/* Recommended TV Shows */}
          {recommendedTV.length > 0 && (
            <Slider
              moviess={recommendedTV}
              id="recommended-tv"
              title={localStorage.getItem('watchHistory') ? "Recommended For You" : "Popular Right Now"}
              isTV={true}
            />
          )}

          {/* Popular TV Shows */}
          {popularTV.length > 0 && (
            <Slider
              moviess={popularTV}
              id="popular-tv"
              title="Popular TV Shows"
              isTV={true}
            />
          )}

          {/* Trending TV Shows */}
          {trendingTV.length > 0 && (
            <Slider
              moviess={trendingTV}
              id="trending-tv"
              title="Trending This Week"
              isTV={true}
            />
          )}

          {/* Top Rated TV Shows */}
          {topRatedTV.length > 0 && (
            <Slider
              moviess={topRatedTV}
              id="top-rated-tv"
              title="Top Rated Series"
              isTV={true}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TVShows; 