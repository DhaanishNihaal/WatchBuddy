import React from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Movie = ({ item }) => {
  // const [like, setLike] = useState(false);
  // const [saved, setSaved] = useState(false);

  // console.log(item);

  let navigate = useNavigate();

  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block">
      <button
        className="w-full h-[240px] relative cursor-pointer"
        onClick={() => navigate(`/movie/${item?.original_title}`)}
      >
        <img
          className="w-full h-full object-cover rounded-lg"
          src={`https://image.tmdb.org/t/p/w500/${item?.poster_path}`}
          alt={item?.title}
        />

        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white rounded-lg transition-all duration-300">
          <div className="flex flex-col justify-center items-center h-full p-4">
            <p className="text-xs md:text-sm font-bold text-center break-words line-clamp-3">
              {item?.title}
            </p>
            {item?.release_date && (
              <p className="text-xs mt-2">
                ({item.release_date.substring(0, 4)})
              </p>
            )}
            {item?.vote_average > 0 && (
              <p className="text-xs mt-1 text-[#ECB22E]">
                ★ {item.vote_average.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default Movie;
