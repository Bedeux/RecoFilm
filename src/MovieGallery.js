import React from 'react';
import Rating from '@mui/material/Rating';

function MovieGallery({ movieData }) {
    return (
        <div className="movie-gallery">
        {movieData
            .filter(movie => movie.rating !== null) // Filtrer les films avec une valeur de rating différente de null
            .map((movie, index) => (
            <div key={index} className="movie-card">
                {movie.movie && <img src={movie.movie} alt={`Movie ${index}`} />}
                
                <div className="rating-container">
                <Rating
                    name="simple-controlled"
                    value={movie.rating}
                    precision={0.5}
                    readOnly
                />
                </div>
            </div>
            ))}
        </div>
        
    );
}

export default MovieGallery;