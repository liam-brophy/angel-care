import React, { useRef } from 'react';
import AnimatedPet from './AnimatedPet';

const GameEnvironment = ({ stats, animationState, setters, gameControls }) => {
  const { message, petName } = stats;
  const containerRef = useRef(null);
  
  // Handle container click for pet movement
  const handleContainerClick = (e) => {
    if (stats.isDead || gameControls.isPaused || stats.isSleeping) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;
    
    // Calculate click position relative to container center
    const clickX = e.clientX - containerRect.left - containerCenterX;
    const clickY = e.clientY - containerRect.top - containerCenterY;
    
    animationState.setPetTarget({ x: clickX, y: clickY });
    animationState.setIsMoving(true);
    setters.setMessage(`${petName} is coming!`);
  };
  
  // Handle pet click for interaction
  const handlePetClick = (e) => {
    e.stopPropagation();
    if (stats.isDead) return;
    
    // Pet reacts when clicked
    animationState.setIsAnimating(true);
    animationState.setPetScale(1.3); // Temporary grow
    
    // Random happy sounds or reactions
    const reactions = [
      `${petName} purrs happily!`,
      `${petName} nuzzles your hand!`,
      `${petName} looks at you lovingly!`,
      `${petName} makes a happy sound!`
    ];
    
    setters.setMessage(reactions[Math.floor(Math.random() * reactions.length)]);
    setters.setHappiness(prev => Math.min(prev + 5, 100));
    
    // Reset scale after animation
    setTimeout(() => {
      animationState.setPetScale(1);
      animationState.setIsAnimating(false);
    }, 300);
  };
  
  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`game-environment ${stats.isDead || gameControls.isPaused || stats.isSleeping ? 'game-environment-inactive' : ''}`}
    >
      <AnimatedPet 
        stats={stats}
        animationState={animationState}
        containerRef={containerRef}
        onPetClick={handlePetClick}
      />
      
      {/* Status message overlay */}
      <div className="game-message">
        {message}
      </div>
    </div>
  );
};

export default GameEnvironment;