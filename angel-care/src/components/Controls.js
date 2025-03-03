import React from 'react';

const Controls = ({ stats, actions }) => {
  const { petName, isDead, isSleeping, energy, health } = stats;
  const { feedPet, playWithPet, putToBed, healPet, changeName, resetPet, togglePause } = actions;
  const { isPaused } = stats.gameControls || {};
  
  return (
    <div className="pet-controls">
      <div className="pet-actions">
        <button 
          onClick={feedPet} 
          disabled={isDead}
          className="action-button action-feed"
        >
          Feed 🍔
        </button>
        <button 
          onClick={playWithPet} 
          disabled={isDead || energy < 20 || isSleeping}
          className="action-button action-play"
        >
          Play 🎾
        </button>
        <button 
          onClick={putToBed} 
          disabled={isDead}
          className="action-button action-sleep"
        >
          {isSleeping ? "Wake Up ⏰" : "Sleep 💤"}
        </button>
        <button 
          onClick={healPet} 
          disabled={isDead || health === 100}
          className="action-button action-heal"
        >
          Heal 💊
        </button>
      </div>
      
      <div className="pet-settings">
        <button
          onClick={changeName}
          disabled={isDead}
          className="settings-button settings-rename"
        >
          Rename
        </button>
        <button
          onClick={togglePause}
          className="settings-button settings-pause"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={resetPet}
          className="settings-button settings-reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;