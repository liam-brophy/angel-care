import React, { useEffect } from 'react';
import usePetState from './hooks/usePetState';
import './styles/index.css';
import './styles/pet-styles.css';

const App = () => {
  const petState = usePetState();
  const { stats, setters, gameControls, animationState } = petState;
  
  // Actions
  const nourish = () => {
    if (stats.isDead || gameControls.isPaused) return;
    
    setters.setHunger(prev => Math.min(prev + 30, 100));
    setters.setEnergy(prev => Math.min(prev + 5, 100));
    setters.setMessage(`You nourished ${stats.petName}!`);
    
    // Animation for feeding
    animationState.setIsAnimating(true);
    let step = 0;
    
    const nourishAnimation = () => {
      step++;
      animationState.setPetScale(1 + 0.1 * Math.sin(step * 0.5));
      
      if (step < 10) {
        setTimeout(nourishAnimation, 100);
      } else {
        animationState.setPetScale(1);
        animationState.setIsAnimating(false);
      }
    };
    
    nourishAnimation();
  };
  
  const engage = () => {
    if (stats.isDead || gameControls.isPaused || stats.isSleeping) return;
    
    if (stats.energy < 20) {
      setters.setMessage(`${stats.petName} is too tired to engage!`);
      return;
    }
    
    setters.setHappiness(prev => Math.min(prev + 25, 100));
    setters.setHunger(prev => Math.max(prev - 10, 0));
    setters.setEnergy(prev => Math.max(prev - 15, 0));
    setters.setMessage(`You engaged with ${stats.petName}!`);
    
    // Get container reference for bounds
    const container = document.querySelector('.game-environment');
    
    // Play animation - make pet fly around
    const makeRandomMovement = () => {
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const margin = 30;
        const randomX = Math.random() * (containerRect.width - 2 * margin) + margin - containerRect.width / 2;
        const randomY = Math.random() * (containerRect.height - 2 * margin) + margin - containerRect.height / 2;
        
        animationState.setPetTarget({ x: randomX, y: randomY });
        animationState.setIsMoving(true);
      }
    };
    
    // Make multiple random movements
    for (let i = 0; i < 5; i++) {
      setTimeout(makeRandomMovement, i * 1000);
    }
  };
  
  const slumber = () => {
    if (stats.isDead) return;
    
    setters.setIsSleeping(!stats.isSleeping);
    setters.setMessage(stats.isSleeping ? `${stats.petName} woke up!` : `${stats.petName} is slumbering...`);
    
    // Stop movement if going to sleep
    if (!stats.isSleeping) {
      animationState.setIsMoving(false);
    }
  };
  
  const replenish = () => {
    if (stats.isDead) return;
    
    setters.setHealth(100);
    setters.setMessage(`You replenished ${stats.petName}'s energy!`);
    
    // Healing animation
    animationState.setIsAnimating(true);
    let step = 0;
    
    const replenishAnimation = () => {
      step++;
      
      // Flash with healing color
      const petElement = document.querySelector('.pet-avatar');
      if (petElement) {
        if (step % 2 === 0) {
          petElement.style.backgroundColor = "#FF69B4"; // Pink tint for butterfly theme
        } else {
          petElement.style.backgroundColor = `var(--pet-color-${stats.petType})`;
        }
      }
      
      if (step < 10) {
        setTimeout(replenishAnimation, 200);
      } else {
        if (petElement) {
          petElement.style.backgroundColor = `var(--pet-color-${stats.petType})`;
        }
        animationState.setIsAnimating(false);
      }
    };
    
    replenishAnimation();
  };
  
  const changeName = () => {
    if (stats.isDead) return;
    
    const newName = prompt("Enter a new name for your angel:", stats.petName);
    if (newName && newName.trim() !== "") {
      setters.setPetName(newName.trim());
      setters.setMessage(`Your angel is now named ${newName}!`);
    }
  };
  
  const resetPet = () => {
    if (window.confirm("Are you sure you want to reset your angel?")) {
      setters.setHunger(50);
      setters.setHappiness(50);
      setters.setEnergy(50);
      setters.setHealth(100);
      setters.setAge(0);
      setters.setIsSleeping(false);
      setters.setIsDead(false);
      setters.setMessage("Your angel has been reborn!");
      animationState.setPetPosition({ x: 0, y: 0 });
      animationState.setPetTarget({ x: 0, y: 0 });
      animationState.setIsMoving(false);
    }
  };
  
  const togglePause = () => {
    gameControls.setIsPaused(!gameControls.isPaused);
  };
  
  // Define actions for passing to components
  const actions = {
    nourish,
    engage,
    slumber,
    replenish,
    changeName,
    resetPet,
    togglePause
  };
  
  return (
    <div className="app-container">
      <div className="game-environment">
        <div className="pet-display-area">
          {/* Pet avatar will be displayed here */}
          <div 
            className={`pet-avatar ${stats.isSleeping ? 'sleeping' : ''} ${stats.isDead ? 'dead' : ''}`}
            style={{
              transform: `translate(${animationState.petPosition.x}px, ${animationState.petPosition.y}px) 
                        scale(${animationState.petScale}) 
                        rotate(${animationState.petRotation}deg)`,
            }}
          />
        </div>
      </div>
      
      <div className="control-panel">
        <div className="pet-profile">
          <div className="pet-thumbnail" />
          <div className="pet-info">
            <h2 className="pet-name">{stats.petName}</h2>
            <p className="pet-age">AGE: {Math.floor(stats.age/20)} days</p>
            <p className="pet-bio">Short bio lorem ipsum</p>
          </div>
        </div>
        
        <div className="status-bars">
          <div className="status-bar">
            <div className="status-fill health-fill" style={{width: `${stats.health}%`}}></div>
            <div className="status-background health-background"></div>
          </div>
          
          <div className="status-bar">
            <div className="status-fill energy-fill" style={{width: `${stats.energy}%`}}></div>
            <div className="status-background energy-background"></div>
          </div>
          
          <div className="status-bar">
            <div className="status-fill happiness-fill" style={{width: `${stats.happiness}%`}}></div>
            <div className="status-background happiness-background"></div>
          </div>
          
          <div className="status-bar">
            <div className="status-fill hunger-fill" style={{width: `${stats.hunger}%`}}></div>
            <div className="status-background hunger-background"></div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-button replenish-button" 
            onClick={replenish}
            disabled={stats.isDead}
          >
            REPLENISH
          </button>
          
          <button 
            className="action-button nourish-button" 
            onClick={nourish}
            disabled={stats.isDead}
          >
            NOURISH
          </button>
          
          <button 
            className="action-button engage-button" 
            onClick={engage}
            disabled={stats.isDead || stats.isSleeping}
          >
            ENGAGE
          </button>
          
          <button 
            className="action-button slumber-button" 
            onClick={slumber}
            disabled={stats.isDead}
          >
            SLUMBER
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;