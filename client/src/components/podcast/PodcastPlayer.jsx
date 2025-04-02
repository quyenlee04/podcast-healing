import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaForward, FaBackward } from "react-icons/fa";
import "../../styles/global.css";
import "../../styles/podcast.css";
import podcastService from "../../services/podcastService";

const PodcastPlayer = ({ 
  audioUrl, 
  title, 
  coverImage, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false, 
  podcastId,
  onListenCountUpdated // Add this prop
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const [viewCounted, setViewCounted] = useState(false);
  const [listenDuration, setListenDuration] = useState(0);
  const [listenCounted, setListenCounted] = useState(false);

  const handlePlay = async () => {
    if (!viewCounted && podcastId) {
      try {
        await podcastService.incrementListenCount(podcastId);
        setViewCounted(true);
      } catch (error) {
        console.error('Failed to increment listen count:', error);
      }
    }
    setPlaying(true);
  };
   const handlePlayPause = () => {
    if (!playing) {
      handlePlay();
    } else {
      setPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    // Track listening duration in seconds
    const currentTime = state.playedSeconds;
    setListenDuration(currentTime);

    // If user has listened for more than 3 minutes and listen hasn't been counted
    if (currentTime >= 180 && !listenCounted && podcastId) {
      handleListenCount();
      setListenCounted(true);
    }
  };

  const handleListenCount = async () => {
    try {
      await podcastService.incrementListenCount(podcastId);
      // Only call onListenCountUpdated if it exists
      if (typeof onListenCountUpdated === 'function') {
        onListenCountUpdated();
      }
    } catch (error) {
      console.error('Failed to update listen count:', error);
    }
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

  return (
    <div className="podcast-player">
      <div className="player-info">
        {coverImage && <img src={coverImage} alt={title} className="player-cover" />}
        <div className="player-title">{title}</div>
      </div>
      
      <div className="player-controls">
        {/* Navigation controls */}
        <div className="navigation-controls">
          <button 
            onClick={onPrevious} 
            className="nav-button" 
            disabled={!hasPrevious}
            title="Previous episode"
          >
            <FaStepBackward />
          </button>
          
          <button 
            onClick={() => handleSkip(-10)} 
            className="skip-button"
            title="Rewind 10 seconds"
          >
            <FaBackward />
            <span className="skip-text">10</span>
          </button>
          
          <button onClick={handlePlayPause} className="play-button">
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          
          <button 
            onClick={() => handleSkip(10)} 
            className="skip-button"
            title="Forward 10 seconds"
          >
            <FaForward />
            <span className="skip-text">10</span>
          </button>
          
          <button 
            onClick={onNext} 
            className="nav-button" 
            disabled={!hasNext}
            title="Next episode"
          >
            <FaStepForward />
          </button>
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
        
        <div className="volume-container">
          <button onClick={handleToggleMute} className="mute-button">
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
      </div>
      
      <ReactPlayer
        ref={playerRef}
        url={audioUrl}
        playing={playing}
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
      />
    </div>
  );
};

export default PodcastPlayer;
