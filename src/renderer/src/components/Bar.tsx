type BarProps = {
  progress: number
  label: string
}

const Bar = ({ progress }: BarProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-5 h-72 bg-white pixel-border relative overflow-hidden">
        <div
          className="w-full absolute bottom-0 bg-black transition-all duration-300"
          style={{ height: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default Bar
