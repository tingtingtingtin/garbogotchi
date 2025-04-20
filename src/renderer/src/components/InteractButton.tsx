import { LucideIcon } from 'lucide-react'

const InteractButton = ({
  hover,
  label,
  Icon,
  onClick
}: {
  hover: (label: string) => void
  label: string
  Icon: LucideIcon
  onClick: () => void
}) => {
  return (
    <button
      className="pixel-border w-16 h-16 bg-white hover:scale-105 transition"
      onClick={onClick}
      onMouseEnter={() => hover(label)}
      onMouseLeave={() => hover('Menu')}
    >
      <Icon className="mx-auto" />
    </button>
  )
}

export default InteractButton
