import React, { useState, useEffect} from "react";
import { useDebounce } from "react-use";

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { updateSearchItem, getTrendingMovies } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchItem, setSearchItem] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedItem, setDebouncedItem] = useState("");

  useDebounce(() => setDebouncedItem(searchItem), 500, [searchItem]);

  
  useEffect(() => {
    fetchMovies(debouncedItem);
  }, [debouncedItem]);

  useEffect(()=>{
      loadTrendingMovies();
  }, [])

  const loadTrendingMovies = async () =>{
    try{
         const movies = await getTrendingMovies();
         setTrendingMovies(movies);
    }
    catch(err){
      console.log("Error:", err);
    }
  }
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Error fetching data.");
      }

      const data = await response.json();
      setMovieList(data.results || []);

      console.log("Query:", query);
      console.log("Movie:",data.results[0]);

      if (query && data.results.length > 0) {
        updateSearchItem(query, data.results[0]);
      }
    } catch (err) {
      console.log("Error Message: ", err);
      setMovieList([]);
      setErrorMessage("Something went wrong in fetching data.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            {" "}
            Find
            <span className="text-gradient"> Movies</span> you will enjoy
            without the Hassle
          </h1>
          <Search
            searchItem={searchItem}
            setSearchItem={setSearchItem}
          ></Search>
        </header>

        <section className="all-movies">
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie,index)=>(
                  <li key = {movie.$id}>
                       <p>{index + 1}</p>
                       <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <h2 >All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500 text-xl text-center">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
