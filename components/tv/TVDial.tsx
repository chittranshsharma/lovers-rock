"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { stations, Station, getStationIndex } from "@/lib/stations";

interface TVDialProps {
  station: Station;
  onStationChange: (station: Station) => void;
  onSignalLoss?: () => void;
  className?: string;
}

/**
 * TV Dial Tuner with single source of truth:
 * activeStation strictly governs frequency display, station title, and dial position.
 */
export default function TVDial({
  station,
  onStationChange,
  onSignalLoss,
  className = "",
}: TVDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const lastChangedRef = useRef(0);
  const rapidChangeCountRef = useRef(0);
  const rapidTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stationIndex = getStationIndex(station);
  // displayFreq tracks intermediate scrubbing frequency during drag, but is strictly bound to station.frequency otherwise
  const [displayFreq, setDisplayFreq] = useState(station.frequency);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Spring for the needle knob position
  const knobX = useMotionValue(0);
  const smoothKnobX = useSpring(knobX, { stiffness: 160, damping: 20, mass: 0.3 });

  // Map station index to a normalized dial position 0–1
  const indexToPos = (i: number) => i / (stations.length - 1);

  // Derive knob pixel offset from station index
  const getKnobOffset = useCallback((idx: number) => {
    const trackWidth = dialRef.current ? dialRef.current.clientWidth - 20 : 180;
    return indexToPos(idx) * trackWidth;
  }, []);

  // Strict synchronization: Whenever station prop changes, align displayFreq and knob position
  useEffect(() => {
    if (!isDraggingRef.current) {
      setDisplayFreq(station.frequency);
      knobX.set(getKnobOffset(stationIndex));
    }
  }, [station, stationIndex, getKnobOffset, knobX]);

  // Handle window resize for track width
  useEffect(() => {
    const handleResize = () => {
      knobX.set(getKnobOffset(stationIndex));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stationIndex, getKnobOffset, knobX]);

  const triggerStationChange = useCallback(
    (newIdx: number) => {
      const targetIdx = Math.max(0, Math.min(stations.length - 1, newIdx));
      const targetStation = stations[targetIdx];

      // Track rapid changes for signal-loss trigger
      rapidChangeCountRef.current++;
      if (rapidTimerRef.current) clearTimeout(rapidTimerRef.current);
      rapidTimerRef.current = setTimeout(() => {
        rapidChangeCountRef.current = 0;
      }, 1000);

      if (rapidChangeCountRef.current >= 3 && onSignalLoss) {
        onSignalLoss();
      }

      setIsTransitioning(true);
      setDisplayFreq(targetStation.frequency);
      onStationChange(targetStation);
      knobX.set(getKnobOffset(targetIdx));

      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    },
    [onStationChange, onSignalLoss, getKnobOffset, knobX]
  );

  // Mouse/touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startIndexRef.current = stationIndex;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dialRef.current) return;
    const trackWidth = dialRef.current.clientWidth - 20;
    const dx = e.clientX - startXRef.current;
    const dIndex = Math.round((dx / trackWidth) * (stations.length - 1));
    const newIdx = Math.max(0, Math.min(stations.length - 1, startIndexRef.current + dIndex));

    // Update knob visually during drag
    const newPos = Math.max(0, Math.min(trackWidth, indexToPos(newIdx) * trackWidth));
    knobX.set(newPos);

    // Dynamic intermediate frequency
    const from = parseFloat(stations[startIndexRef.current].frequency);
    const to = parseFloat(stations[newIdx].frequency);
    const fraction = Math.abs(dIndex) / Math.max(1, stations.length - 1);
    setDisplayFreq((from + (to - from) * fraction).toFixed(1));

    if (newIdx !== stationIndex && Date.now() - lastChangedRef.current > 150) {
      lastChangedRef.current = Date.now();
      triggerStationChange(newIdx);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    // Snap cleanly to station frequency
    setDisplayFreq(station.frequency);
    knobX.set(getKnobOffset(stationIndex));
  };

  // Mouse wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(stations.length - 1, stationIndex + dir));
      triggerStationChange(newIdx);
    },
    [stationIndex, triggerStationChange]
  );

  useEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Keyboard arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        triggerStationChange(Math.min(stations.length - 1, stationIndex + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        triggerStationChange(Math.max(0, stationIndex - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stationIndex, triggerStationChange]);

  return (
    <div
      className={`w-full select-none ${className}`}
      aria-label="Analog FM Tuner Unit"
      role="group"
    >
      {/* Top Station Status Banner */}
      <div className="bg-[#121215] border border-[rgba(247,245,239,0.14)] p-4 relative overflow-hidden rounded-[2px]">
        <div className="tv-scanlines opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase mb-1">
          <span>FM RECEIVER UNIT</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTransitioning ? "bg-amber-400 animate-ping" : "animate-pulse"
              }`}
              style={{ backgroundColor: station.primary }}
            />
            <span>{isTransitioning ? "SEARCHING..." : "LOCKED"}</span>
          </span>
        </div>

        {/* Large Frequency Readout */}
        <div className="flex items-baseline gap-2 my-1">
          <div
            className="font-display font-black text-4xl sm:text-5xl tracking-tight transition-colors duration-300"
            style={{ color: station.primary }}
          >
            {station.frequency}
          </div>
          <span className="text-xs font-mono text-[#AFA797]">MHz</span>
        </div>

        {/* Station Title */}
        <div
          className="text-xs font-mono uppercase tracking-widest transition-colors duration-300 font-bold"
          style={{ color: station.primary }}
        >
          {station.title}
        </div>
      </div>

      {/* Drag track */}
      <div
        ref={dialRef}
        className="relative h-9 flex items-center px-2.5 bg-[#0e0e11] border border-[rgba(247,245,239,0.12)] mt-2 cursor-ew-resize rounded-[2px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={stations.length - 1}
        aria-valuenow={stationIndex}
        aria-valuetext={`${station.title} FM ${station.frequency}`}
        tabIndex={0}
      >
        {/* Track center line */}
        <div
          className="absolute left-2.5 right-2.5 h-[1px] bg-white/15"
          style={{ top: "50%" }}
          aria-hidden="true"
        />

        {/* Station tick marks */}
        {stations.map((s, i) => {
          const trackFraction = indexToPos(i);
          const isActive = i === stationIndex;
          return (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                triggerStationChange(i);
              }}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3.5 transition-all cursor-pointer z-10"
              style={{
                left: `calc(10px + ${trackFraction} * (100% - 20px) - 3px)`,
                backgroundColor: isActive ? station.primary : "rgba(247,245,239,0.25)",
                boxShadow: isActive ? `0 0 8px ${station.primary}` : "none",
              }}
              aria-label={`${s.title} — FM ${s.frequency}`}
              title={`${s.title} — FM ${s.frequency}`}
            />
          );
        })}

        {/* Draggable needle ring */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center z-20 pointer-events-none"
          style={{
            x: smoothKnobX,
            left: 0,
            borderColor: station.primary,
            backgroundColor: "#09090B",
            boxShadow: `0 0 10px ${station.primary}80`,
          }}
          aria-hidden="true"
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: station.primary }}
          />
        </motion.div>
      </div>

      {/* Station frequency numeric markers below dial */}
      <div className="flex justify-between mt-1.5 px-1">
        {stations.map((s, i) => {
          const isActive = i === stationIndex;
          return (
            <button
              key={s.id}
              onClick={() => triggerStationChange(i)}
              className="font-mono text-[9px] uppercase tracking-wider transition-colors duration-200 cursor-pointer"
              style={{
                color: isActive ? station.primary : "#AFA797",
                opacity: isActive ? 1 : 0.6,
                fontWeight: isActive ? "700" : "400",
              }}
              aria-label={`Tune to FM ${s.frequency}`}
            >
              {s.frequency}
            </button>
          );
        })}
      </div>
    </div>
  );
}
