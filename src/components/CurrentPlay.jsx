import { useState, useEffect } from "react";
import { IoIosPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { FaBackward, FaForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

const CurrentPlay = ({ song, audioRef, playNext, playPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!song) return null;

  useEffect(() => {
    if (!song) return;

    // Retrieve the recently played songs from sessionStorage
    const recentlyPlayed = JSON.parse(sessionStorage.getItem("RecentlyPlayed")) || [];

    // Remove the song from the list if it already exists (so we can add it to the top)
    const updatedRecentlyPlayed = recentlyPlayed.filter((s) => s.id !== song.id);

    // Add the current song to the top of the list
    updatedRecentlyPlayed.unshift(song);

    // Save the updated list back to sessionStorage
    sessionStorage.setItem("RecentlyPlayed", JSON.stringify(updatedRecentlyPlayed));

    // Track the most played song in localStorage (increment the play count)
    let topPlayed = JSON.parse(localStorage.getItem("TopPlayed")) || [];
    const existingSongIndex = topPlayed.findIndex((s) => s.id === song.id);
    if (existingSongIndex >= 0) {
      topPlayed[existingSongIndex].playCount += 1; // Increment play count
    } else {
      song.playCount = 1; // Initialize play count
      topPlayed.push(song);
    }

    // Sort by play count to have the most played at the start
    topPlayed = topPlayed.sort((a, b) => b.playCount - a.playCount);
    localStorage.setItem("TopPlayed", JSON.stringify(topPlayed));

  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);

    // Sync isPlaying state with the actual audio state
    const checkIfPlaying = () => {
      if (audio.paused) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    };

    audio.addEventListener("play", checkIfPlaying);
    audio.addEventListener("pause", checkIfPlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("play", checkIfPlaying);
      audio.removeEventListener("pause", checkIfPlaying);
    };
  }, [audioRef]);

  useEffect(() => {
    // If a new song is selected, reset the progress (but don't play yet)
    setProgress(0);
  }, [song]);

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
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleFavorite = () => {
    let favSongs = JSON.parse(localStorage.getItem("FavSong")) || [];
    if (isFavorite) {
      favSongs = favSongs.filter((fav) => fav.musicUrl !== song.musicUrl);
    } else {
      favSongs.push(song);
    }
    localStorage.setItem("FavSong", JSON.stringify(favSongs));
    setIsFavorite(!isFavorite);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const progressBar = e.target;
    const progressWidth = progressBar.getBoundingClientRect().width;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPosition / progressWidth) * 100;

    setProgress(newProgress); // Update progress state
    audio.currentTime = (newProgress / 100) * audio.duration; // Seek to the new time
  };

  // Handle click to play the song from Favorites or Recently Played
  const handleSongClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play(); // Play the selected song
      setIsPlaying(true); // Update play state
    }
  };

  return (
    <div className=" p-2 pb-0 mt-25 md:pb-0 lg:p-5 rounded-sm mx-2 lg:mx-10 text-white mt-16 md:mt-0  md:block relative">
      <h2 className="text-xl font-bold mt-3 mb-2">{song.title}</h2>
      <p className="text-gray-400 mb-2 md:mb-8">{song.artistName}</p>
      <img
        src={song.thumbnail}
        alt={song.title}
        className="aspect-square object-fit h-88  rounded-lg mx-auto cursor-pointer"
        onClick={handleSongClick} // Add click event to play the song
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
            <button onClick={toggleFavorite} className="absolute bg-black w-[200px] top-[-80px] left-0 p-2 rounded-sm">
              <span className={`text-md  ${isFavorite ? "text-red-500" : "text-gray-500"}`}>
                {isFavorite ? "❤️ Added" : "❤️ Add to Favorite"}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center">
          <button onClick={playPrevious} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            <FaBackward size={20} />
          </button>
          <button onClick={togglePlayPause} className="w-12 h-12 bg-white flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            {isPlaying ? <IoIosPause size={24} className="text-black " /> : <IoMdPlay className="text-black" size={24} />}
          </button>
          <button onClick={playNext} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            <FaForward size={20} />
          </button>
        </div>

        <div className="relative">
          <button onClick={toggleVolumeSlider} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#ffffff20]">
            {volume > 0 ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
          </button>
          {showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute right-0 top-14 w-24 h-2 bg-gray-500 rounded-lg cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentPlay;
