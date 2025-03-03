import { useState, useEffect, useRef } from 'react';

const usePetState = () => {
  // Load from localStorage if available
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error loading from storage", e);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Pet status stats
  const [petName, setPetName] = useState(loadFromStorage('petName', 'Angel'));
  const [petType, setPetType] = useState(loadFromStorage('petType', 'butterfly'));
  const [hunger, setHunger] = useState(loadFromStorage('hunger', 50));
  const [happiness, setHappiness] = useState(loadFromStorage('happiness', 50));
  const [energy, setEnergy] = useState(loadFromStorage('energy', 50));
  const [health, setHealth] = useState(loadFromStorage('health', 100));
  const [age, setAge] = useState(loadFromStorage('age', 0));
  const [isSleeping, setIsSleeping] = useState(loadFromStorage('isSleeping', false));
  const [isDead, setIsDead] = useState(loadFromStorage('isDead', false));
  const [message, setMessage] = useState('');

  // Game controls
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Animation state
  const [petPosition, setPetPosition] = useState({ x: 0, y: 0 });
  const [petTarget, setPetTarget] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [petScale, setPetScale] = useState(1);
  const [petRotation, setPetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Timer references for game logic
  const gameLoopRef = useRef(null);
  const animationLoopRef = useRef(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('petName', JSON.stringify(petName));
    localStorage.setItem('petType', JSON.stringify(petType));
    localStorage.setItem('hunger', JSON.stringify(hunger));
    localStorage.setItem('happiness', JSON.stringify(happiness));
    localStorage.setItem('energy', JSON.stringify(energy));
    localStorage.setItem('health', JSON.stringify(health));
    localStorage.setItem('age', JSON.stringify(age));
    localStorage.setItem('isSleeping', JSON.stringify(isSleeping));
    localStorage.setItem('isDead', JSON.stringify(isDead));
  }, [petName, petType, hunger, happiness, energy, health, age, isSleeping, isDead]);

  // Main game loop
  useEffect(() => {
    const updateGame = () => {
      if (isPaused || isDead) {
        return;
      }

      const now = Date.now();
      const deltaTime = now - lastUpdateTime;
      setLastUpdateTime(now);

      // Update values every second
      if (deltaTime >= 1000) {
        const seconds = Math.floor(deltaTime / 1000);

        // Age increases over time
        setAge(prevAge => prevAge + seconds);

        // If sleeping, energy recovers faster
        if (isSleeping) {
          setEnergy(prevEnergy => Math.min(prevEnergy + seconds * 0.5, 100));
        } else {
          // When awake, hunger and energy decrease over time
          setHunger(prevHunger => Math.max(prevHunger - seconds * 0.2, 0));
          setEnergy(prevEnergy => Math.max(prevEnergy - seconds * 0.1, 0));
        }

        // Happiness decreases if hunger is low
        if (hunger < 20) {
          setHappiness(prevHappiness => Math.max(prevHappiness - seconds * 0.3, 0));
        }

        // Health decreases if happiness or hunger is very low
        if (happiness < 10 || hunger < 5) {
          setHealth(prevHealth => Math.max(prevHealth - seconds * 0.5, 0));
        }

        // Check for death
        if (health <= 0 && !isDead) {
          setIsDead(true);
          setMessage(`Your angel has passed away! You can reset to start over.`);
        }
      }
    };

    gameLoopRef.current = setInterval(updateGame, 1000);
    return () => clearInterval(gameLoopRef.current);
  }, [isPaused, isDead, isSleeping, hunger, happiness, health, lastUpdateTime]);

  // Animation loop for movement
  useEffect(() => {
    const updateMovement = () => {
      if (isMoving) {
        const dx = petTarget.x - petPosition.x;
        const dy = petTarget.y - petPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          // Calculate movement step
          const speed = 2;
          const stepX = dx / distance * speed;
          const stepY = dy / distance * speed;

          // Update position
          setPetPosition(prev => ({
            x: prev.x + stepX,
            y: prev.y + stepY
          }));
        } else {
          // Target reached
          setIsMoving(false);
        }
      }
    };

    animationLoopRef.current = setInterval(updateMovement, 16); // ~60fps
    return () => clearInterval(animationLoopRef.current);
  }, [isMoving, petPosition, petTarget]);

  return {
    stats: {
      petName,
      petType,
      hunger,
      happiness,
      energy,
      health,
      age,
      isSleeping,
      isDead,
      message
    },
    setters: {
      setPetName,
      setPetType,
      setHunger,
      setHappiness,
      setEnergy,
      setHealth,
      setAge,
      setIsSleeping,
      setIsDead,
      setMessage
    },
    gameControls: {
      isPaused,
      setIsPaused,
      lastUpdateTime,
      setLastUpdateTime
    },
    animationState: {
      petPosition,
      setPetPosition,
      petTarget,
      setPetTarget,
      isMoving,
      setIsMoving,
      petScale,
      setPetScale,
      petRotation,
      setPetRotation,
      isAnimating,
      setIsAnimating
    }
  };
};

export default usePetState;