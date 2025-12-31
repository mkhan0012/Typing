import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

export function HistoryList({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Recent Tests
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((run, i) => (
          <motion.div 
            key={run.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors"
          >
             <div className="flex flex-col">
                <span className="text-2xl font-bold font-mono">{run.wpm} <span className="text-xs text-muted-foreground font-sans font-normal">WPM</span></span>
                <span className="text-xs text-muted-foreground">{run.date} • {run.mode}</span>
             </div>
             
             <div className="flex flex-col items-end">
                <div className={`text-sm font-bold ${run.accuracy === 100 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {run.accuracy}%
                </div>
                {run.wpm > 50 && <Zap className="w-3 h-3 text-yellow-500 mt-1" />}
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}