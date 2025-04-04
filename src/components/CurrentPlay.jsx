import { useState, useEffect } from "react";
import { IoIosPause } from "react-icons/io";
import { motion } from "framer-motion";
import { IoMdPlay } from "react-icons/io";
import { FaBackward, FaForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";

const CurrentPlay = ({ song, audioRef, playNext, playPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1); // Stores the previous volume level
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!song) return null;

  useEffect(() => {
    if (!song) return;

    // Retrieve the recently played songs from sessionStorage
    const recentlyPlayed = JSON.parse(sessionStorage.getItem("RecentlyPlayed")) || [];
    const updatedRecentlyPlayed = recentlyPlayed.filter((s) => s.id !== song.id);
    updatedRecentlyPlayed.unshift(song);
    sessionStorage.setItem("RecentlyPlayed", JSON.stringify(updatedRecentlyPlayed));

    let topPlayed = JSON.parse(localStorage.getItem("TopPlayed")) || [];
    const existingSongIndex = topPlayed.findIndex((s) => s.id === song.id);
    if (existingSongIndex >= 0) {
      topPlayed[existingSongIndex].playCount += 1;
    } else {
      song.playCount = 1;
      topPlayed.push(song);
    }
    topPlayed = topPlayed.sort((a, b) => b.playCount - a.playCount);
    localStorage.setItem("TopPlayed", JSON.stringify(topPlayed));
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const checkIfPlaying = () => {
      setIsPlaying(!audio.paused);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", checkIfPlaying);
    audio.addEventListener("pause", checkIfPlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("play", checkIfPlaying);
      audio.removeEventListener("pause", checkIfPlaying);
    };
  }, [audioRef]);

  useEffect(() => {
    setProgress(0);
  }, [song]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Ensure volume is set on mount
    }
  }, [audioRef, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume); // Save current volume before muting
      setVolume(0);
    } else {
      setVolume(prevVolume); // Restore previous volume
    }
  };

  const toggleFavorite = () => {
    let favSongs = JSON.parse(localStorage.getItem("FavSong")) || [];
    if (isFavorite) {
      favSongs = favSongs.filter((fav) => fav.musicUrl !== song.musicUrl);
    } else {
      favSongs.push(song);
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrates the phone for 200ms
      }
    }
    localStorage.setItem("FavSong", JSON.stringify(favSongs));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    if (!song) return;
    const favSongs = JSON.parse(localStorage.getItem("FavSong")) || [];
    setIsFavorite(favSongs.some((fav) => fav.musicUrl === song.musicUrl));
  }, [song]);

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const progressBar = e.target;
    const progressWidth = progressBar.getBoundingClientRect().width;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPosition / progressWidth) * 100;

    setProgress(newProgress);
    audio.currentTime = (newProgress / 100) * audio.duration;
  };

  return (
    <div className="p-2 pb-0 mt-20 md:pb-0 lg:p-5 rounded-sm mx-2 lg:mx-10 text-white mt-16 md:mt-0 md:block relative">
      <h2 className="text-xl font-bold mt-3 mb-2">{song.title}</h2>
      <p className="text-gray-400 mb-2 md:mb-8">{song.artistName}</p>
      <img
        src={song.thumbnail}
        alt={song.title}
        className="aspect-square object-fit h-88 rounded-lg mx-auto cursor-pointer"
      />

      <div className="w-full h-1 bg-gray-600 rounded-full mt-3" onClick={handleProgressClick}>
        <div className="h-1 bg-white rounded-full" style={{ width: `${progress}%` }} />
      </div>

      <audio ref={audioRef} src={song.musicUrl} onEnded={playNext} />

      <div className="flex items-center justify-between gap-5 mt-4">
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <PiDotsThreeOutlineFill size={24} />
          </button>
          {showMenu && (
            <button onClick={toggleFavorite} className="absolute top-[-90px] left-0 p-2 rounded-sm">
              <motion.span
                initial={{ y: isFavorite ? 20 : -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: isFavorite ? -20 : 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaHeart className={`text-4xl ${isFavorite ? "text-red-500" : "text-white"}`} />
              </motion.span>
            </button>
          )}
        </div>

        <div className="flex items-center">
          <button onClick={playPrevious} className="w-12 h-12 mr-8 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            <FaBackward size={30} />
          </button>
          <button onClick={togglePlayPause} className="w-14 h-14 bg-white flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            {isPlaying ? <IoIosPause size={40} className="text-black" /> : <IoMdPlay size={24} className="text-black" />}
          </button>
          <button onClick={playNext} className="w-12 h-12 ml-8 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            <FaForward size={30} />
          </button>
        </div>

        <button onClick={toggleMute} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
          {volume > 0 ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CurrentPlay;
