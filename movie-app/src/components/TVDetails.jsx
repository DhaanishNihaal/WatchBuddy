import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsPlayFill } from "react-icons/bs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReactPlayer from "react-player";
import { MdOutlineClose } from "react-icons/md";
import Loading from "./Loading/Loading";
import Slider from "./Slider/Slider";

const TVDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const apiKey = "8321fba1bd0a71fd23430a1b4d42bfd9";

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        setLoading(true);
        // Search for the TV show
        const searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${id}`
        );
        const searchData = await searchResponse.json();
        const tvShow = searchData.results[0];

        if (!tvShow) {
          setError("TV Show not found");
          setLoading(false);
          return;
        }

        // Save to watch history
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        if (!history.includes(id)) {
          history.unshift(id);
          if (history.length > 10) history.pop();
          localStorage.setItem('watchHistory', JSON.stringify(history));
        }

        // Get detailed TV show info
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&append_to_response=videos`
        );
        const detailsData = await detailsResponse.json();
        setShow(detailsData);

        // Get video/trailer
        if (detailsData.videos && detailsData.videos.results) {
          const trailer = detailsData.videos.results.find(
            (vid) => vid.type === "Trailer"
          );
          setVideo(trailer || detailsData.videos.results[0]);
        }

        // Get recommendations
        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShow.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`
        );
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results.filter(show => show.poster_path));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        setError("Failed to fetch TV show details");
        setLoading(false);
      }
    };

    fetchTVDetails();
  }, [id, apiKey]);

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (loading || !show) {
    return <Loading />;
  }

  const genres = show.genres.map(g => g.name).join(", ");
  const percentage = Math.round((show.vote_average * 100) / 10);

  return (
    <section className="mt-16 w-full relative">
      {/* Mobile View */}
      <div className="h-[350px] block md:hidden mt-20">
        <img
          className="object-cover brightness-50 h-full w-full bg-no-repeat"
          alt={show.name}
          src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
        />
        <div className="absolute top-3 h-24 md:flex gap-7 flex-row">
          <div className="p-5 h-full">
            <h1 className="text-xl tracking-wider font-bold">
              {show.name} ({show.first_air_date?.slice(0, 4)})
            </h1>
            <h2 className="font-thin tracking-wider text-sm">
              {genres} ⭐️ {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
            </h2>

            <div className="flex gap-10 items-center mt-5">
              <div className="h-10 w-10">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    backgroundColor: "#081C22",
                    textColor: "#fff",
                    pathColor: "#21D07A",
                    trailColor: "transparent",
                  })}
                />
              </div>
              {video && (
                <button
                  className="items-center h-6 text-xs bg-red-700 hover:bg-red-900 flex py-3 px-2 gap-x-1 rounded-md"
                  onClick={() => setPlayTrailer(true)}
                >
                  <BsPlayFill />
                  Watch Trailer
                </button>
              )}
            </div>
            <p className="tracking-widest font-[100] text-sm mt-3">{show.tagline}</p>
            <div className="sm:hidden mt-2">
              <h1 className="font-bold tracking-wide">Overview</h1>
              <p className="font-[100] text-xs">{show.overview?.slice(0, 200)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block md:h-[600px]">
        <img
          className="object-cover brightness-50 h-full w-full mt-20 bg-no-repeat"
          alt={show.name}
          src={`https://image.tmdb.org/t/p/original/${show.backdrop_path}`}
        />
        <div className="hidden top-20 absolute h-[400px] left-40 md:flex gap-7 flex-row">
          <img
            className="h-full"
            src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
            alt={show.name}
          />
          <div className="text-white text-start">
            {video && playTrailer ? (
              <>
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${video.key}`}
                  width="200%"
                  playing={true}
                  controls={true}
                  height="100%"
                />
                <button
                  className="h-10 w-10 bg-red-600 flex hover:bg-red-800 mt-2 justify-center items-center rounded-md"
                  onClick={() => setPlayTrailer(false)}
                >
                  <MdOutlineClose className="font-bold h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl tracking-wider mt-10 font-bold">
                  {show.name} ({show.first_air_date?.slice(0, 4)})
                </h1>
                <h2 className="font-thin tracking-wider text-lg">
                  {genres} ⭐️ {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </h2>

                <div className="flex gap-10 items-center mt-5">
                  <div className="h-16 w-16">
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      background
                      backgroundPadding={6}
                      styles={buildStyles({
                        backgroundColor: "#081C22",
                        textColor: "#fff",
                        pathColor: "#21D07A",
                        trailColor: "transparent",
                      })}
                    />
                  </div>
                  {video && (
                    <button
                      className="items-center h-6 bg-red-700 hover:bg-red-900 flex py-4 px-2 gap-x-1 rounded-md"
                      onClick={() => setPlayTrailer(true)}
                    >
                      <BsPlayFill />
                      Watch Trailer
                    </button>
                  )}
                </div>
                <p className="tracking-widest font-[100] text-base mt-5">{show.tagline}</p>
                <div className="mt-5">
                  <h1 className="font-bold tracking-wide">Overview</h1>
                  <p className="font-[100] text-base">{show.overview}</p>
                </div>
                <div className="mt-5">
                  <h2 className="font-bold tracking-wide">Additional Information</h2>
                  <p className="font-[100] text-base">
                    Status: {show.status}<br />
                    Episodes: {show.number_of_episodes}<br />
                    First Air Date: {show.first_air_date}<br />
                    Last Air Date: {show.last_air_date}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <Slider
          moviess={recommendations}
          id={`tv-recommendations-${show.id}`}
          title={`More Shows Like ${show.name}`}
          isTV={true}
        />
      )}
    </section>
  );
};

export default TVDetails; 