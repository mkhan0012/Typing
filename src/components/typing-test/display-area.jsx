"use client";
import React from "react";
import { motion } from "framer-motion";

function Caret({ style }) {
    const layoutId = "caret"; 
    if (style === "block") {
        return <motion.div layoutId={layoutId} className="absolute inset-0 bg-primary/30 z-0 animate-pulse" transition={{ duration: 0.1 }} />;
    }
    if (style === "underline") {
        return <motion.div layoutId={layoutId} className="absolute bottom-0 left-0 w-full h-1 bg-primary z-20" transition={{ duration: 0.1 }} />;
    }
    if (style === "pacman") {
        return (
            <motion.div layoutId={layoutId} className="absolute -left-3 -top-1 z-20 text-yellow-500 text-sm" transition={{ duration: 0.1 }}>
                 <span className="animate-bounce inline-block">C</span>
            </motion.div>
        );
    }
    return (
        <motion.div layoutId={layoutId} className="absolute -inset-y-1 -left-0.5 w-[2px] bg-primary animate-pulse z-20" transition={{ duration: 0.1 }} />
    );
}

export const DisplayArea = React.memo(({ text, input, isFocused, font, caretStyle }) => {
  const fontClasses = {
    "mono": "font-mono",
    "sans": "font-sans",
    "serif": "font-serif",
  };

  return (
    <div 
      className={`relative text-2xl leading-loose tracking-wide min-h-[140px] select-none break-words whitespace-pre-wrap ${fontClasses[font] || "font-mono"}`}
      style={{ wordSpacing: "0.5em" }}
    >
      {text.split("").map((char, index) => {
        const isTyped = index < input.length;
        const isCorrect = isTyped && input[index] === char;
        const isCurrent = index === input.length;

        return (
          <span key={index} className="relative inline-block">
            {isCurrent && isFocused && <Caret style={caretStyle} />}
            <span
              className={`relative z-10 ${
                !isTyped
                  ? "text-muted-foreground/40"
                  : isCorrect
                  ? "text-foreground"
                  : "text-red-500 bg-red-100 dark:bg-red-900/40"
              }`}
            >
              {char}
            </span>
          </span>
        );
      })}
    </div>
  );
});

DisplayArea.displayName = "DisplayArea";