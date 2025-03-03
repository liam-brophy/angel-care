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
