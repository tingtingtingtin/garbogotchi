import { useState } from 'react';
import tamagotchiImage from './assets/tamagotchi.png'; // Replace with your Tamagotchi image

function App(): React.JSX.Element {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  // Function to simulate increasing points (e.g., when trash is placed correctly)
  const incrementPoints = (): void => {
    setPoints(points + 10);
    if (points + 10 >= 100) {
      setLevel(level + 1);
      setPoints(0); // Reset points for the next level
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="text-3xl">Welcome to GarboGotchi!</h1>
        <p>Help your Tamagotchi grow by sorting trash correctly!</p>
      </div>
      <div className="tamagotchi-section">
        <img src={tamagotchiImage} alt="Tamagotchi" className="tamagotchi-image" />
        <div className="tamagotchi-stats">
          <p>Level: {level}</p>
          <p>Points: {points}</p>
        </div>
      </div>

      <div className="instructions">
        <p>Your Tamagotchi loves cleanliness! Place trash in the right bins to earn points.</p>
        <p>Press the button below when you sort trash correctly!</p>
      </div>

      <div className="action-buttons">
        <button className="sort-trash-button" onClick={incrementPoints}>
          Sort Trash Correctly!
        </button>
      </div>

      <footer className="footer">
        <p>GarboGotchi</p>
      </footer>
    </div>
  );
}

export default App;
