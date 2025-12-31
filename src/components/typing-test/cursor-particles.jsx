"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useImperativeHandle, forwardRef, useEffect } from "react";

// Particle Component
const Particle = ({ x, y, color }) => {
  const randomX = (Math.random() - 0.5) * 60; // Random spread X
  const randomY = (Math.random() - 0.5) * 60; // Random spread Y

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: randomX, y: randomY, opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
      style={{ left: x, top: y, backgroundColor: color }}
    />
  );
};

export const CursorParticles = forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);

  // Allow parent to trigger a burst
  useImperativeHandle(ref, () => ({
    burst: (x, y, color = "#facc15") => {
      const id = Date.now();
      const newParticles = Array.from({ length: 5 }).map((_, i) => ({
        id: id + i,
        x,
        y,
        color,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      // Cleanup after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id < id));
      }, 600);
    },
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
        ))}
      </AnimatePresence>
    </div>
  );
});

CursorParticles.displayName = "CursorParticles";