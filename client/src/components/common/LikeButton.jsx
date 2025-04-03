import React, { useState, useContext, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import podcastService from '../../services/podcastService';
import { useNavigate } from 'react-router-dom';

const LikeButton = ({ podcast, isLiked: initialLiked, onToggle }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add this effect to update like state when initialLiked changes
  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await podcastService.toggleLike(podcast._id);
      setIsLiked(response.liked); // Use the response from server
      if (onToggle) {
        onToggle(response.liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default LikeButton;