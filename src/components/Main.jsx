import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Routes, Route, useLocation } from "react-router"; // Fix import path
import Playlist from "./Playlist";
import Favorites from "./Favorites";
import RecentlyPlayed from "./RecentlyPlayed";
import TopTracks from "./TopTracks";
import Navbar from "./Navbar";
import { IoMdMenu } from "react-icons/io";
import { FaList, FaSpotify } from "react-icons/fa";
import imgSpotify from "./spotify.png";
const Main = () => {
  const [dominantColor, setDominantColor] = useState([21, 26, 35]); // Default dark gray
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [showCurrentPlay, setShowCurrentPlay] = useState(false);

  const toggleNavbar = () => setIsNavbarVisible(!isNavbarVisible);
  const closeNavbar = () => setIsNavbarVisible(false);
  const toggleCurrentPlay = () => setShowCurrentPlay(!showCurrentPlay);
  const location = useLocation(); // Track route changes

  useEffect(() => {
    setShowCurrentPlay(false); // Hide CurrentPlay when the route changes
  }, [location.pathname]);
  return (
    <>


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
          className="text-3xl mt-8 m-3 block lg:hidden text-white fixed top-0 right-0 z-50"
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
          className="lg:hidden fixed top-8 left-2 text-white p-2 rounded-full"
        >
          {showCurrentPlay && (
            <div className="flex gap-2 items-center">
              <FaList className="text-2xl " />
              <h1 className="text-xl text-white  font-bold "> Song List</h1>
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
     <div className="fixed bottom-5 left-10 hidden lg:block"> <img src="https://s3-alpha-sig.figma.com/img/4b1c/9272/23674d7d0fc7e5938c32787f13738353?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mc1whtZ6W7czkdFWDVB1JAlBUmwrC3GffOZXhrkfPhnfMMrwE28nyBB7E4F-JIFXY5GYIYTlY1w5ZBN6C7IiYzEu6HhuojfwfH7XwamRlk-GApiKC1eiPpsUiJwPvSdEhW3bmmFYcqq1hTDUVxHMYWZzW4RBwzd6Ri3IOGtALknSwUr4n~k~VPUZ5b5dXgN4786HDmS9L83PfyZCs-fcKuEFxAWudE45iqtVD5cRum92tW71oXha~Nnfrx1~UGAFU~pMF0lZH0QpNSjK4RHkQyt937FDGAd1M1WJ55dowFzcq5Cj5OFCL-4zG~LNsp~pFx3GPktr3oABs404poW2Fg__" 
      alt="" className=" bg-[#151515] w-[50px] object-cover h-[50px] rounded-full " /></div>
    </>
  );
};

export default Main;
