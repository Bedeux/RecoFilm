import React, { useState, useEffect } from 'react';
import axios from 'axios';
import movies_data from './movies_data.json';
import movies_streaming from './movies_streaming.json';

const PredictionPage = ({ moviesData }) => {
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const url_prediction = `https://www.allocine.fr/film/fichefilm_gen_cfilm=${prediction}.html`;
  const getImages = require.context('./images', true);
  const images = getImages.keys().map(image => getImages(image));
  const getLogos = require.context('./streaming_logos', true);
  const logos = getLogos.keys().map(logo => getLogos(logo));

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

  const movieTitle = prediction ? movies_data[prediction]?.title : 'Unknown Title';
  const movieDirector = prediction ? movies_data[prediction]?.director : 'Unknown Director';

  return (
    <div>
      <div className="link-container" style={{ marginTop: '50px' }}>
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
          <div>
            <a href={url_prediction} target="_blank" rel="noopener noreferrer">
              <img src={images.find(img => img.includes(prediction))} alt="Film" style={{ maxWidth: '100%' }} />
            </a>            
            <div className="movie-details">
              <h2 className="movie-title">{movieTitle}</h2>
              <h4 className="movie-director">Réalisateur: {movieDirector}</h4>
            </div>  
            <div className="streaming-links">
                {movies_streaming[prediction] && (
                  <div>
                    {movies_streaming[prediction].netflix_url && (
                      <a href={movies_streaming[prediction].netflix_url} target="_blank" rel="noopener noreferrer">
                        <img src={logos.find(img => img.includes('netflix'))} alt="Netflix"  className="streaming-logo" />
                      </a>
                    )}
                    {movies_streaming[prediction].prime_video_url && (
                      <a href={movies_streaming[prediction].prime_video_url} target="_blank" rel="noopener noreferrer">
                        <img src={logos.find(img => img.includes('prime_video'))} alt="Prime Video"  className="streaming-logo" />
                      </a>
                    )}
                    {movies_streaming[prediction].disney_url && (
                      <a href={movies_streaming[prediction].disney_url} target="_blank" rel="noopener noreferrer">
                        <img src={logos.find(img => img.includes('disney'))} alt="Disney+"  className="streaming-logo" />
                      </a>
                    )}
                  </div>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
