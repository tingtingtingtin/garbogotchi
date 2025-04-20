import ModelVideo from './components/ModelVideo'
import ErrorBoundary from './components/ErrorBoundary'
import { useState, useEffect, useRef } from 'react'
import tamagotchiImage from './assets/skins/bear.png'
import PopUp from './components/PopUp'
import InteractButton from './components/InteractButton'
import { Heart, Dices, Laugh, Trash2, Bomb, Shirt, List, Volume2, VolumeOff } from 'lucide-react'
import Bar from './components/Bar'
import explosionGif from './assets/explode.gif'
import Shop from './components/Shop'
import ThoughtBubble from './components/ThoughtBubble'
import History from './components/History'
import lebronSkin from './assets/skins/lebron.png'
import cuteMusic from './assets/audio/cute.mp3'
import goatMusic from './assets/audio/sunshine.mp3'
import popSfx from './assets/audio/pop.mp3'
import levelSfx from './assets/audio/levelup.mp3'
import lebronSfx from './assets/audio/lebron.mp3'


function App(): React.JSX.Element {
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [happiness, setHappiness] = useState(80)
  const [xp, setXp] = useState(0)
  const [hovering, setHovering] = useState('Menu')
  const [popUp, setPopUp] = useState({
    header: 'Instructions',
    message: 'Your Tamagotchi loves cleanliness! Place trash in the right bins to earn points.'
  })
  const [exploded, setExploded] = useState(false)
  const [skin, setSkin] = useState(tamagotchiImage)
  const [showShop, setShowShop] = useState(false)
  const [prediction, setPrediction] = useState<number>(3)
  const [muted, setMuted] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [pastTamagotchis, setPastTamagotchis] = useState<{ level: number; points: number }[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(skin === lebronSkin ? goatMusic : cuteMusic)
      audioRef.current.loop = true
    } else {
      audioRef.current.src = skin === lebronSkin ? goatMusic : cuteMusic
    }

    if (muted || document.hidden) {
      audioRef.current.pause()
    } else {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch((err) => console.error('Audio playback error:', err)) // Play the audio
    }

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        audioRef.current?.pause()
      } else if (!muted) {
        audioRef.current?.play().catch((err) => console.error('Audio playback error:', err))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      audioRef.current?.pause() // Cleanup: pause the audio when the component unmounts
    }
  }, [muted, skin])

  useEffect(() => {
    const storedData = localStorage.getItem('pastTamagotchis')
    if (storedData) {
      setPastTamagotchis(JSON.parse(storedData))
    }

    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSkinSelect = (selectedSkin: string): void => {
    setSkin(selectedSkin)
    setShowShop(false)
  }

  const handlePrediction = (newPrediction: number): void => {
    // Increase points when the prediction changes
    if (newPrediction !== prediction) {
      setPrediction(newPrediction)
      const randomValue = Math.floor(Math.random() * 71 + 20)
      incrementPoints(randomValue)
    }
  }

  const clearPopUp = (): void => {
    setPopUp({ header: '', message: '' })
    if (exploded) {
      resetStats()
      setExploded(false)
    }
  }

  const resetStats = (): void => {
    const newTamagotchi = { level, points }
    const updatedHistory = [...pastTamagotchis, newTamagotchi]
    setPastTamagotchis(updatedHistory)
    setPoints(0)
    setLevel(1)
    setHappiness(80)
    setXp(0)
  }

  useEffect(() => {
    if (happiness <= 0) explode()
    if (level >= 10) {
      const chance = Math.random()
      if (chance < 0.1) {
        explode()
      }
    }
  }, [level, happiness])

  const explode = (): void => {
    if (!muted) {
      const popAudio = new Audio(popSfx)
      popAudio.play().catch((err) => console.error('Pop audio failed: ', err))
    }
    clearPopUp()
    setExploded(true)
    setTimeout(() => {
      setPopUp({
        header: 'Oh no!',
        message: 'Your Tamagotchi exploded! All stats have been reset.'
      })
    }, 2000)
  }

  const incrementPoints = (incrementBy: number): void => {
    if (!exploded) {
      setPoints((prevPoints) => prevPoints + incrementBy)
      setXp((prevXp) => prevXp + incrementBy)
    }
  }

  useEffect(() => {
    if (xp >= 100) {
      if (!muted) {
        const levelUpAudio = new Audio(levelSfx)
        levelUpAudio.play().catch((err) => console.error('Level up audio failed: ', err))
      }
      setLevel((prevLevel) => prevLevel + 1)
      setXp((prevXp) => prevXp - 100)
      setHappiness((prevHappiness) => prevHappiness + 5)
    }
  }, [xp])

  const gamble = (): void => {
    const randomValue = Math.floor(Math.random() * 101) // Generate a random number between 0 and 100
    const randomMod = Math.floor(Math.random() * 11)
    if (randomValue >= 50) {
      incrementPoints(randomValue)
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and got ${randomValue + randomMod} XP!`
      })
    } else {
      setHappiness((prev) => Math.max(0, prev - 10 - randomMod)) // Decrease happiness if the roll is low
      setPopUp({
        header: `You rolled a ${randomValue}`,
        message: `You gambled and lost! Your tamagotchi is upset :(`
      })
    }
  }

  return (
    <div className="h-screen my-auto app-container text-center mx-auto justify-center flex flex-col relative">
      <div className="header">
        <h1 className="text-4xl">Welcome to GarboGotchi!</h1>
        <p>Help your Tamagotchi grow by sorting trash correctly!</p>
      </div>
      <div className="flex mx-auto gap-10 text-xl">
        <p>Level {level}</p>
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
          <InteractButton
            hover={setHovering}
            label="Give Love"
            Icon={Heart}
            onClick={() => setHappiness((prevHappiness) => prevHappiness + 5)}
          />
          <InteractButton hover={setHovering} label="Gamble" Icon={Dices} onClick={gamble} />
          <InteractButton
            hover={setHovering}
            label="Shop"
            Icon={Shirt}
            onClick={() => setShowShop(true)}
          />
          <InteractButton hover={setHovering} label="Blow Up" Icon={Bomb} onClick={explode} />
          <InteractButton
            hover={setHovering}
            label="History"
            Icon={List}
            onClick={() => setShowHistory(!showHistory)}
          />
          <InteractButton
            hover={setHovering}
            label={muted ? 'Unmute' : 'Mute'}
            Icon={muted ? VolumeOff : Volume2}
            onClick={() => setMuted(!muted)}
          />
        </div>
      </div>
      <ErrorBoundary>
        <ModelVideo onPrediction={handlePrediction} />
      </ErrorBoundary>

      <p>{hovering}</p>
      {showShop && <Shop onClose={() => setShowShop(false)} onSelectSkin={handleSkinSelect} />}

      {showHistory && (
        <History onClose={() => setShowHistory(false)} pastTamagotchis={pastTamagotchis} />
      )}
    </div>
  )
}

export default App
