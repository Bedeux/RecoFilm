import React, { useState } from 'react';
import './App.css';
import image1 from './images/10568.jpg';
import predictionImage from './prediction_image_test.jpg';
import Rating from '@mui/material/Rating';
import PredictionPage from './PredictionPage';
import MovieGallery from './MovieGallery';
import movies_data from './movies_data.json';

function App() {
  const [currentImage, setCurrentImage] = useState(null); // Image initiale
  const [imageCount, setImageCount] = useState(0); // Compteur d'images
  const [prediction, setPrediction] = useState(false); // Variable pour contrôler l'affichage de la prédiction
  const [feedbacks, setFeedbacks] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showMovieGallery, setShowMovieGallery] = useState(false);
  const [displayedImages, setDisplayedImages] = useState([]); // Tableau pour stocker les images déjà affichées
  const getImages = require.context('./images', true);
  const images = getImages.keys().map(image => getImages(image));

  const selectRandomImage = () => {
    if (imageCount < 10) {
      const remainingImages = images.filter(img => !displayedImages.includes(img));
      if (remainingImages.length === 0) {
        // Si toutes les images ont été affichées, réinitialiser le tableau des images affichées
        setDisplayedImages([]);
      }
      const randomIndex = Math.floor(Math.random() * remainingImages.length);
      const randomImage = remainingImages[randomIndex];
      setDisplayedImages([...displayedImages, randomImage]);
      setImageCount(prevCount => prevCount + 1); // Incrémenter le compteur d'images
      return randomImage;
    } else {
      setPrediction(true);

      return predictionImage; // Retourne l'image de prédiction une fois que 10 images ont été affichées
    }
  };

  const handleStarClick = (starRating) => {
    console.log("Rating :", starRating)
    const movieId = currentImage.split('/')[3].split('.')[0]; // Get movie ID from image name

    addFeedback({movie_id: movieId, movie: currentImage, rating: starRating });
    console.log("Feedbacks : ", feedbacks);
    
    const newImage = selectRandomImage();
    setTimeout(() => {
      setCurrentImage(newImage);
    }, 250);

  };

  const addFeedback = (newFeedback) => {
    setFeedbacks(prevFeedbacks => [...prevFeedbacks, newFeedback]);
  };

  const handleShowPrediction = () => {
    setShowPrediction(true);
    setShowMovieGallery(false);
  };

  const handleShowMovieGallery = () => {
    setShowPrediction(false);
    setShowMovieGallery(true);
  };

  // Initialisation de l'image actuelle avec une image aléatoire lors du premier rendu
  if (!currentImage) {
    setCurrentImage(selectRandomImage());
  }

  const movieId = currentImage ? currentImage.split('/media/')[1].split('.')[0] : null;
  const movieTitle = movieId ? movies_data[movieId]?.title : 'Unknown Title';
  const movieDirector = movieId ? movies_data[movieId]?.director : 'Unknown Director';

  return (
    <div className="App">
    {!prediction && (
      <>
        <h1>Notez ce film</h1>
        <p>{imageCount}/10</p>
        <div className="movie-info">
          <img src={currentImage || image1} alt="Film" className="movie-image" />
          <div className="movie-details">
            <h2 className="movie-title">{movieTitle}</h2>
            <h4 className="movie-director">Réalisateur: {movieDirector}</h4>
          </div>
        </div>
        <div className="rating-container">
          <Rating
            name="half-rating"
            defaultValue={0}
            precision={0.5}
            size="large"
            onChange={(event, newValue) => {
              handleStarClick(newValue);
            }}
            value={null} // To reset each change
          />
        </div>
        <button className="gray-button" onClick={() => handleStarClick(null)}>Pas vu</button>
      </>
      )}
      {prediction && (
        <>
          <div className="button-container">
            <button className="gray-button" onClick={handleShowPrediction}>Afficher la prédiction</button>
            <button className="gray-button" onClick={handleShowMovieGallery}>Afficher la galerie de films</button>
          </div>
          {showPrediction && <PredictionPage moviesData={feedbacks} />}
          {showMovieGallery && <MovieGallery movieData={feedbacks} />}
        </>
      )}
    </div>
  );
}

export default App;
