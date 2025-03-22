import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Favorites.css";
const Favorites = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Please log in to see your favorite podcasts.</p>;
  }

  return (
    <div>
      <h2>Your Favorite Podcasts</h2>
      <ul>
        {user.favorites && user.favorites.length > 0 ? (
          user.favorites.map((podcast) => <li key={podcast.id}>{podcast.title}</li>)
        ) : (
          <p>No favorites added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Favorites;
