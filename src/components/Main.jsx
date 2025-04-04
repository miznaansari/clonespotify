import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Routes, Route } from "react-router"; // Fix import path
import Playlist from "./Playlist";
import Favorites from "./Favorites";
import RecentlyPlayed from "./RecentlyPlayed";
import TopTracks from "./TopTracks";
import Navbar from "./Navbar";
import { IoMdMenu } from "react-icons/io";
import { FaList } from "react-icons/fa";

const Main = () => {
  const [dominantColor, setDominantColor] = useState([21, 26, 35]); // Default dark gray
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [showCurrentPlay, setShowCurrentPlay] = useState(false);

  const toggleNavbar = () => setIsNavbarVisible(!isNavbarVisible);
  const closeNavbar = () => setIsNavbarVisible(false);
  const toggleCurrentPlay = () => setShowCurrentPlay(!showCurrentPlay);

  return (
    <motion.div
      className="h-[100dvh] md:pb-0 flex justify-around lg:justify-between"
      animate={{
        background: `linear-gradient(285deg, rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}) 0%, rgb(65, 65, 65) 100%)`,
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth transition
    >
      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar closeNavbar={closeNavbar} />
      </div>

      {/* Mobile Menu Icon */}
      <IoMdMenu
        className="text-3xl mt-10 m-3 block lg:hidden text-white fixed top-0 right-0 z-50"
        onClick={toggleNavbar}
      />

      {/* Mobile Navbar with AnimatePresence */}
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div
            className="lg:hidden fixed top-0 left-0 bg-black text-white h-full p-4 z-40"
            initial={{ x: "-100%" }} // Start from left
            animate={{ x: 0 }} // Slide in
            exit={{ x: "-100%" }} // Slide out on close
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Navbar closeNavbar={closeNavbar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile View Toggle Button */}
      <button
        onClick={toggleCurrentPlay}
        className="lg:hidden fixed top-9 left-5 text-white p-2 rounded-full"
      >
        {showCurrentPlay && (
          <div className="flex gap-2 items-center">
            <FaList className="text-2xl " />
            <h1 className="text-2xl text-white font-bold"> Song List</h1>
          </div>
        )}
      </button>

      <Routes>
        <Route
          path="/"
          element={
            <Playlist
              setDominantColor={setDominantColor}
              toggleCurrentPlay={toggleCurrentPlay}
              showCurrentPlay={showCurrentPlay}
              setShowCurrentPlay={setShowCurrentPlay}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              setDominantColor={setDominantColor}
              toggleCurrentPlay={toggleCurrentPlay}
              showCurrentPlay={showCurrentPlay}
              setShowCurrentPlay={setShowCurrentPlay}
            />
          }
        />
        <Route
          path="/recently-played"
          element={
            <RecentlyPlayed
              setDominantColor={setDominantColor}
              toggleCurrentPlay={toggleCurrentPlay}
              showCurrentPlay={showCurrentPlay}
              setShowCurrentPlay={setShowCurrentPlay}
            />
          }
        />
        <Route
          path="/top-tracks"
          element={
            <TopTracks
              setDominantColor={setDominantColor}
              toggleCurrentPlay={toggleCurrentPlay}
              showCurrentPlay={showCurrentPlay}
              setShowCurrentPlay={setShowCurrentPlay}
            />
          }
        />
      </Routes>
    </motion.div>
  );
};

export default Main;
