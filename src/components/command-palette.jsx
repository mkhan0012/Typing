"use client";

import * as React from "react";
import { Laptop, Moon, Sun, Monitor, Timer, Keyboard, Volume2, Type } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"; // Ensure you installed shadcn command
import { useTheme } from "next-themes";

export function CommandPalette({ open, setOpen, config, setConfig }) {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command) => {
    command();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" /> Light Mode
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" /> Dark Mode
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Time Mode">
          <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, duration: 15})))}>
            <Timer className="mr-2 h-4 w-4" /> 15 Seconds
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, duration: 30})))}>
            <Timer className="mr-2 h-4 w-4" /> 30 Seconds
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, duration: 60})))}>
            <Timer className="mr-2 h-4 w-4" /> 60 Seconds
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Caret Style">
           <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, caret: "line"})))}>
            <Monitor className="mr-2 h-4 w-4" /> Line Caret
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, caret: "block"})))}>
            <Monitor className="mr-2 h-4 w-4" /> Block Caret
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, caret: "pacman"})))}>
            <Monitor className="mr-2 h-4 w-4" /> Pacman Mode
          </CommandItem>
        </CommandGroup>

         <CommandGroup heading="Sound Theme">
           <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, sound: "click"})))}>
            <Volume2 className="mr-2 h-4 w-4" /> Mechanical Click
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, sound: "osu"})))}>
            <Volume2 className="mr-2 h-4 w-4" /> Osu! Rhythm
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => setConfig(prev => ({...prev, sound: "none"})))}>
            <Volume2 className="mr-2 h-4 w-4" /> Mute Sound
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}