"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsChart({ data }) {
  // Graceful empty state
  if (!data || data.length < 2) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center border-dashed text-muted-foreground/50">
        <div className="flex flex-col items-center gap-2">
           <span>Start typing to see live analysis...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[300px] animate-in fade-in slide-in-from-bottom-4 border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
          <span>Live WPM Trend</span>
          {data.length > 0 && (
            <span className="text-primary font-bold">
              Current: {data[data.length - 1].wpm}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[240px] w-full pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            
            <XAxis 
                dataKey="time" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}s`}
            />
            <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 'auto']}
                allowDecimals={false}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background/95 backdrop-blur p-3 shadow-lg ring-1 ring-black/5">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex flex-col">
                          <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                            Time
                          </span>
                          <span className="font-bold text-foreground">
                            {payload[0].payload.time}s
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                            Speed
                          </span>
                          <span className="font-bold text-primary">
                            {payload[0].value} WPM
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area
              type="monotone"
              dataKey="wpm"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWpm)"
              animationDuration={500}
              dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))', r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}