import classicSkin from '../assets/skins/lebron.png'
import catSkin from '../assets/skins/cat.png'
import bearSkin from '../assets/skins/bear.png'

type ShopProps = {
  onClose: () => void
  onSelectSkin: (skin: string) => void
}

const skins = [
  { id: 'bear', name: 'Bear Tama', image: bearSkin },
  { id: 'cat', name: 'Cat Tama', image: catSkin },
  { id: 'goat', name: 'GOAT Tama', image: classicSkin }
]

const Shop = ({ onClose, onSelectSkin }: ShopProps): React.JSX.Element => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="pixel-border bg-white flex flex-col items-center justify-around p-8 w-4/5 h-4/5 rounded-lg overflow-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Choose Your Tamagotchi Skin</h2>
        <div className="w-full flex flex-row justify-evenly">
          {skins.map((skin) => (
            <div
              key={skin.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onSelectSkin(skin.image)}
            >
              <img src={skin.image} alt={skin.name} className="w-36 h-36 object-contain" />
              <p className="text-xl">{skin.name}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="pixel-border mt-6 w-1/3 py-2 text-black rounded-lg hover:scale-105 transition"
        >
          Close Shop
        </button>
      </div>
    </div>
  )
}

export default Shop
