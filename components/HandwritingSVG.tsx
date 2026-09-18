"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface HandwritingSVGProps {
  trigger?: boolean;
  className?: string;
}

export default function HandwritingSVG({ trigger = true, className = "" }: HandwritingSVGProps) {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!ref.current) return;
    const length = ref.current.getTotalLength();
    ref.current.style.strokeDasharray = `${length}`;
    ref.current.style.strokeDashoffset = `${length}`;
  }, []);

  const shouldAnimate = trigger && isInView;

  return (
    <div ref={containerRef} className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-20 opacity-80"
        aria-hidden="true"
      >
        {/* Heart path + flourish signature stroke */}
        <motion.path
          ref={ref}
          d="M100 90 C60 60, 20 40, 30 20 C40 5, 60 5, 75 20 C85 30, 100 45, 100 45 C100 45, 115 30, 125 20 C140 5, 160 5, 170 20 C180 40, 140 60, 100 90 Z"
          stroke="var(--station-primary, #FF1685)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Underline flourish */}
        <motion.path
          d="M60 105 Q100 112 140 105"
          stroke="rgba(247,245,239,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 1.9 }}
        />
      </svg>
    </div>
  );
}
