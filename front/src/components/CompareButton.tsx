"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const movingMap = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255,255,255,0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255,255,255,0) 100%)",
  BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255,255,255,0) 100%)",
  RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255,255,255,0) 100%)",
};

const highlight =
  "radial-gradient(80% 181% at 50% 50%, #ff3d00 0%, rgba(255,255,255,0) 100%)";

export function CompareButton() {

  
const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<"TOP" | "LEFT" | "BOTTOM" | "RIGHT">("TOP");

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => {
          const dirs = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
          const idx = dirs.indexOf(prev);
          return dirs[(idx + 1) % dirs.length] as typeof direction;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  const handleClick = () => {
    navigate("/compare");
  };

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] mt-10"
      onClick={handleClick}
    >
      <motion.span
        className="absolute inset-0 z-0 rounded-full blur-sm"
        style={{ filter: "blur(2px)" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ duration: 1, ease: "linear" }}
      />
      <span className="text-[#dbdbdb] hover:text-orange-600 transition-colors ease-in duration-700 relative z-10 inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-6 py-1 text-sm backdrop-blur-3xl">
        Compare.
      </span>
    </button>
  );
}
