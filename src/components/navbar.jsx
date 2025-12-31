"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Github, Command, Keyboard } from "lucide-react"; // Removed Trophy, User
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Type", href: "/", icon: Keyboard },
];

export function Navbar({ onOpenCmd }) {
  const [hoveredPath, setHoveredPath] = React.useState(null);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl"
    >
      <div className="container flex h-16 max-w-5xl mx-auto items-center justify-between px-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center gap-2 group">
             <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:fill-current" />
             </div>
             <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
               MonoType
             </span>
           </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-background/50 p-1 backdrop-blur-md shadow-sm">
          {NAV_LINKS.map((link) => {
            const isActive = link.name === "Type";
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onMouseOver={() => setHoveredPath(link.name)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-foreground" : ""}`}>
                   {link.name}
                </span>
                {link.name === hoveredPath && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 z-0 rounded-full bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isActive && !hoveredPath && (
                   <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
           <Button 
             variant="outline" 
             size="sm" 
             className="hidden lg:flex h-9 gap-2 text-muted-foreground bg-muted/30 hover:bg-muted/50 border-muted-foreground/20"
             onClick={onOpenCmd}
           >
              <Command className="h-4 w-4" />
              <span className="text-xs">Cmd+K</span>
           </Button>

           <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
             <Link href="https://github.com" target="_blank">
               <Github className="h-5 w-5" />
             </Link>
           </Button>
           
           <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
           
           <ModeToggle />
        </div>
      </div>
    </motion.nav>
  );
}