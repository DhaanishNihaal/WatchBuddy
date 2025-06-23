import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from 'typewriter-effect';

const Hero = ({ movies }) => {
  const [name, setName] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [filteredMovie, setFilteredMovie] = useState([]);
  let navigate = useNavigate();

  const handleOnchange = (e) => {
    setNotFound(false);
    const wordEntered = e.target.value.trim();
    setName(wordEntered);

    if (wordEntered.length > 0) {
      const filter = movies.filter((value) => {
        return value.toLowerCase().includes(wordEntered.toLowerCase());
      });

      if (filter.length > 0) {
        setFilteredMovie(filter);
      } else {
        setFilteredMovie([]);
        setNotFound(true);
      }
    } else {
      setFilteredMovie([]);
      setNotFound(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/movie/${name}`);
    }
  };

  return (
    <section className="w-full h-96 flex items-center justify-center lg:px-20">
      <img
        src="https://c4.wallpaperflare.com/wallpaper/142/751/831/landscape-anime-digital-art-fantasy-art-wallpaper-preview.jpg"
        alt=""
        className="object-fill brightness-[0.3] h-full relative w-full rounded-2xl"
      />
      <div className="absolute w-[90%] md:w-[50%] md:text-left text-center font-mono">
        <h1 className="text-white font-extrabold text-2xl md:text-5xl animate-bounce tracking-wider">
          Welcome.
        </h1>
        <p className="text-white text-sm md:text-xl tracking-wide font-mono">
          <Typewriter options={{autoStart:true,loop:true,delay:40,strings:["Search here to get AI based movies Recommendation !","Developed & Designed by Dhaanish Nihaal 😎😎"]}}></Typewriter>
        </p>

        <div className="flex items-center mt-5 md:mt-7 relative">
          <div className="flex space-x-1 w-full md:p-0 p-4">
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                type="text"
                className="block w-full md:text-base text-sm px-4 py-2 text-white bg-[#2D2D2D] border-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#ECB22E] focus:border-[#ECB22E]"
                placeholder="Search movies..."
                value={name}
                onChange={handleOnchange}
              />
              <button
                type="submit"
                className="px-4 text-white bg-[#ECB22E] rounded-r-lg hover:bg-[#2D2D2D] border border-[#ECB22E] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {notFound && (
          <div className="text-red-500 text-lg mt-2">
            Sorry! The movie you searched for is not in our database
          </div>
        )}

        {filteredMovie.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700">
            {filteredMovie.slice(0, 8).map((movie, index) => (
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
    </section>
  );
};

export default Hero;
