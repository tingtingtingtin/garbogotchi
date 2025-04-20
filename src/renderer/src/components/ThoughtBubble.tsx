import React from "react";
import { Trash2, Recycle, Leaf } from "lucide-react"; // Icons for Trash, Recycle, and Compost
import thoughtBubble from "../assets/thought.png"

type ThoughtBubbleProps = {
  prediction: string;
};

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ prediction }) => {
  // Determine the icon based on the prediction
  let Icon;
  switch (prediction) {
    case "Trash":
      Icon = Trash2;
      break;
    case "Recycleable":
      Icon = Recycle;
      break;
    case "Compost":
      Icon = Leaf;
      break;
    default:
      Icon = null;
  }

  return (
    <div className="">
      <img src={thoughtBubble} alt="Thought Bubble" className="w-52 object-contain" />
      {Icon && (
         <div
         className="transition absolute top-[40px] left-[50%] transform -translate-x-[50%]"
         style={{
           zIndex: 10,
         }}
       >
         <Icon className="w-12 h-12" />
       </div>
      )}
    </div>
  );
};

export default ThoughtBubble;
