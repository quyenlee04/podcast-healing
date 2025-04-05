import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaForward, FaBackward, FaTimes } from "react-icons/fa";
import { usePlayerContext } from "../../context/PlayerContext";


const GlobalPlayer = () => {
  const {
    currentPodcast,
    isPlaying,
    playNext,
    playPrevious,
    togglePlay,
    queue,
    currentIndex,
    clearPlayer,
    setIsPlaying
  } = usePlayerContext();

  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const playerRef = useRef(null);

  // Reset played progress when podcast changes
  useEffect(() => {
    setPlayed(0);
  }, [currentPodcast]);

  if (!currentPodcast) return null;

  // Helper function to format URLs
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  // Skip forward/backward by specified seconds
  const handleSkip = (seconds) => {
    const player = playerRef.current;
    if (player) {
      const currentTime = player.getCurrentTime();
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      player.seekTo(newTime / duration);
    }
  };

  // Format time in minutes:seconds
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`global-player ${expanded ? 'expanded' : ''}`}>
      <div className="global-player-content">
        <div className="player-info" onClick={toggleExpanded}>
          <img 
            src={getFullUrl(currentPodcast.coverImage)} 
            alt={currentPodcast.title} 
            className="player-thumbnail" 
          />
          <div className="player-text">
            <Link to={`/podcasts/${currentPodcast._id}`} className="player-title">
              {currentPodcast.title}
            </Link>
            {currentPodcast.author && (
              <span className="player-author">{currentPodcast.author.username}</span>
            )}
          </div>
        </div>

        <div className="player-controls">
          <button 
            onClick={playPrevious} 
            className="control-button" 
            disabled={currentIndex === 0}
            title="Previous"
          >
            <FaStepBackward />
          </button>
          
          <button 
            onClick={() => handleSkip(-10)} 
            className="control-button"
            title="Rewind 10 seconds"
          >
            <FaBackward />
          </button>
          
          <button onClick={togglePlay} className="play-button">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <button 
            onClick={() => handleSkip(10)} 
            className="control-button"
            title="Forward 10 seconds"
          >
            <FaForward />
          </button>
          
          <button 
            onClick={playNext} 
            className="control-button" 
            disabled={currentIndex >= queue.length - 1}
            title="Next"
          >
            <FaStepForward />
          </button>
        </div>

        <div className="player-right">
          <div className="volume-container">
            <button onClick={handleToggleMute} className="volume-button">
              {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          
          <button onClick={clearPlayer} className="close-button" title="Close player">
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="progress-container">
        <span className="time-display">{formatTime(duration * played)}</span>
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          className="progress-bar"
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={getFullUrl(currentPodcast.audioUrl)}
        playing={isPlaying}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="0"
        height="0"
        config={{
          file: {
            forceAudio: true,
          }
        }}
        onEnded={playNext}
      />
    </div>
  );
};

export default GlobalPlayer;