import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PredictionPage = ({ moviesData }) => {
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const url_prediction = `https://www.allocine.fr/film/fichefilm_gen_cfilm=${prediction}.html`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/predict', { data: moviesData });
        
        console.log("FLASK response : ", response.data);
        setPrediction(response.data.prediction);
        setIsLoading(false); // Marquer le chargement comme terminé
      } catch (error) {
        console.error('Error fetching prediction:', error);
        setIsLoading(false); // Marquer le chargement comme terminé en cas d'erreur
      }
    };

    fetchData();
  }, [moviesData]); // Appeler fetchData lors du changement de moviesData

  return (
    <div>
      <div className="link-container" style={{ marginTop: '50px' }}>
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <a href={url_prediction} target="_blank" rel="noopener noreferrer">
            Film prédit
          </a>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;