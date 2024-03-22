import React from 'react';
import predictionImage from './prediction_image_test.jpg';


const handleStarClick = (text) => {
    console.log("Film :",text)
  };

function PredictionPage({ goToHomePage }) {
  return (
    <div>
      <img src={predictionImage} alt="Film"  style={{ marginTop: '30px' }} />
      <div className="link-container">
        <a href="https://www.allocine.fr/film/fichefilm_gen_cfilm=6641.html" target="_blank" rel="noopener noreferrer">
          Le Silence des agneaux
        </a>
      </div>
      <button className="gray-button" onClick={() => handleStarClick(null)}>Déjà Vu</button>
    </div>
  );
}

export default PredictionPage;