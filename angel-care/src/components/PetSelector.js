import React from 'react';
import { PET_TYPES } from '../constants/petTypes';

const PetSelector = ({ currentPetType, onPetTypeChange, isDead }) => {
  return (
    <div className="pet-selector">
      <p className="pet-selector-label">Change pet type:</p>
      <div className="pet-selector-options">
        {Object.entries(PET_TYPES).map(([type, info]) => (
          <button 
            key={type}
            onClick={() => onPetTypeChange(type)} 
            disabled={isDead}
            className={`pet-selector-option ${currentPetType === type ? 'pet-selector-option-active' : ''}`}
          >
            {info.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetSelector;