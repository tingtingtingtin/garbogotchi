import ModelVideo from './components/ModelVideo';
import ErrorBoundary from './components/ErrorBoundary';
import { useState, useEffect } from 'react';
import tamagotchiImage from './assets/skins/bear.png';
import PopUp from './components/PopUp';
import InteractButton from './components/InteractButton';
import { Heart, Dices, Laugh, Trash2, Bomb, Shirt, List } from 'lucide-react';
import Bar from './components/Bar';
import explosionGif from './assets/explode.gif'
import Shop from './components/Shop';
import ThoughtBubble from './components/ThoughtBubble';
import History from './components/History';

function App(): React.JSX.Element {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [happiness, setHappiness] = useState(80);
  const [xp, setXp] = useState(0);
  const [popUp, setPopUp] = useState({
    header: 'Instructions',
    message: 'Your Tamagotchi loves cleanliness! Place trash in the right bins to earn points.'
  });
  const [exploded, setExploded] = useState(false);
  const [skin, setSkin] = useState(tamagotchiImage);
  const [showShop, setShowShop] = useState(false);
  const [prediction, setPrediction] = useState<number>(3);

  const [showHistory, setShowHistory] = useState(false);
  const [pastTamagotchis, setPastTamagotchis] = useState<{ level: number; xp: number }[]>([]);

  // Load past data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("pastTamagotchis");
    if (storedData) {
      setPastTamagotchis(JSON.parse(storedData)); // Load past Tamagotchis if they exist
    }

    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSkinSelect = (selectedSkin: string): void => {
    setSkin(selectedSkin);
    setShowShop(false);
  };

  const handlePrediction = (newPrediction: number) => {
    // Increase points when the prediction changes
    if (newPrediction !== prediction) {
      setPrediction(newPrediction);
      const randomValue = Math.floor(Math.random() * 101);
      incrementPoints(randomValue)
    }
  };

  const clearPopUp = (): void => {
    setPopUp({ header: "", message: "" }); // Clear the popup message and header
    if (exploded) {
      resetStats(); // Reset stats only if the Tamagotchi exploded
      setExploded(false); // Set exploded to false after resetting stats
    }
  };

  const resetStats = (): void => {
    const newTamagotchi = { level, xp };
    const updatedHistory = [...pastTamagotchis, newTamagotchi]; // Add current Tamagotchi to history
    setPastTamagotchis(updatedHistory);
    setPoints(0);
    setLevel(1);
    setHappiness(80);
    setXp(0);
  };

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
      setPopUp({
      header: "Oh no!",
      message: "Your Tamagotchi exploded! All stats have been reset."
      });
    }, 2000); // Delay for 3 seconds
  };

  // Function to simulate increasing points (e.g., when trash is placed correctly)
  const incrementPoints = (incrementBy: number): void => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints + incrementBy;
      return newPoints;
    });
    setXp((prevXp) => {
      const newXp = prevXp + incrementBy;
      if (newXp >= 100) {
        setLevel((prevLevel) => prevLevel + 1); // Increase level if XP exceeds 100
        return newXp - 100; // Carry over excess points to the next level
      }
      return newXp;
    });
  };

  const gamble = (): void => {
    const randomValue = Math.floor(Math.random() * 51 + 50); // Generate a random number between 0 and 100
    const randomMod = Math.floor(Math.random() * 11);
    if (randomValue >= 50) {
      incrementPoints(randomValue);
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and got ${randomValue + randomMod} XP!`
      });
    } else {
      setHappiness((prev) => Math.max(0, prev - 10 - randomMod)); // Decrease happiness if the roll is low
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and lost! Your tamagotchi is upset :(`
      });
    }
  }

  return (
    <div className="h-screen my-auto app-container text-center mx-auto justify-center flex flex-col relative">
      <div className="header">
        <h1 className="text-4xl">Welcome to GarboGotchi!</h1>
        <p>Help your Tamagotchi grow by sorting trash correctly!</p>
      </div>
      <div className="flex mx-auto gap-10">
        <p>Level: {level}</p>
        <p>Points: {points}</p>
      </div>
      <div className="tamagotchi-section flex">
        <div className="flex gap-8 left-[2px] absolute mt-6">
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
          className="mx-auto transition pb-4 h-96 w-full object-contain"
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
        <div className="flex gap-8 right-[2px] absolute mt-6">
          {prediction < 3 && !exploded && <ThoughtBubble prediction={prediction} />}
        </div>
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
          <InteractButton Icon={List} onClick={() => setShowHistory(!showHistory)} />
        </div>
      </div>
      <ErrorBoundary>
        <ModelVideo onPrediction={handlePrediction}/>
      </ErrorBoundary>

      <footer className="footer">
        <p>GarboGotchi</p>
      </footer>
      {showShop && <Shop onClose={() => setShowShop(false)} onSelectSkin={handleSkinSelect} />}

      {showHistory && (
        <History onClose={() => setShowHistory(false)} pastTamagotchis={pastTamagotchis} />
      )}
    </div>
  );
}

export default App;
