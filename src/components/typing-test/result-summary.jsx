"use client";

import { motion } from "framer-motion";
import { RefreshCw, Share2, Twitter, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsChart } from "@/components/typing-test/stats-chart";
import { useState } from "react";

export function ResultSummary({ stats, wpmHistory, config, onRestart }) {
  const [copied, setCopied] = useState(false);

  // Generate shareable text
  const handleShare = () => {
    const text = `🚀 I just hit ${stats.wpm} WPM with ${stats.accuracy}% Accuracy on MonoType!\n\nMode: ${config.difficulty} | ${config.duration}s\nTry it yourself!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/10">
        
        {/* Header */}
        <div className="bg-muted/50 p-6 border-b border-border/50 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Test Result</h2>
                <p className="text-muted-foreground text-sm">
                   {new Date().toLocaleString()} • {config.difficulty} mode
                </p>
            </div>
            <div className="flex gap-2">
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="gap-2 transition-all"
                 >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Copied!" : "Share"}
                 </Button>
            </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50">
            <div className="bg-card p-6 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">WPM</span>
                <span className="text-5xl font-black text-primary mt-2">{stats.wpm}</span>
            </div>
             <div className="bg-card p-6 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Accuracy</span>
                <span className="text-5xl font-black mt-2">{stats.accuracy}%</span>
            </div>
             <div className="bg-card p-6 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Time</span>
                <span className="text-2xl font-bold mt-2">{config.duration}s</span>
            </div>
             <div className="bg-card p-6 flex flex-col items-center justify-center text-center">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Raw</span>
                <span className="text-2xl font-bold mt-2">{stats.wpm + Math.round((100 - stats.accuracy) / 2)}</span>
            </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-card">
            <div className="mb-2 flex items-center gap-2">
                 <span className="text-xs font-semibold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">Speed Trend</span>
            </div>
            <div className="h-[150px] w-full border rounded-lg bg-background/50 overflow-hidden">
                <StatsChart data={wpmHistory} />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-muted/30 border-t flex justify-center">
             <Button 
                onClick={onRestart} 
                size="lg" 
                className="w-full md:w-auto min-w-[200px] rounded-full gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
             >
                <RefreshCw className="w-4 h-4" /> Start New Test
             </Button>
        </div>

      </Card>
    </motion.div>
  );
}