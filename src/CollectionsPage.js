import React, { useState } from 'react';

const CollectionsPage = ({ collections, removeFromCollection }) => {
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
    <div className="collections-section">
      <h3 className="h3">Collections</h3>
      <div className="comic-container">
        {collections.map((comic) => (
          <div key={comic.num} className="comic-item">
            <h3>{comic.title}</h3>
            <div className="btns">
              <button onClick={() => removeFromCollection(comic)}>Remove from Collection</button>
            </div>
            <div className="comic-image-container" onClick={() => openPopup(comic)}>
              <img src={comic.img} alt={comic.alt} className="comic-image" />
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

export default CollectionsPage;
