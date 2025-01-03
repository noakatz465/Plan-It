"use client";

import Link from "next/link";
import { useState } from "react";

const AnimatedLink = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/pages/main/tasks/templates">
      <div
        className={`bg-cover bg-center rounded-full transition-transform duration-300 ease-in-out ${
          isHovered ? "shadow-[0_0_10px_5px_rgba(255,105,180,0.8)]" : "shadow-xl"
        }`}
        style={{
          backgroundImage: `url("/animations/your-animation.gif")`,
          backgroundPosition: isHovered ? "0 0" : "0 -1px", // הסטה קטנה כדי לדמות "קיפאון"
          height: "35px",
          width: "35px",
          cursor: "pointer",
          transform: isHovered ? "scale(1.2)" : "scale(1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      ></div>
    </Link>
  );
};

export default AnimatedLink;
