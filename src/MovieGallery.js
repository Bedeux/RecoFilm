import React from 'react';
import Rating from '@mui/material/Rating';

function MovieGallery({ movieData }) {
    return (
        <div className="movie-gallery">
            {movieData.map((movie, index) => (
                <div key={index} className="movie-card">
                    {movie.movie && <img src={movie.movie} alt={`Movie ${index}`} />}
                    
                    {movie.rating && <div className="rating-container">
                    <Rating
                    name="simple-controlled"
                    value={movie.rating}
                    /></div>}
                </div>
            ))}
        </div>
        
    );
}

export default MovieGallery;