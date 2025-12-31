import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

const WORDS_EASY = "the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me".split(" ");
const WORDS_HARD = "conscience independent phenomenon embarrassment rhythm noticeable occurred privilege queue questionnaire restaurant separate specifically suspicious tyranny unanimous vacuum weird wonderful xylophone zeal".split(" ");

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "In the middle of every difficulty lies opportunity.",
  "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
  "Code is like humor. When you have to explain it, it is bad.",
  "Simplicity is the soul of efficiency.",
  "To be or not to be, that is the question.",
  "It does not matter how slowly you go as long as you do not stop."
];

// --- OPTIMIZED SOUND ENGINE (Singleton) ---
let audioCtx = null;
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playSynthSound = (theme) => {
  if (theme === 'none') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;

  if (theme === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.1);
  } else if (theme === 'osu') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
  } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
  }
};

export const useTypingGame = (duration = 30, difficulty = "easy", soundTheme = "none") => {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [input, setInput] = useState("");
  
  // UI States (Throttled)
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const [wpmHistory, setWpmHistory] = useState([]);
  const [finalKeyStats, setFinalKeyStats] = useState({});
  const [history, setHistory] = useState([]); // Local Storage History

  // Streak States
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Refs for Instant Logic
  const statsRef = useRef({ wpm: 0, accuracy: 100 });
  const keyStatsRef = useRef({}); 
  const startTimeRef = useRef(null);
  const durationRef = useRef(duration);
  const inputRef = useRef(""); 

  // --- Load History ---
  useEffect(() => {
    const saved = localStorage.getItem("type-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // --- Text Generation ---
  const generateText = useCallback((diff, length = 30) => {
    if (diff === "quote") {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    if (diff === "smart") {
       const weakKeys = Object.entries(keyStatsRef.current)
        .filter(([_, data]) => (data.total > 2 && (data.miss / data.total) > 0.1))
        .map(([key]) => key);
       
       if (weakKeys.length > 0) {
         const pool = [...WORDS_EASY, ...WORDS_HARD].filter(word => 
            word.split('').some(char => weakKeys.includes(char))
         );
         const finalPool = pool.length > 0 ? pool : WORDS_EASY;
         return Array.from({ length }, () => finalPool[Math.floor(Math.random() * finalPool.length)]).join(" ");
       }
    }
    const source = diff === "hard" ? WORDS_HARD : WORDS_EASY;
    return Array.from({ length }, () => source[Math.floor(Math.random() * source.length)]).join(" ");
  }, []);

  // --- Init/Reset ---
  useEffect(() => { resetGame(); }, [difficulty, duration]);

  const resetGame = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setInput("");
    inputRef.current = "";
    setWpmHistory([]);
    setStats({ wpm: 0, accuracy: 100 });
    setStreak(0);
    setText(generateText(difficulty));
    startTimeRef.current = null;
    statsRef.current = { wpm: 0, accuracy: 100 };
  };

  // --- Background Loop ---
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
         setTimeLeft(prev => {
            if (prev <= 1) {
                finishGame(); // Will trigger next effect
                return 0;
            }
            return prev - 1;
         });
         
         const elapsedTime = durationRef.current - (timeLeft - 1);
         if (elapsedTime > 0) {
             setWpmHistory(prev => [...prev, { time: elapsedTime, wpm: statsRef.current.wpm }]);
         }
         
         setStats({...statsRef.current}); // Sync UI
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- Input Handler ---
  const handleInput = (val) => {
    if (isFinished) return;

    // 1. Play Sound
    if (val.length > input.length) playSynthSound(soundTheme);

    // 2. Streak Logic
    if (val.length > input.length) {
        const charIndex = val.length - 1;
        const typedChar = val[charIndex];
        const targetChar = text[charIndex];

        if (typedChar === targetChar) {
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > maxStreak) setMaxStreak(newStreak);
                return newStreak;
            });
        } else {
            setStreak(0);
        }
    }

    // 3. Start Game
    if (!isActive && val.length === 1) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    // 4. Update Text
    setInput(val);
    inputRef.current = val;

    // 5. Stats Calculation
    const charIndex = val.length - 1;
    if (charIndex >= 0 && val.length > input.length) {
        const typedChar = val[charIndex];
        const targetChar = text[charIndex];
        if (targetChar) {
            const key = targetChar.toLowerCase();
            const current = keyStatsRef.current[key] || { total: 0, miss: 0 };
            keyStatsRef.current[key] = {
                total: current.total + 1,
                miss: typedChar !== targetChar ? current.miss + 1 : current.miss
            };
        }
    }

    if (startTimeRef.current) {
        const now = Date.now();
        const timeElapsedMinutes = (now - startTimeRef.current) / 60000;
        if (timeElapsedMinutes > 0) {
            let correctChars = 0;
            val.split("").forEach((char, i) => { if (char === text[i]) correctChars++; });
            
            const wpm = Math.round((correctChars / 5) / timeElapsedMinutes);
            const accuracy = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
            
            statsRef.current = { wpm, accuracy };
        }
    }

    if (val.length >= text.length) finishGame();
  };

  const finishGame = () => {
    setIsActive(false);
    setIsFinished(true);
    setStats({...statsRef.current});
    setFinalKeyStats({...keyStatsRef.current});
    
    // SAVE HISTORY
    const newResult = {
        id: Date.now(),
        wpm: statsRef.current.wpm,
        accuracy: statsRef.current.accuracy,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: difficulty === "quote" ? "Quote" : `${duration}s`
    };
    const newHistory = [newResult, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("type-history", JSON.stringify(newHistory));

    if (statsRef.current.wpm > 40 && statsRef.current.accuracy > 80) confetti();
  };

  return { 
    text, timeLeft, isActive, isFinished, input, stats, wpmHistory, keyStats: finalKeyStats, 
    streak, maxStreak, history, resetGame, handleInput 
  };
};