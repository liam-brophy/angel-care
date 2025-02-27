import React, { useEffect } from 'react';
import usePetState from './hooks/usePetState';
import StatusBars from './components/StatusBars';
import Controls from './components/Controls';
import PetSelector from './components/PetSelector';
import GameEnvironment from './components/GameEnvironment';
import { PET_TYPES } from './constants/petTypes';
import './styles/index.css';
import './styles/pet-styles.css';

const App = () => {
  const petState = usePetState();
  const { stats, setters, gameControls, animationState } = petState;
  
  // Actions
  const feedPet = () => {
    if (stats.isDead || gameControls.isPaused) return;
    
    setters.setHunger(prev => Math.min(prev + 30, 100));
    setters.setEnergy(prev => Math.min(prev + 5, 100));
    setters.setMessage(`You fed ${stats.petName}!`);
    
    // Animation for feeding
    animationState.setIsAnimating(true);
    let step = 0;
    
    const feedAnimation = () => {
      step++;
      animationState.setPetScale(1 + 0.1 * Math.sin(step * 0.5));
      
      if (step < 10) {
        setTimeout(feedAnimation, 100);
      } else {
        animationState.setPetScale(1);
        animationState.setIsAnimating(false);
      }
    };
    
    feedAnimation();
  };
  
  const playWithPet = () => {
    if (stats.isDead || gameControls.isPaused || stats.isSleeping) return;
    
    if (stats.energy < 20) {
      setters.setMessage(`${stats.petName} is too tired to play!`);
      return;
    }
    
    setters.setHappiness(prev => Math.min(prev + 25, 100));
    setters.setHunger(prev => Math.max(prev - 10, 0));
    setters.setEnergy(prev => Math.max(prev - 15, 0));
    setters.setMessage(`You played with ${stats.petName}!`);
    
    // Get container reference for bounds
    const container = document.querySelector('.game-environment');
    
    // Play animation - make pet run around
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
  
  const putToBed = () => {
    if (stats.isDead) return;
    
    setters.setIsSleeping(!stats.isSleeping);
    setters.setMessage(stats.isSleeping ? `${stats.petName} woke up!` : `${stats.petName} is sleeping...`);
    
    // Stop movement if going to sleep
    if (!stats.isSleeping) {
      animationState.setIsMoving(false);
    }
  };
  
  const healPet = () => {
    if (stats.isDead) return;
    
    setters.setHealth(100);
    setters.setMessage(`You gave ${stats.petName} medicine!`);
    
    // Healing animation
    animationState.setIsAnimating(true);
    let step = 0;
    
    const healAnimation = () => {
      step++;
      
      // Flash with healing color
      const petElement = document.querySelector('.pet-avatar');
      if (petElement) {
        if (step % 2 === 0) {
          petElement.style.backgroundColor = "#7FFF00";
        } else {
          petElement.style.backgroundColor = `var(--pet-color-${stats.petType})`;
        }
      }
      
      if (step < 10) {
        setTimeout(healAnimation, 200);
      } else {
        if (petElement) {
          petElement.style.backgroundColor = `var(--pet-color-${stats.petType})`;
        }
        animationState.setIsAnimating(false);
      }
    };
    
    healAnimation();
  };
  
  const changeName = () => {
    if (stats.isDead) return;
    
    const newName = prompt("Enter a new name for your pet:", stats.petName);
    if (newName && newName.trim() !== "") {
      setters.setPetName(newName.trim());
      setters.setMessage(`Your pet is now named ${newName}!`);
    }
  };
  
  const changePetType = (type) => {
    if (stats.isDead) return;
    
    setters.setPetType(type);
    setters.setMessage(`Your pet has transformed into a ${type}!`);
    
    // Transform animation
    animationState.setIsAnimating(true);
    let step = 0;
    
    const transformAnimation = () => {
      step++;
      animationState.setPetScale(1 + 0.3 * Math.sin(step * 0.5));
      animationState.setPetRotation(animationState.petRotation + 0.5);
      
      if (step < 12) {
        setTimeout(transformAnimation, 50);
      } else {
        animationState.setPetScale(1);
        animationState.setIsAnimating(false);
      }
    };
    
    transformAnimation();
  };
  
  const resetPet = () => {
    if (window.confirm("Are you sure you want to reset your pet?")) {
      setters.setHunger(50);
      setters.setHappiness(50);
      setters.setEnergy(50);
      setters.setHealth(100);
      setters.setAge(0);
      setters.setIsSleeping(false);
      setters.setIsDead(false);
      setters.setMessage("Your pet has been reborn!");
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
    feedPet,
    playWithPet,
    putToBed,
    healPet,
    changeName,
    resetPet,
    togglePause
  };
  
  // Setup CSS variables for pet colors
  useEffect(() => {
    Object.entries(PET_TYPES).forEach(([type, info]) => {
      document.documentElement.style.setProperty(`--pet-color-${type}`, info.color);
    });
  }, []);
  
  return (
    <div className="app-container">
      <h1 className="app-title">Virtual Pet</h1>
      
      <GameEnvironment 
        stats={{...stats, gameControls}}
        animationState={animationState}
        setters={setters}
        gameControls={gameControls}
      />
      
      <div className="pet-panel">
        <div className="pet-header">
          <div className="pet-info">
            <h2 className="pet-name">{stats.petName}</h2>
            <p className="pet-age">Age: {Math.floor(stats.age/20)} days</p>
          </div>
          {stats.isDead && <p className="pet-death-notice">Your pet has died!</p>}
        </div>
        
        <StatusBars stats={stats} />
        
        <Controls 
          stats={{...stats, gameControls}} 
          actions={actions} 
        />
        
        <PetSelector 
          currentPetType={stats.petType} 
          onPetTypeChange={changePetType} 
          isDead={stats.isDead} 
        />
      </div>
      
      <div className="game-instructions">
        <p>Take care of your pet by feeding, playing, and letting it rest.</p>
        <p>If health reaches 0, your pet will die!</p>
      </div>
    </div>
  );
};

export default App;