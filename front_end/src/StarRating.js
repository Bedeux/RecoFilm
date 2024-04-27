import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Import des icônes FontAwesome version 5

const StarRating = () => {
  const [rating, setRating] = useState(0);

  const handleClick = (value) => {
    setRating(value);
  };

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
            />
            <FaStar
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
