const key = process.env.MOVIE_API_KEY;

const requests = {
  // Movie endpoints
  requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1`,
  requestSearch: `https://api.themoviedb.org/3/search/movie?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1&query=`,
  requestTrending: `https://api.themoviedb.org/3/trending/movie/week?api_key=8321fba1bd0a71fd23430a1b4d42bfd9`,
  requestRecent: `https://api.themoviedb.org/3/discover/movie?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`,
  
  // TV Series endpoints
  requestPopularTV: `https://api.themoviedb.org/3/tv/popular?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1`,
  requestTrendingTV: `https://api.themoviedb.org/3/trending/tv/week?api_key=8321fba1bd0a71fd23430a1b4d42bfd9`,
  requestTopRatedTV: `https://api.themoviedb.org/3/tv/top_rated?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1`,
  requestSearchTV: `https://api.themoviedb.org/3/search/tv?api_key=8321fba1bd0a71fd23430a1b4d42bfd9&language=en-US&page=1&query=`
};

console.log(key);

export default requests;
