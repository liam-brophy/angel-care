import React, { useEffect } from 'react';
import { getPetEmoji } from '../utils/petUtils';
import { PET_TYPES } from '../constants/petTypes';

const AnimatedPet = ({ 
  stats, 
  animationState, 
  containerRef,
  onPetClick
}) => {
  const { 
    petType, 
    isDead, 
    isSleeping, 
    hunger, 
    happiness, 
    energy 
  } = stats;
  
  const {
    petPosition,
    petTarget,
    isMoving,
    petScale,
    petRotation,
    isAnimating,
    setPetPosition,
    setPetTarget,
    setIsMoving,
    setPetScale,
    setPetRotation,
    setIsAnimating
  } = animationState;

  // Animation frame handler
  useEffect(() => {
    if (isDead || stats.gameControls?.isPaused || isSleeping) return;
    
    let animationFrameId;
    let lastTimestamp = 0;
    
    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;
      
      // Move pet toward target position if it's moving
      if (isMoving && containerRef.current) {
        const distX = petTarget.x - petPosition.x;
        const distY = petTarget.y - petPosition.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Stop if we're close enough to target
        if (distance < 5) {
          setIsMoving(false);
        } else {
          // Calculate direction and move
          const moveSpeed = PET_TYPES[petType].speed * deltaTime * 60;
          const moveX = (distX / distance) * moveSpeed;
          const moveY = (distY / distance) * moveSpeed;
          
          // Update position
          const newX = petPosition.x + moveX;
          const newY = petPosition.y + moveY;
          
          // Update rotation to face movement direction
          const angle = Math.atan2(distY, distX);
          setPetRotation(angle);
          
          setPetPosition({ x: newX, y: newY });
        }
      }
      
      // Random movements when not actively moving
      if (!isMoving && Math.random() < 0.01 && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        // Keep pet within boundaries with some margin
        const margin = 50;
        const newTargetX = Math.random() * (containerRect.width - 2 * margin) + margin - containerRect.width / 2;
        const newTargetY = Math.random() * (containerRect.height - 2 * margin) + margin - containerRect.height / 2;
        
        setPetTarget({ x: newTargetX, y: newTargetY });
        setIsMoving(true);
      }
      
      // Random idle animations
      if (!isAnimating && Math.random() < 0.005) {
        setIsAnimating(true);
        
        // Pulse animation
        const initialScale = petScale;
        let animationStep = 0;
        const totalSteps = 20;
        
        const pulseAnimation = () => {
          animationStep++;
          const pulse = 1 + 0.2 * Math.sin(Math.PI * animationStep / 10);
          
          setPetScale(pulse);
          
          if (animationStep < totalSteps) {
            setTimeout(pulseAnimation, 50);
          } else {
            setPetScale(initialScale);
            setIsAnimating(false);
          }
        };
        
        pulseAnimation();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    petPosition, petTarget, isMoving, petType, 
    isDead, isSleeping, petScale, isAnimating,
    containerRef, stats.gameControls?.isPaused,
    setPetPosition, setPetTarget, setIsMoving, 
    setPetScale, setPetRotation, setIsAnimating
  ]);
  
  return (
    <div 
      className="pet-character"
      style={{
        left: `calc(50% + ${petPosition.x}px)`,
        top: `calc(50% + ${petPosition.y}px)`,
        transform: `translate(-50%, -50%) rotate(${petRotation}rad) scale(${petScale})`,
        transition: isMoving ? 'none' : 'transform 0.3s ease-out'
      }}
      onClick={onPetClick}
    >
      {/* 3D-like pet representation using CSS */}
      <div className={`pet-body ${isDead ? 'pet-dead' : ''}`}>
        {/* Pet shadow */}
        <div 
          className="pet-shadow"
          style={{
            transform: `scale(${isMoving ? 0.7 : 1}, 0.5)`
          }}
        ></div>
        
        {/* Pet body */}
        <div
          className="pet-avatar"
          style={{
            backgroundColor: `var(--pet-color-${petType})`
          }}
        >
          {/* Pet face */}
          <span className="pet-face">
            {getPetEmoji(petType, isDead, isSleeping, hunger, happiness, energy)}
          </span>
          
          {/* Z's for sleeping */}
          {isSleeping && (
            <div className="pet-sleeping">
              Z<sup>z</sup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedPet;