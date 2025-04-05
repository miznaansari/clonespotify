// context/SongState.jsx
import React, { useRef, useState, useEffect } from "react";
import songContext from "./songContext";
import songss from "../data/songs";

const SongState = ({ children }) => {
    const [currentSongId, setCurrentSongId] = useState(1);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [songs, setsongss] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [showCurrentPlay, setShowCurrentPlay] = useState(false)
    const [nav, setnav] = useState('/')
    const audioRef = useRef(null);
  

  useEffect(() => {
    if (nav === '/') {
        setsongss(songss);
    }else if (nav === '/recently-played') {
        setsongss(JSON.parse(sessionStorage.getItem("RecentlyPlayed")) || []);
    } else if (nav === '/top-tracks') {
        setsongss(JSON.parse(localStorage.getItem("TopPlayed")) || []);
    }
}, [nav]);
const [favsong, setfavsongs] = useState((JSON.parse(localStorage.getItem("FavSong")) || []))

    const handleaudio = (allSongs) => {
        const song = allSongs.find((s) => s.id === currentSongId);
        setCurrentSong(song);
    };

    useEffect(() => {
        const foundSong = songss.find(song => song.id === currentSongId) || null;
        setCurrentSong(foundSong);
    }, [currentSongId, songss]);

    // ✅ Add these functions globally
    const playNext = () => {
        const nextIndex = (songs.findIndex((s) => s.id === currentSongId) + 1) % songs.length;
        setCurrentSongId(songs[nextIndex].id);
        setHasUserInteracted(true);
    };

    const playPrevious = () => {
        const prevIndex = (songs.findIndex((s) => s.id === currentSongId) - 1 + songs.length) % songs.length;
        setCurrentSongId(songs[prevIndex].id);
        setHasUserInteracted(true);
    };

    return (
        <songContext.Provider
            value={{
                setnav,
                favsong,
                setfavsongs,
                nav,
                songs,
                currentSongId,
                handleaudio,
                setCurrentSongId,
                currentSong,
                hasUserInteracted,
                setHasUserInteracted,
                audioRef,
                playNext, // ✅ export to context
                playPrevious ,// ✅ export to context
                showCurrentPlay,
                setShowCurrentPlay
            }}
        >
            {children}
        </songContext.Provider>
    );
};

export default SongState;
