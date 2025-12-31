import { motion } from "framer-motion";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export function VirtualKeyboard({ nextChar }) {
  return (
    <div className="flex flex-col items-center gap-2 mt-8 opacity-50 hover:opacity-100 transition-opacity">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((key) => {
            const isActive = nextChar?.toLowerCase() === key;
            return (
              <motion.div
                key={key}
                animate={{ 
                    scale: isActive ? 1.1 : 1,
                    borderColor: isActive ? "var(--primary)" : "transparent",
                    backgroundColor: isActive ? "var(--primary)" : "var(--muted)"
                }}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-md border text-sm font-bold uppercase
                    ${isActive ? "text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"}
                `}
              >
                {key}
              </motion.div>
            );
          })}
        </div>
      ))}
      <div className="w-64 h-8 bg-muted rounded-md mt-2 flex items-center justify-center text-xs text-muted-foreground">SPACE</div>
    </div>
  );
}