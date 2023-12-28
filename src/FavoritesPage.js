import React, { useState } from 'react';

const FavoritesPage = ({ favorites, removeFromFavorites }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  const openPopup = (comic) => {
    setSelectedComic(comic);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedComic(null);
    setShowPopup(false);
  };

  return (
    <div className="favorites-section">
      <h3 className="h3">Favorites</h3>
      <div className="favorites-grid">
        {favorites.map((comic) => (
          <div key={comic.num} className="comic-card">
            <h3>{comic.title}</h3>
            <button onClick={() => removeFromFavorites(comic)}>Remove from Favorites</button>
            <div
              className="comic-image-container"
              onClick={() => openPopup(comic)}
            >
              <img
                src={comic.img}
                alt={comic.alt}
                className="comic-image"
              />
              <div className="zoom-icon">🔍</div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="image-popup">
          <span className="close-icon" onClick={closePopup}>
            &#10005;
          </span>
          <img src={selectedComic.img} alt={selectedComic.alt} />
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
