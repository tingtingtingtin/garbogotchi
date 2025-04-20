import React from 'react'

type HistoryProps = {
  onClose: () => void
  pastTamagotchis: { level: number; points: number }[]
}

const History = ({ onClose, pastTamagotchis }: HistoryProps): React.JSX.Element => {
  const topTamagotchi = pastTamagotchis.reduce(
    (top, current) => {
      return current.points > top.points ? current : top
    },
    { level: 0, points: 0 }
  )

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="pixel-border flex flex-col items-center justify-between bg-white p-8 w-4/5 h-4/5 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Top Tamagotchis</h2>

        {pastTamagotchis.length > 0 ? (
          <div className="w-full overflow-y-auto">
            {/* Top Score Display */}
            <div className="bg-yellow-200 p-4 mb-6 w-full rounded-lg text-center">
              <h3 className="text-2xl font-bold">Top Score</h3>
              <p className="text-xl">Level: {topTamagotchi.level}</p>
              <p className="text-xl">Points: {topTamagotchi.points}</p>
            </div>

            {/* List of Past Tamagotchis */}
            <div className="space-y-4 w-full">
              {pastTamagotchis.map((tamagotchi, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-lg">Level: {tamagotchi.level}</p>
                    <p className="text-lg">Points: {tamagotchi.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">No Tamagotchis to display.</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="pixel-border mt-6 w-1/3 py-2 text-black rounded-lg hover:scale-105 transition"
        >
          Close History
        </button>
      </div>
    </div>
  )
}

export default History
