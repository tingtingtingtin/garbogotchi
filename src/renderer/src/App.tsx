import { useState, useEffect } from 'react';
import tamagotchiImage from './assets/skins/lebron.png';
import PopUp from './components/PopUp';
import InteractButton from './components/InteractButton';
import { Heart, Dices, Laugh, Trash2, Bomb, Shirt } from 'lucide-react';
import Bar from './components/Bar'; // Import the Bar component
import explosionGif from './assets/explode.gif'
import Shop from './components/Shop';

function App(): React.JSX.Element {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [happiness, setHappiness] = useState(80); // Initial happiness value (0-100)
  const [xp, setXp] = useState(0); // Initial XP value (0-100)
  const [popUp, setPopUp] = useState({
    header: 'Instructions',
    message: 'Your Tamagotchi loves cleanliness! Place trash in the right bins to earn points.'
  });
  const [exploded, setExploded] = useState(false);
  const [skin, setSkin] = useState(tamagotchiImage);
  const [showShop, setShowShop] = useState(false);

  const handleSkinSelect = (selectedSkin: string): void => {
    setSkin(selectedSkin); // Update the Tamagotchi skin
    setShowShop(false); // Close the shop after selecting a skin
  };

  const clearPopUp = (): void => setPopUp({ header: '', message: '' });

  useEffect(() => {
    if (happiness <= 0) explode();
    if (level >= 10) {
      const chance = Math.random(); // Generate a random number between 0 and 1
      if (chance < 0.1) { // 10% chance for the Tamagotchi to explode
        explode();
      }
    }
  }, [level, happiness]);

  const explode = (): void => {
    clearPopUp();
    setExploded(true);
    setTimeout(() => {
      setExploded(false);
      setPopUp({
        header: 'Oh no!',
        message: 'Your Tamagotchi exploded! All stats have been reset.'
      });
      setPoints(0);
      setLevel(1);
      setHappiness(80);
      setXp(0);
    }, 1500); // Set duration of explosion (e.g., 2 seconds)
  };

  // Function to simulate increasing points (e.g., when trash is placed correctly)
  const incrementPoints = (incrementBy: number): void => {
    const newPoints = points + incrementBy;
    const newXp = xp + incrementBy;
    if (newXp >= 100) {
      setLevel(level + 1);
      setXp(newXp - 100); // Carry over excess points to the next level
    } else {
      setXp(newXp);
    }
    setPoints(newPoints)
  };

  const gamble = (): void => {
    const randomValue = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100
    const randomMod = Math.floor(Math.random() * 11);
    if (randomValue >= 50) {
      incrementPoints(randomValue);
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and got ${randomValue + randomMod} XP!`
      });
    } else {
      setHappiness((prev) => Math.max(0, prev - randomMod)); // Decrease happiness if the roll is low
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and lost! Your tamagotchi is upset :(`
      });
    }
  }

  return (
    <div className="mt-4 app-container text-center mx-auto justify-center flex flex-col relative">
      <div className="header">
        <h1 className="text-4xl">Welcome to GarboGotchi!</h1>
        <p>Help your Tamagotchi grow by sorting trash correctly!</p>
      </div>
      <div className="flex mx-auto gap-10">
        <p>Level: {level}</p>
        <p>Points: {points}</p>
      </div>
      <div className="tamagotchi-section flex">
        <div className="flex gap-8 left-[-32px] absolute mt-12">
          <div className="flex flex-col">
            <Bar label="Happiness" progress={happiness} />
            <Laugh className="mt-2" />
          </div>
          <div>
            <Bar label="XP" progress={xp} />
            <Trash2 className="mt-2" />
          </div>
        </div>
        <img 
          src={skin} // Dynamically change the skin based on user selection
          alt="Tamagotchi"
          className="mx-auto transition pb-4"
          style={{ transform: `scale(${0.5 + level * 0.05})` }}
          draggable="false"
        />
        {exploded && (
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <img
              src={explosionGif}
              alt="Explosion"
              className="w-48 h-48 animate-pulse"
              style={{ transform: `scale(${1.5 + level * 0.05})` }}
            />
          </div>
        )}
      </div>

      {popUp.header && popUp.message && (
        <PopUp header={popUp.header} message={popUp.message} onClose={clearPopUp} />
      )}

      <div>
        <div className="flex flex-row justify-evenly mb-4">
          <InteractButton Icon={Heart} onClick={() => incrementPoints(10)} />
          <InteractButton Icon={Dices} onClick={gamble}/>
          <InteractButton Icon={Shirt} onClick={() => setShowShop(true)} />
          <InteractButton Icon={Bomb} onClick={explode}/>
        </div>
      </div>

      <footer className="footer">
        <p>GarboGotchi</p>
      </footer>
      {showShop && <Shop onClose={() => setShowShop(false)} onSelectSkin={handleSkinSelect} />}
    </div>
  );
}

export default App;
