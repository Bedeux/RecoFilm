import React, { useState } from 'react';
import './App.css';
import image1 from './images/514297.webp';
import image2 from './images/19254683.webp';
import image3 from './images/18686447.jpg';
import image4 from './images/18949761.jpg';
import image5 from './images/5927961.jpg';
import image6 from './images/1848157.jpg';
import image7 from './images/2412010.jpg';
import image8 from './images/158828.jpg';
import image9 from './images/18846059.jpg';
import image10 from './images/19255605.jpg';
import image11 from './images/0688770.jpg';
import image12 from './images/3992754.jpg';
import image13 from './images/19057560.webp';
import predictionImage from './prediction_image_test.jpg';
// import StarRating from './StarRating'; // Import du composant StarRating depuis le fichier StarRating.js
import Rating from '@mui/material/Rating';
import PredictionPage from './PredictionPage';
import MovieGallery from './MovieGallery';



function App() {
  const [displayedImages, setDisplayedImages] = useState([]); // Tableau pour stocker les images déjà affichées
  const [currentImage, setCurrentImage] = useState(null); // Image initiale
  const [imageCount, setImageCount] = useState(1); // Compteur d'images
  const [prediction, setPrediction] = useState(false); // Variable pour contrôler l'affichage de la prédiction
  const [feedbacks, setFeedbacks] = useState([]);  
  const [currentPage, setCurrentPage] = useState('home');
  const [showPrediction, setShowPrediction] = useState(false);
  const [showMovieGallery, setShowMovieGallery] = useState(false);


  const goToPredictionPage = () => {
    setCurrentPage('prediction');
  };

  // Fonction pour revenir à la page d'accueil
  const goToHomePage = () => {
    setCurrentPage('home');
  };

  // Tableau contenant toutes les images initiales - Image 1 déjà print
  const images = [image2, image3, image4, image5, image6,image7,image8,image9,image10, image11, image12, image13];

  // Fonction pour sélectionner une image aléatoire qui n'a pas encore été affichée
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
    console.log("Rating :",starRating)

    addFeedback({ movie: currentImage, rating: starRating });
    console.log("Feedbacks : ", feedbacks);

    const newImage = selectRandomImage();

    setTimeout(() => {
      setCurrentImage(newImage); // TODO ATTENTION AU SLEEP
    }, 250);
  };

  const addFeedback = (newFeedback) => {
    setFeedbacks(prevFeedbacks => [...prevFeedbacks, newFeedback]);
  };

  const handleShowPrediction = () => {
    setShowPrediction(true);
    setShowMovieGallery(false)
};

const handleShowMovieGallery = () => {
    setShowPrediction(false);
    setShowMovieGallery(true)
};
  
  return (
    <div className="App">
        {!prediction && (
          <>
            <h1>Notez ce film</h1>

            <p>{imageCount}/10</p>
            <img src={currentImage || image1} alt="Film" /> {/* Utilisez une image par défaut au début */}
            <div  className="rating-container">
            <Rating
              name="half-rating"
              defaultValue={0} 
              precision={0.5}
              size="large"
              onChange={(event, newValue) => {
                handleStarClick(newValue)
              }}
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
            {showPrediction && <PredictionPage />}
            {showMovieGallery && <MovieGallery movieData={feedbacks} />}
            </>
        )}
    </div>
  );
}

export default App;

// <MovieGallery movieData={feedbacks} />