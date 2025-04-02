import React, { createContext, useState, useContext, useRef, useEffect } from "react";

const PlayerContext = createContext();

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const playPodcast = (podcast, relatedPodcasts = []) => {
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    
    // If we have related podcasts, set them as the queue
    if (relatedPodcasts.length > 0) {
      const newQueue = [...relatedPodcasts];
      const podcastIndex = newQueue.findIndex(p => p._id === podcast._id);
      
      if (podcastIndex !== -1) {
        // If the podcast is in the queue, set the current index
        setCurrentIndex(podcastIndex);
      } else {
        // If not, add it to the beginning
        newQueue.unshift(podcast);
        setCurrentIndex(0);
      }
      
      setQueue(newQueue);
    } else {
      // If no related podcasts, just add this one to the queue
      setQueue([podcast]);
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPodcast(queue[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentPodcast(queue[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const clearPlayer = () => {
    setCurrentPodcast(null);
    setIsPlaying(false);
    setQueue([]);
    setCurrentIndex(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentPodcast,
        isPlaying,
        queue,
        currentIndex,
        playPodcast,
        togglePlay,
        playNext,
        playPrevious,
        clearPlayer,
        setIsPlaying
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;