import { PET_TYPES } from '../constants/petTypes';

// Mood based on stats
export const getMood = (hunger, happiness, energy) => {
  const avgStats = (hunger + happiness + energy) / 3;
  if (avgStats > 75) return "ecstatic";
  if (avgStats > 50) return "happy";
  if (avgStats > 25) return "okay";
  return "sad";
};

// Get pet emoji based on state
export const getPetEmoji = (petType, isDead, isSleeping, hunger, happiness, energy) => {
  if (isDead) return "💀";
  if (isSleeping) return "😴";
  
  const mood = getMood(hunger, happiness, energy);
  switch (mood) {
    case "ecstatic": return PET_TYPES[petType].emoji;
    case "happy": return PET_TYPES[petType].emoji;
    case "okay": return PET_TYPES[petType].emoji;
    case "sad": return "😢";
    default: return PET_TYPES[petType].emoji;
  }
};

// Status indicators
export const getStatusColor = (value) => {
  if (value > 75) return "status-excellent";
  if (value > 50) return "status-good";
  if (value > 25) return "status-warning";
  return "status-danger";
};

// src/components/StatusBars.js
import React from 'react';
import { getStatusColor } from '../utils/petUtils';

const StatusBars = ({ stats }) => {
  const { hunger, happiness, energy, health } = stats;
  
  return (
    <div className="status-bars">
      <div className="status-bar-container">
        <div className="status-bar-label">
          <span>Hunger</span>
          <span>{hunger}%</span>
        </div>
        <div className="status-bar-background">
          <div 
            className={`status-bar-fill ${getStatusColor(hunger)}`} 
            style={{width: `${hunger}%`}}
          ></div>
        </div>
      </div>
      
      <div className="status-bar-container">
        <div className="status-bar-label">
          <span>Happiness</span>
          <span>{happiness}%</span>
        </div>
        <div className="status-bar-background">
          <div 
            className={`status-bar-fill ${getStatusColor(happiness)}`} 
            style={{width: `${happiness}%`}}
          ></div>
        </div>
      </div>
      
      <div className="status-bar-container">
        <div className="status-bar-label">
          <span>Energy</span>
          <span>{energy}%</span>
        </div>
        <div className="status-bar-background">
          <div 
            className={`status-bar-fill ${getStatusColor(energy)}`} 
            style={{width: `${energy}%`}}
          ></div>
        </div>
      </div>
      
      <div className="status-bar-container">
        <div className="status-bar-label">
          <span>Health</span>
          <span>{health}%</span>
        </div>
        <div className="status-bar-background">
          <div 
            className={`status-bar-fill ${getStatusColor(health)}`} 
            style={{width: `${health}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBars;