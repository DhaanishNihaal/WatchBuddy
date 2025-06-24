import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";

import Home from "./components/Home";

import MovieDetails from "./components/MovieDetails";
import TVShows from "./components/TVShows";
import TVDetails from "./components/TVDetails";

import React from "react";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      {/* <Header />
       */}

      <Header />
      <Routes>
        <Route path="/" element={<Home showTV={false} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv" element={<TVShows />} />
        <Route path="/tv/:id" element={<TVDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
