"use client";

import React, { useState, useRef } from "react";
import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommandPalette } from "@/components/command-palette";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { CursorParticles } from "@/components/typing-test/cursor-particles";
import { DisplayArea } from "@/components/typing-test/display-area";
import { VirtualKeyboard } from "@/components/typing-test/virtual-keyboard";
import { StatsChart } from "@/components/typing-test/stats-chart";
import { HistoryList } from "@/components/typing-test/history-list";
import { ResultSummary } from "@/components/typing-test/result-summary";
import { useTypingGame } from "@/components/typing-test/typing-hooks";

// --- PERFORMANCE: MEMOIZE HEAVY COMPONENTS ---
const MemoizedNavbar = React.memo(Navbar);
const MemoizedStatsChart = React.memo(StatsChart);
const MemoizedVirtualKeyboard = React.memo(VirtualKeyboard);

export default function TypingPage() {
  // --- UI STATE ---
  const [openCmd, setOpenCmd] = useState(false);
  const particleRef = useRef(null);
  const [shakeKey, setShakeKey] = useState(0);

  // --- CONFIG STATE ---
  const [config, setConfig] = useState({
    duration: 30,
    difficulty: "easy",
    sound: "none",
    font: "mono",
    caret: "line"
  });

  // --- GAME HOOK ---
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const { 
    text, timeLeft, isActive, isFinished, input, stats, wpmHistory, keyStats, 
    resetGame, handleInput, streak, maxStreak, history 
  } = useTypingGame(config.duration, config.difficulty, config.sound);

  // --- HANDLERS ---
  const handleClick = () => { inputRef.current?.focus(); setIsFocused(true); };

  const onType = (e) => {
    const val = e.target.value;
    const oldLen = input.length;
    
    // Check if a character was added (ignore backspace for effects)
    if (val.length > oldLen) {
       const char = val.slice(-1);
       const target = text[oldLen];
       const isCorrect = char === target;
       
       // 1. Trigger Particle Burst
       if (particleRef.current) {
          const rect = document.getElementById("typing-card")?.getBoundingClientRect();
          if (rect) {
             // Randomize position slightly for organic feel
             particleRef.current.burst(
                Math.random() * (rect.width * 0.6) + (rect.width * 0.2), 
                Math.random() * (rect.height * 0.4) + (rect.height * 0.3),
                isCorrect ? "#22c55e" : "#ef4444"
             );
          }
       }
       // 2. Trigger Shake on Error
       if (!isCorrect) setShakeKey(prev => prev + 1);
    }
    
    handleInput(val);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300 ${config.font === 'sans' ? 'font-sans' : 'font-mono'}`}>
      
      {/* 1. HIDDEN INPUT & TOOLS */}
      <CommandPalette open={openCmd} setOpen={setOpenCmd} config={config} setConfig={setConfig} />

      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-0 w-0 pointer-events-none"
        value={input}
        onChange={onType} 
        onBlur={() => setIsFocused(false)}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      <MemoizedNavbar onOpenCmd={() => setOpenCmd(true)} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="w-full max-w-4xl mx-auto space-y-8 px-4 pt-12 flex-1 flex flex-col">
        
        {/* A. CONTROLS BAR */}
        <div className="flex flex-wrap justify-between gap-4 bg-muted/30 p-2 rounded-lg border backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground ml-2" />
                
                {/* Difficulty Selector */}
                <Select value={config.difficulty} onValueChange={(val) => setConfig(p => ({...p, difficulty: val}))}>
                  <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="smart">Smart Drill 🔥</SelectItem>
                    <SelectItem value="quote">Quotes 📜</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sound Selector */}
                <Select value={config.sound} onValueChange={(val) => setConfig(p => ({...p, sound: val}))}>
                  <SelectTrigger className="w-[130px] border-none bg-transparent shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Silent</SelectItem>
                    <SelectItem value="click">Clicky</SelectItem>
                    <SelectItem value="osu">Rhythm</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Time Selector */}
            <div className="flex items-center gap-2">
               <Select value={String(config.duration)} onValueChange={(val) => setConfig(p => ({...p, duration: Number(val)}))}>
                  <SelectTrigger className="w-[100px] border-none bg-transparent shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">60s</SelectItem>
                  </SelectContent>
               </Select>
            </div>
        </div>

        {/* B. LIVE STATS HUD (Hidden when finished) */}
        {!isFinished && (
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-card border shadow-sm transition-all hover:shadow-md">
                    <div className="text-4xl font-bold text-primary">{timeLeft}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Time</div>
                </div>
                <div className="p-4 rounded-xl bg-card border shadow-sm transition-all hover:shadow-md">
                    <div className="text-4xl font-bold">{stats.wpm}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">WPM</div>
                </div>
                <div className="p-4 rounded-xl bg-card border shadow-sm transition-all hover:shadow-md">
                    <div className="text-4xl font-bold">{stats.accuracy}%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Acc</div>
                </div>
            </div>
        )}

        {/* C. GAME AREA (Typing Card OR Summary) */}
        <div className="relative">
             
             {/* Floating Combo Counter */}
             <AnimatePresence>
                {!isFinished && streak > 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0, rotate: 10 }}
                    key={streak} 
                    className="absolute -top-16 right-0 z-30 pointer-events-none select-none will-change-transform"
                  >
                     <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-sm">
                        {streak}x
                     </div>
                     <div className="text-sm font-bold text-muted-foreground text-right uppercase tracking-[0.2em]">Combo</div>
                  </motion.div>
                )}
             </AnimatePresence>

            {/* Shake Container */}
            <motion.div
                key={shakeKey}
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.2 }}
                className="will-change-transform"
            >
                {isFinished ? (
                   /* 1. RESULT SUMMARY (When game ends) */
                   <ResultSummary 
                        stats={stats} 
                        wpmHistory={wpmHistory} 
                        config={config} 
                        onRestart={resetGame} 
                   />
                ) : (
                    /* 2. TYPING AREA (When active) */
                    <Card 
                        id="typing-card"
                        onClick={handleClick} 
                        className={`relative p-10 min-h-[250px] flex flex-col justify-center cursor-text overflow-hidden transition-all duration-300 ${isFocused ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/5" : "opacity-80 border-transparent bg-muted/20"}`}
                    >
                        <CursorParticles ref={particleRef} />

                        {!isFocused && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-[2px] rounded-xl">
                                <span className="flex items-center gap-2 bg-background/90 px-6 py-3 rounded-full border shadow-lg font-medium animate-bounce text-primary">
                                    Click to Focus
                                </span>
                            </div>
                        )}
                        
                        <DisplayArea 
                            text={text} 
                            input={input} 
                            isFocused={isFocused} 
                            font={config.font} 
                            caretStyle={config.caret} 
                        />
                    </Card>
                )}
            </motion.div>
        </div>

        {/* D. ANALYSIS PANELS (Hidden when finished) */}
        {!isFinished && (
            <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Heatmap Keyboard</h3>
                    <MemoizedVirtualKeyboard nextChar={text[input.length]} keyStats={keyStats} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Performance</h3>
                    <MemoizedStatsChart data={wpmHistory} />
                </div>
            </div>
        )}

        {/* E. HISTORY LIST */}
        <div className="pb-12">
            <HistoryList history={history} />
        </div>

        {/* F. SEO CONTENT FOOTER */}
        <section className="mt-20 py-12 border-t border-border/40 text-muted-foreground/60 text-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <article>
              <h1 className="text-foreground font-bold text-lg mb-2">The Ultimate Aesthetic Typing Test</h1>
              <p className="mb-4">
                MonoType is a modern, <strong>free typing test</strong> designed to help you improve your <strong>WPM (Words Per Minute)</strong> and accuracy. 
                We focus on a smooth, distraction-free environment with <strong>mechanical keyboard sounds</strong> and real-time analytics.
              </p>
              <h2 className="text-foreground font-semibold mb-1">How to calculate WPM?</h2>
              <p>
                We use the standard formula: (Characters Typed / 5) / Time Elapsed. This ensures your speed is comparable to professional standards.
              </p>
            </article>
            <article>
              <h2 className="text-foreground font-semibold mb-2">Features</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Live Analytics:</strong> See your speed increase in real-time.</li>
                <li><strong>Theme Support:</strong> Dark mode, light mode, and custom themes.</li>
                <li><strong>Sound Packs:</strong> Experience Cherry MX Blue, Osu!, or Typewriter sounds.</li>
                <li><strong>Smart Drills:</strong> Practice your weakest keys with our AI-driven mode.</li>
              </ul>
            </article>
          </div>
        </section>

      </main>
    </div>
  );
}