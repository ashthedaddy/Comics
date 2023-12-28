import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link,NavLink } from 'react-router-dom';
import './App.css';
import FavoritesPage from './FavoritesPage';
import CollectionsPage from './CollectionsPage';

const App = () => {
  const [coomics, setCoomics] = useState([]);
  const [currentCoomicIndex, setCurrentCoomicIndex] = useState(0);
  const [looading, setLooading] = useState(true);
  const [searchQueery, setSearchQueery] = useState('');
  const [searchSuggestioons, setSearchSuggestioons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [click, setClick] = React.useState(false);

  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);
  const isInCollection = (comic) => {
    return collections.some((c) => c.num === comic.num);
  };

  const isFavorite = (comic) => {
    return favorites.some((c) => c.num === comic.num);
  };
  const handleNextCoomic = () => {
    if (currentCoomicIndex < coomics.length - 1) {
      setCurrentCoomicIndex(currentCoomicIndex + 1);
    }
  };

  const handlePreviousCoomic = () => {
    if (currentCoomicIndex > 0) {
      setCurrentCoomicIndex(currentCoomicIndex - 1);
    }
  };

  const handleRandomCoomic = () => {
    const randomIndex = Math.floor(Math.random() * coomics.length);
    setCurrentCoomicIndex(randomIndex);
  };

  const handleSearch = () => {
    const searchResults = coomics.filter((comic) =>
      comic.title.toLowerCase().includes(searchQueery.toLowerCase())
    );
    if (searchResults.length > 0) {
      setCurrentCoomicIndex(coomics.indexOf(searchResults[0]));
    }
    setSearchQueery('');
    setSearchSuggestioons([]);
  };

  const handleSearchSuggestions = (value) => {
    if (value) {
      const suggestions = coomics
        .filter((comic) => comic.title.toLowerCase().startsWith(value.toLowerCase()))
        .map((comic) => comic.title);
      setSearchSuggestioons(suggestions);
    } else {
      setSearchSuggestioons([]);
    }
  };

  const addToFavorites = (comic) => {
    const updatedFavorites = [...favorites, comic];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (comic) => {
    const updatedFavorites = favorites.filter((item) => item.num !== comic.num);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addToCollection = (comic) => {
    const updatedCollections = [...collections, comic];
    setCollections(updatedCollections);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
  };

  const removeFromCollection = (comic) => {
    const updatedCollections = collections.filter((item) => item.num !== comic.num);
    setCollections(updatedCollections);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
  };

  const loadFromLocalStorage = () => {
    const storedFavorites = localStorage.getItem('favorites');
    const storedCollections = localStorage.getItem('collections');

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setSearchQueery(suggestion);
    setSearchSuggestioons([]);
  };
  useEffect(() => {
    const coomicNumbers = Array.from({ length: 1000 }, (_, index) => index + 1);
    const comicsData = [];

    const fetchCoomic = async (num) => {
      try {
        const respoonse = await axios.get(`https://getxkcd.now.sh/api/comic?num=${num}`);
        comicsData.push(respoonse.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllCoomics = async () => {
      await Promise.all(coomicNumbers.map((num) => fetchCoomic(num)));
      setCoomics(comicsData);
      setLooading(false);
    };

    fetchAllCoomics();
    loadFromLocalStorage();
  }, []);

  if (looading) {
    return <div className='circle '>Loading...</div>;
  }

  const currentComic = coomics[currentCoomicIndex];

  return (
    <Router>
      <div className="app">
      <div>
     <div className={click ? "main-container" : ""}  onClick={()=>Close()} />
      <nav className="navbar" onClick={e => e.stopPropagation()}>
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
          <h2>XKCD Comics</h2>
           
          </NavLink>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/favorites"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Favorites
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/collections"
                activeClassName="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Collections
              </NavLink>
            </li>
            
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
          </div>
        </div>
      </nav>
    </ div>
        

        <Routes>
          <Route
            path="/"
            element={
              <>
               
                <div className="upper-portions slideExpandUp">

                  <div className="other-details"><p><span>Release Date:</span> {currentComic.month}/{currentComic.day}/{currentComic.year}</p>
                    <p><span>About:</span> {currentComic.alt}</p></div>
                  <div className="search-bar ">
                    <input
                      type="text"
                      placeholder="Search comics by Title"
                      value={searchQueery}
                      onChange={(e) => {
                        setSearchQueery(e.target.value);
                        handleSearchSuggestions(e.target.value);
                      }}
                    />
                    <button onClick={handleSearch}>Search</button>


                    {searchSuggestioons.length > 0 && (
                      <ul className="suggestions-list">
                        {searchSuggestioons.map((suggestion) => (
                          <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>


                <div className="comic-details slideLeft  ">
                  <h3>{currentComic.title}</h3>
                  <div className="comic-buttons">
                    {isInCollection(currentComic) ? ( // Check if the comic is in the collection
                      <button style={{ backgroundColor: "white", color: "black" }} onClick={() => removeFromCollection(currentComic)}>Remove from Collection</button>
                    ) : (
                      <button onClick={() => addToCollection(currentComic)}>Add to Collection</button>
                    )}
                    <button onClick={handlePreviousCoomic} disabled={currentCoomicIndex === 0}>
                      Previous
                    </button>
                    <button onClick={handleRandomCoomic}>Random</button>
                    <button
                      onClick={handleNextCoomic}
                      disabled={currentCoomicIndex === coomics.length - 1}
                    >
                      Next
                    </button>

                    {isFavorite(currentComic) ? ( // Check if the comic is in favorites
                      <button style={{ backgroundColor: "white", color: "black" }} onClick={() => removeFromFavorites(currentComic)}>Remove from Favorites</button>
                    ) : (
                      <button onClick={() => addToFavorites(currentComic)}>Add to Favorites</button>
                    )}
                  </div>
                  <img  src={currentComic.img} alt={currentComic.alt} />
                </div>
              </>
            }
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} removeFromFavorites={removeFromFavorites} />}
          />
          <Route
            path="/collections"
            element={<CollectionsPage collections={collections} removeFromCollection={removeFromCollection} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
