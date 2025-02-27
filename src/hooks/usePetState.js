import { useState, useEffect } from 'react';

const usePetState = () => {
  // Pet stats
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [health, setHealth] = useState(100);
  const [age, setAge] = useState(0);
  const [petName, setPetName] = useState("My Pet");
  const [petType, setPetType] = useState("cat");
  const [isSleeping, setIsSleeping] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [message, setMessage] = useState("Welcome to your new pet!");
  
  // Game time control
  const [isPaused, setIsPaused] = useState(false);
  
  // Animation state
  const [petPosition, setPetPosition] = useState({ x: 0, y: 0 });
  const [petTarget, setPetTarget] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [petScale, setPetScale] = useState(1);
  const [petRotation, setPetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Time and stat updates
  useEffect(() => {
    if (isDead || isPaused) return;
    
    const interval = setInterval(() => {
      // Only decrease stats if not sleeping
      if (!isSleeping) {
        setHunger(prev => Math.max(prev - 2, 0));
        setHappiness(prev => Math.max(prev - 1, 0));
        setEnergy(prev => Math.max(prev - 1.5, 0));
      } else {
        setEnergy(prev => Math.min(prev + 5, 100));
      }
      
      // Age increases regardless of sleep
      setAge(prev => prev + 1);
      
      // Health decreases if hunger or happiness are very low
      if (hunger < 20 || happiness < 20) {
        setHealth(prev => Math.max(prev - 5, 0));
      }
      
      // Check if pet died
      if (health <= 0 && !isDead) {
        setIsDead(true);
        setIsMoving(false);
        setMessage(`${petName} has died! 😢 You can reset to get a new pet.`);
      }
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, [hunger, happiness, energy, health, isSleeping, isDead, isPaused, petName]);

  return {
    stats: {
      hunger,
      happiness,
      energy,
      health,
      age,
      petName,
      petType,
      isSleeping,
      isDead,
      message
    },
    setters: {
      setHunger,
      setHappiness,
      setEnergy,
      setHealth,
      setAge,
      setPetName,
      setPetType,
      setIsSleeping,
      setIsDead,
      setMessage
    },
    gameControls: {
      isPaused,
      setIsPaused
    },
    animationState: {
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
    }
  };
};

export default usePetState;