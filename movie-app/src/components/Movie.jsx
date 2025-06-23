import React from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Movie = ({ item, isTV = false }) => {
  // const [like, setLike] = useState(false);
  // const [saved, setSaved] = useState(false);

  // console.log(item);

  let navigate = useNavigate();

  const getTitle = () => {
    if (isTV) {
      return item?.name || item?.original_name;
    }
    return item?.title || item?.original_title;
  };

  const getReleaseYear = () => {
    if (isTV) {
      return item?.first_air_date?.substring(0, 4);
    }
    return item?.release_date?.substring(0, 4);
  };

  const handleClick = () => {
    const title = getTitle();
    navigate(`/${isTV ? 'tv' : 'movie'}/${title}`);
  };

  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block">
      <button
        className="w-full h-[240px] relative cursor-pointer"
        onClick={handleClick}
      >
        <img
          className="w-full h-full object-cover rounded-lg"
          src={`https://image.tmdb.org/t/p/w500/${item?.poster_path}`}
          alt={getTitle()}
        />

        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white rounded-lg transition-all duration-300">
          <div className="flex flex-col justify-center items-center h-full p-4">
            <p className="text-xs md:text-sm font-bold text-center break-words line-clamp-3">
              {getTitle()}
            </p>
            {getReleaseYear() && (
              <p className="text-xs mt-2">
                ({getReleaseYear()})
              </p>
            )}
            {item?.vote_average > 0 && (
              <p className="text-xs mt-1 text-[#ECB22E]">
                ★ {item.vote_average.toFixed(1)}
              </p>
            )}
            <p className="text-xs mt-1 px-2 py-1 bg-[#ECB22E] rounded-full">
              {isTV ? 'TV Series' : 'Movie'}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Movie;
