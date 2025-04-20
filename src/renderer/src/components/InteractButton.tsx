import React from 'react'
import { LucideIcon } from "lucide-react";

const InteractButton = ({ Icon, onClick }: { Icon: LucideIcon, onClick: () => void }) => {
  return (
    <button 
      className="pixel-border w-16 h-16 bg-white hover:scale-105 transition" 
      onClick={onClick}
    >
      <Icon className='mx-auto' />
    </button>
  );
};

export default InteractButton