// components/Favorites.jsx
import { useState, useEffect, useContext } from "react";
import CurrentPlay from "./CurrentPlay";
import ColorThief from "colorthief";
import { motion } from "framer-motion";
import { MdOutlineFavorite } from "react-icons/md";
import { FaSearch, FaSpotify } from "react-icons/fa";
import songContext from "../context/songContext";

const Favorites = ({ setDominantColor, showCurrentPlay, setShowCurrentPlay }) => {
    const [search, setSearch] = useState("");

    const {
        songs,
        setnav,
        currentSongId,
        setCurrentSongId,
        currentSong,
        audioRef,
        hasUserInteracted,
        setHasUserInteracted,
    } = useContext(songContext);
    setnav('/favorites')
    

    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (!currentSong?.thumbnail) return;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = currentSong.thumbnail;
        img.onload = () => {
            try {
                const color = new ColorThief().getColor(img);
                setDominantColor(color);
            } catch (error) {
                console.error("Color extraction failed:", error);
            }
        };
    }, [currentSong]);

    const playNext = () => {
        const nextIndex = (songs.findIndex(song => song.id === currentSongId) + 1) % songs.length;
        setCurrentSongId(songs[nextIndex].id);
        setHasUserInteracted(true);
    };
    const toggleView = () => setShowCurrentPlay(prev => !prev);
    const playPrevious = () => {
        const prevIndex = (songs.findIndex(song => song.id === currentSongId) - 1 + songs.length) % songs.length;
        setCurrentSongId(songs[prevIndex].id);
        setHasUserInteracted(true);
    };

    const handleSongClick = (id) => {
        setCurrentSongId(id);
        setHasUserInteracted(true);
        setShowCurrentPlay(true); // Show player on mobile
    };

    return (
        <div className={`w-full md:block ${showCurrentPlay?"hidden":""}`}>
        <div className="flex items-center">
          <FaSpotify className="text-3xl ml-3 mr-3  text-white mt-8 lg:hidden font-bold mb-5" />
          <div className="flex items-center mt-8 gap-2 mb-5" >
            <h1 className="text-2xl text-white  font-bold">Favorites </h1><MdOutlineFavorite className="text-2xl text-red-500" /></div>
            
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 rounded-sm border text-white focus:outline-none"
          />
          <FaSearch className="text-gray-500 absolute top-3 text-xl right-5" />
        </div>
        <div className="scrollbar-hide h-[70vh] overflow-y-auto text-white">
          {filteredSongs.length > 0 ? (
            <ul className="space-y-4">
              {filteredSongs.map((song, index) => (
                <motion.li
                  key={song.id}
                  className={`flex items-center space-x-4 p-4 rounded-sm cursor-pointer hover:bg-[#ffffff20] ${currentSongId === song.id ? "bg-[#ffffff20]" : ""}`}
                  onClick={() => {
                    setCurrentSongId(song.id);
                    setHasUserInteracted(true);
                    if (window.innerWidth < 768) toggleView();
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <img src={song.thumbnail} alt={song.title} className="w-12 h-12 rounded-full" />
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h2 className="text-sm font-semibold">{song.title}</h2>
                      <p className="text-xs text-gray-400">{song.artistName}</p>
                    </div>
                    <p className="text-xs text-gray-400">{song.duration}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No results found</p>
          )}
        </div>
      </div>
    );
};

export default Favorites;
