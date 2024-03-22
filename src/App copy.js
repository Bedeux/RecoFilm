import React, { useState, useEffect } from 'react';
import golden_ball_predictions from './predictions_winners.json';
import real_ranking_golden_ball from './real_ranking.json';
import FootballerImage from './imagesWinner';

function App() {
  const [selectedYear, setSelectedYear] = useState('');
  const [predictionYearData, setPredictionYearData] = useState(null);
  const [realYearData, setRealYearData] = useState(null);

  // Array 2016 to 2023
  const years = Array.from({ length: 8 }, (_, index) => 2016 + index);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedYear && golden_ball_predictions[selectedYear]) {
          setPredictionYearData(golden_ball_predictions[selectedYear]);
        } else {
          setPredictionYearData(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedYear && real_ranking_golden_ball[selectedYear]) {
          setRealYearData(real_ranking_golden_ball[selectedYear]);
        } else {
          setRealYearData(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="App">
      <h1>Prédiction du Ballon d'Or</h1>
      <img src="test.jpg" alt="T" />
      <div className="mb-3">
        <label htmlFor="year">Sélectionnez une année : </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="">-- Sélectionnez une année --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {selectedYear && (
        <div className="mt-3">
          <h2>Informations pour l'année {selectedYear} :</h2>
          {realYearData ? (
            <>
            <h3>Vrai classement</h3>
            <FootballerImage winnerName={realYearData.winner} />
              <p>1st: {realYearData.winner}</p>
              <p>2st: {realYearData.runnerUp}</p>
              <p>3rd: {realYearData.thirdPlace}</p>
            </>
          ) : (
            <p>Aucune information disponible pour cette année.</p>
          )}

          {predictionYearData ? (
            <>
              <h3>Prédictions</h3>
              <p>1st: {predictionYearData.winner}</p>
              <p>2st: {predictionYearData.runnerUp}</p>
              <p>3rd: {predictionYearData.thirdPlace}</p>
            </>
          ) : (
            <p>Aucune information disponible pour cette année.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;