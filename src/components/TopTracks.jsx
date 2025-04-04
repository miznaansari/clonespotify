import { useState, useRef, useEffect } from "react";
import CurrentPlay from "./CurrentPlay";
import ColorThief from "colorthief";
import { motion } from "framer-motion"; // Import framer-motion
import { useLocation } from "react-router"; // To track location changes
import { MdOutlineFavorite } from "react-icons/md";
import { FaSearch, FaSpotify } from "react-icons/fa";

const TopTracks = ({ setDominantColor, showCurrentPlay, setShowCurrentPlay }) => {
    const [songs, setsong] = useState(
        JSON.parse(localStorage.getItem("TopPlayed")) || []
    );
    const [search, setSearch] = useState("");
    const [currentSongId, setCurrentSongId] = useState(songs[0]?.id || null); // Set the first song's ID by default
    const audioRef = useRef(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction
    const location = useLocation(); // Get current location
   

    // Filter songs based on search query
    const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(search.toLowerCase())
    );

    // Find the current song based on id
    const currentSong = songs.find((song) => song.id === currentSongId);

    // Update the dominant color whenever the current song changes
    useEffect(() => {
        if (!currentSong?.thumbnail) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = currentSong.thumbnail;

        img.onload = () => {
            try {
                const colorThief = new ColorThief();
                const color = colorThief.getColor(img);
                setDominantColor(color); // Update the background color in Main.jsx
            } catch (error) {
                console.error("Color extraction failed:", error);
            }
        };
    }, [currentSong, setDominantColor]);

    // Play the audio whenever the current song changes and the user has interacted
    useEffect(() => {
        if (!hasUserInteracted || !audioRef.current || !currentSong) return;

        audioRef.current.src = currentSong.musicUrl; // Set the audio source to the current song's music URL
        audioRef.current.play().catch((error) => {
            console.error("Error playing the audio:", error);
        });
    }, [currentSong, hasUserInteracted]);

    // Prevent auto-playing when the page is redirected to /
    useEffect(() => {
        if (location.pathname === "/") {
            setHasUserInteracted(false); // Don't play automatically on page load or redirect
        }
    }, [location.pathname]);

    // Play the next song in the playlist
    const playNext = () => {
        const nextIndex = (songs.findIndex((song) => song.id === currentSongId) + 1) % songs.length;
        setCurrentSongId(songs[nextIndex].id); // Use the id of the next song
        setHasUserInteracted(true); // Mark as interacted when playing next song
    };

    // Play the previous song in the playlist
    const playPrevious = () => {
        const prevIndex = (songs.findIndex((song) => song.id === currentSongId) - 1 + songs.length) % songs.length;
        setCurrentSongId(songs[prevIndex].id); // Use the id of the previous song
        setHasUserInteracted(true); // Mark as interacted when playing previous song
    };

    const toggleCurrentPlay = () => {
        setShowCurrentPlay((prevState) => !prevState); // This will toggle the state to show/hide the current play
    };

    return (
        <>
            {/* Mobile view: show only playlist or current play */}
            <div className="md:hidden block w-full px-2 lg:px-5">
                {!showCurrentPlay && (
                    <div className="w-full ">
                        <div className="flex items-center">
                                                 <FaSpotify className="text-2xl mr-3 text-white mt-8 font-bold mb-5" />
                        
                        <h1 className="text-2xl text-white mt-8 font-bold mb-5">Top Played Songs 🔥</h1></div>
                        {/* Search Bar */}
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
                        <div className="flex flex-2 gap-5 scrollbar-hide max-h-[75dvh] overflow-y-auto p-1 justify-around text-white transition-all">
                            <div className="w-full">
                                <div className="rounded-sm scrollbar-hide overflow-y-auto">
                                    {filteredSongs.length > 0 ? (
                                        <ul className="space-y-4">
                                            {filteredSongs.map((song) => (
                                                <motion.li
                                                    key={song.id}
                                                    className={`flex items-center space-x-4 p-4 rounded-sm cursor-pointer hover:bg-[#ffffff20] ${currentSongId === song.id ? "bg-[#ffffff20]" : ""}`}
                                                    onClick={() => {
                                                        setCurrentSongId(song.id); // Select the song
                                                        setHasUserInteracted(true); // Mark as interacted
                                                        toggleCurrentPlay(); // Toggle the current play view
                                                    }}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <img
                                                        src={song.thumbnail}
                                                        alt={song.title}
                                                        className="w-12 h-12 rounded-full"
                                                    />
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
                        </div>
                    </div>
                )}

                {/* Conditional Rendering for Mobile View */}
                {showCurrentPlay && currentSong && (
                    <CurrentPlay
                        song={currentSong}
                        audioRef={audioRef}
                        playNext={playNext}
                        playPrevious={playPrevious}
                    />
                )}
            </div>

            {/* For Medium and Large Screens: Show both Playlist and Current Play side by side */}
            <div className="hidden md:flex w-full justify-around gap-10 px-2">
                <div className="lg:w-1/3 md:w-2/4 mx-5 lg:ml-5">
                   <div className="flex items-center mt-8 gap-2 mb-5" >
                                     <h1 className="text-2xl text-white  font-bold">Top Played Songs 🔥 </h1></div>
                    {/* Search Bar */}
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
                    <div className="flex gap-5 scrollbar-hide max-h-[75dvh] overflow-y-auto p-1 justify-around text-white transition-all">
                        <div className="w-full">
                            <div className="rounded-sm scrollbar-hide overflow-y-auto">
                                {filteredSongs.length > 0 ? (
                                    <ul className="space-y-4">
                                        {filteredSongs.map((song) => (
                                            <motion.li
                                                key={song.id}
                                                className={`flex items-center space-x-4 p-4 rounded-sm cursor-pointer hover:bg-[#ffffff20] ${currentSongId === song.id ? "bg-[#ffffff20]" : ""}`}
                                                onClick={() => {
                                                    setCurrentSongId(song.id); // Select the song
                                                    setHasUserInteracted(true); // Mark as interacted
                                                }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <img
                                                    src={song.thumbnail}
                                                    alt={song.title}
                                                    className="w-12 h-12 rounded-full"
                                                />
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
                    </div>
                </div>

                {/* Current Play (Right Side) */}
                {currentSong && (
                    <CurrentPlay
                        song={currentSong}
                        audioRef={audioRef}
                        playNext={playNext}
                        playPrevious={playPrevious}
                    />
                )}
            </div>
        </>
    );
};

export default TopTracks;
